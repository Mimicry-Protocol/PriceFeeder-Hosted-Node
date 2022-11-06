import { Collection, MongoClient, ObjectId } from 'mongodb';
import * as express from 'express';
import * as dune from './utils/dune';
import * as reservoir from './utils/reservoir';

const STAT_TYPES = ['TAMI', 'MARKET_CAP'] as const;

const app = express();

async function feeder() {
  const client = await MongoClient.connect(
    'mongodb://admin:password@localhost:27017'
  );
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

  console.log({ chainId, address, statType });

  res.send({
    stat: 'Implement this...',
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
    const { chainId = '1', address, stat } = req.query;

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

    console.log({ chainId, address, statType });
    
    // Check to see if we have this collection saved in the db
    const db = await feeder();
    const query = { 
      chainId: chainId,
      address: address
    };
    const collection = await db.collection("nftCollections").findOne(query);
    const queryLimit = 10000;
    let done = false;
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
      const newCollection = await db.collection("nftCollections").insertOne({
        ...query,
        ...metadata,
        createdAt: new Date()
      });
      collectionId = newCollection.insertedId;
      db.collection("nftSales").createIndex({ nftCollection_id: 1 });

    } else {
      // found the collection...
      collectionId = collection._id;
    }

    while (!done) {
      // Count the existing records
      const offset = await db.collection("nftSales").countDocuments({
        nftCollection_id: collectionId
      });

      // Get a page of sales history
      const nftSales = await dune.getNFTCollectionSales(
        address, 
        queryLimit, 
        offset, 
        'block_time,nft_token_id,usd_amount,tx_hash,buyer,seller');

      // Quit if there is no more sales history to page through 
      if (nftSales.length === 0) {
        done = true;
        break;
      }

      let sales = [];
      for (const sale of nftSales) {
        sales.push({
          ...sale,
          nftCollection_id: collectionId
        });
      }
      await db.collection("nftSales").insertMany(sales);
    }

    res.send({
      response: 'Collection update successful',
    });
  } catch (error) {
    handleError(res, 400, error.message);
  }
});

/*
 * Init
 */
const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

/**
 * Clean Error Response
 * 
 * @param response Express response object
 * @param statusCode The status code to return
 * @param message The error message
 */
function handleError(response: express.Response, statusCode: number, message: string) {
  const data = {
    "timestamp": Date.now(),
    "status": statusCode,
    "error": message
  };

  console.error(data);
  response.status(statusCode).send(data);
  response.end();
}