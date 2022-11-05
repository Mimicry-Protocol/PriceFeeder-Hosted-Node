import { MongoClient } from 'mongodb';
import * as express from 'express';

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
  const { chainId, address, stat } = req.query;

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
  const { chainId, address, stat } = req.query;

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
    status: 123,
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
