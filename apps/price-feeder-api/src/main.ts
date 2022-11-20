import { Db, MongoClient, ObjectId } from 'mongodb';
import { tami } from '@mimicry/tami';
import * as express from 'express';
import * as dune from './utils/dune';
import * as reservoir from './utils/reservoir';
import cors = require('cors');

/**
 * @todo: Add a param for currency
 */
const STAT_TYPES = ['TAMI', 'MARKET_CAP', 'FLOOR'] as const;

const app = express();
app.use(cors());

function getClient() {
  return MongoClient.connect(process.env.MONGODB_URL);
}

async function feeder() {
  const client = await getClient();
  return client.db('feeder');
}

/*
 * GET
 */

// Get all NFT collections
//========================
app.get('/api/collections', async (req, res) => {
  const db = await feeder();
  const collections = await db.collection('nftCollections').find();

  res.send({
    collections: await collections.toArray(),
  });
});

// Get stat for collection
//========================
app.get('/api/stats', async (req, res) => {
  const { chainId = '1', address, stat } = req.query;
  console.log({ chainId, address, stat });

  if (
    typeof chainId !== 'string' ||
    typeof address !== 'string' ||
    typeof stat !== 'string'
  ) {
    handleError(res, 400, 'Invalid query parameters');
    return;
  }

  const statNumber = parseInt(stat, 10);
  const statType = STAT_TYPES[statNumber];

  if (!statType) {
    handleError(res, 400, 'Invalid stat type');
    return;
  }

  if (statType === 'FLOOR') {
    res.send({
      address: address,
      stat: statType,
      value: await reservoir.getCollectionFloorPrice(address),
    });
    return;
  }

  // Check to see if we have this collection saved in the db
  const db = await feeder();
  const query = {
    chainId: chainId,
    address: address,
  };
  const collection = await db.collection('nftCollections').findOne(query);
  if (collection === null) {
    handleError(res, 400, 'Invalid collection');
    return;
  }

  // Make sure we have the latest data
  await updateNftCollectionSalesHistory(db, collection._id, address, 500);

  // Get all sales from this collection
  const sales = await db
    .collection('nftSales')
    .find({
      nftCollection_id: collection._id,
    })
    .sort({ block_time: -1 })
    .toArray();

  const cleanSales = sales.map((sale) => ({
    itemId: sale.nft_token_id,
    timestamp: new Date(sale.block_time),
    price: sale.usd_amount,
  }));

  let statValue: number;
  if (statType === 'TAMI') {
    statValue = tami(cleanSales);
  } else if (statType === 'MARKET_CAP') {
    // get the latest sale price for every nft in the collection and use
    // the lower of floor or the sale price. Then sum the total.
    const floor = await reservoir.getCollectionFloorPrice(address); // default USD

    const items = [];
    statValue = 0;
    for (const sale of cleanSales) {
      if (items[sale.itemId] === undefined) {
        items[sale.itemId] = sale.price > floor ? sale.price : floor;
        statValue += items[sale.itemId];
      }
    }
  }

  res.send({
    address: address,
    stat: statType,
    value: statValue,
  });
});

// Get available feeds
//====================
app.get('/api/feeds', async (req, res) => {
  res.send({
    feeds: [],
  });
});

/*
 * POST
 */

// Create new stats feed
//================
app.post('/api/stats', async (req, res) => {
  try {
    const { chainId = '1', address } = req.query;
    const { 'x-api-secret': secret } = req.headers;

    if (secret !== process.env.API_ACCESS_SECRET) {
      handleError(res, 400, 'Invalid secret key');
      return;
    }

    if (typeof chainId !== 'string' || typeof address !== 'string') {
      handleError(res, 400, 'Invalid query parameters');
      return;
    }

    console.log({ chainId, address });

    // Check to see if we have this collection saved in the db
    const db = await feeder();
    const query = {
      chainId: chainId,
      address: address,
    };
    const collection = await db.collection('nftCollections').findOne(query);
    let collectionId: ObjectId;

    /**
     * @todo: Add a status flag that lets us know the collection is waiting
     * on sales history so there is no need to create a duplicate record. Don't
     * do this until we improve the types in the dune util to support strict
     * typed return params. e.g. block_time,nft_token_id,usd_amount.
     */
    if (collection === null) {
      // no collection found... let's create one
      const metadata = await reservoir.getCollectionMetadata(address);
      const newCollection = await db.collection('nftCollections').insertOne({
        ...query,
        ...metadata,
        createdAt: new Date(),
      });
      collectionId = newCollection.insertedId;
      db.collection('nftSales').createIndex({ nftCollection_id: 1 });
    } else {
      // found the collection...
      collectionId = collection._id;
    }

    await updateNftCollectionSalesHistory(db, collectionId, address);

    res.send({
      response: 'Collection update successful',
    });
  } catch (error) {
    handleError(res, 400, error.message);
  }
});

async function updateNftCollectionSalesHistory(
  db: Db,
  collectionId: ObjectId,
  collectionAddress: string,
  queryLimit = 10000
) {
  let done = false;

  while (!done) {
    // Count the existing records
    const offset = await db.collection('nftSales').countDocuments({
      nftCollection_id: collectionId,
    });

    // Get a page of sales history
    const nftSales = await dune.getNFTCollectionSales(
      collectionAddress,
      queryLimit,
      offset,
      'block_time,nft_token_id,usd_amount,tx_hash,buyer,seller'
    );

    // Quit if there is no more sales history to page through
    if (nftSales.length === 0) {
      done = true;
      break;
    }

    const sales = nftSales.map((sale) => ({
      ...sale,
      nftCollection_id: collectionId,
    }));

    await db.collection('nftSales').insertMany(sales);
  }
}

/*
 * Init
 */

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);

/**
 * Clean Error Response
 *
 * @param response Express response object
 * @param statusCode The status code to return
 * @param message The error message
 */
function handleError(
  response: express.Response,
  statusCode: number,
  message: string
) {
  const data = {
    timestamp: Date.now(),
    status: statusCode,
    error: message,
  };

  console.error(data);
  response.status(statusCode).send(data);
  response.end();
}
