import { MongoClient } from 'mongodb';
import * as express from 'express';
import * as dune from './utils/dune';

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
  const collections = await db.collection('collections').find();

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
    res.status(400).send({
      error: 'Invalid query parameters',
    });
    return;
  }

  const statNumber = parseInt(stat, 10);
  const statType = STAT_TYPES[statNumber];

  if (!statType) {
    res.status(400).send({
      error: 'Invalid stat type',
    });
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
  const { chainId = '1', address, stat } = req.query;

  if (
    typeof chainId !== 'string' ||
    typeof address !== 'string' ||
    typeof stat !== 'string'
  ) {
    res.status(400).send({
      error: 'Invalid query parameters',
    });
    return;
  }

  const statNumber = parseInt(stat, 10);
  const statType = STAT_TYPES[statNumber];

  if (!statType) {
    res.status(400).send({
      error: 'Invalid stat type',
    });
    return;
  }

  console.log({ chainId, address, statType });
  
  // Check to see if we have this collection saved in the db
  const db = await feeder();
  const query = { 
    chainId: chainId,
    address: address
  };
  const collection = await db.collection("NFTCollections").find(query).toArray();

  if (collection.length === 0) {
    // no collection found... let's create one
    const insertCollection = await db.collection("NFTCollections").insertOne(query);
    
    // Get sales hisory and create one record per transaction
    const salesHistory = await dune.getNFTCollectionSales(address, 10);
    
  } else {
    // found the collection... let's just save the latest transactions
    console.log('collection exists');

    // First get the number of transactions already saved and use that for the offset
  }
  console.log(collection);

  res.send({
    response: collection,
  });
});

/*
 * Init
 */

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
