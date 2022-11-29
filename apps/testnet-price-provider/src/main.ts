import * as express from 'express';
import {
  NFTPriceFeeder__factory,
  NFTPriceFeeder,
} from '@price-feeder/price-feeder-contract';
import { Network, Alchemy, Wallet, AlchemyProvider } from 'alchemy-sdk';

let contractUtils: {
  alchemy: Alchemy;
  wallet: Wallet;
  priceFeederContract: NFTPriceFeeder;
  provider: AlchemyProvider;
} | null = null;

async function getContractUtils() {
  if (contractUtils) {
    return contractUtils;
  }

  const alchemy = new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.MATIC_MUMBAI,
  });

  const provider = await alchemy.config.getProvider();
  const wallet = new Wallet(process.env.PRICE_PROVIDER_PK, provider);
  const priceFeederContract = NFTPriceFeeder__factory.connect(
    process.env.NEXT_PUBLIC_PRICE_FEEDER_ADDRESS,
    provider
  );

  console.log(
    'NEXT_PUBLIC_PRICE_FEEDER_ADDRESS',
    process.env.NEXT_PUBLIC_PRICE_FEEDER_ADDRESS
  );

  contractUtils = {
    alchemy,
    wallet,
    priceFeederContract,
    provider,
  };

  return contractUtils;
}

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to testnet-price-provider!' });
});

app.get('/api/feeds', async (req, res) => {
  const { priceFeederContract } = await getContractUtils();

  const feeds = await priceFeederContract.getAllFeeds();

  res.send({
    feeds: feeds,
  });
});

const port = process.env.port || 3001;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
