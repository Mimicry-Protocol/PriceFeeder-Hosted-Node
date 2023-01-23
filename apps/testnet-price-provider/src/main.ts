import {
  NFTPriceFeeder__factory,
  NFTPriceFeeder,
  TellorPlayground,
  TellorPlayground__factory,
} from '@price-feeder/price-feeder-contract';
import { Network, Alchemy, Wallet, AlchemyProvider } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as dotenv from 'dotenv';
dotenv.config();

import { logger } from './utils/logger';

type ContractUtils = {
  alchemy: Alchemy;
  wallet: Wallet;
  priceFeederContract: NFTPriceFeeder;
  provider: AlchemyProvider;
  tellorPlaygroundContract: TellorPlayground;
};

let contractUtils: ContractUtils | null = null;

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

  const tellorPlaygroundContract = TellorPlayground__factory.connect(
    '0x3251838bd813fdf6a97D32781e011cce8D225d59',
    provider
  );

  contractUtils = {
    alchemy,
    wallet,
    priceFeederContract,
    provider,
    tellorPlaygroundContract,
  };

  return contractUtils;
}

const testFeeds = [
  {
    collection: 'Crypto Coven',
    address: '0x5180db8f5c931aae63c74266b211f580155ecac8',
    stat: 1,
  },
  {
    collection: 'World of Women',
    address: '0xe785e82358879f061bc3dcac6f0444462d4b5330',
    stat: 0,
  },
  {
    collection: 'Crypto Punks',
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    stat: 0,
  },
  {
    collection: 'Azuki',
    address: '0xe785e82358879f061bc3dcac6f0444462d4b5330',
    stat: 1,
  },
];

function buildQuery({
  chainId,
  address,
  metric,
}: {
  chainId: number;
  address: string;
  metric: number;
}) {
  const queryData = ethers.utils.defaultAbiCoder.encode(
    ['string', 'bytes'],
    [
      'MimicryCollectionStat',
      ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'address', 'uint256'],
        [chainId, address, metric]
      ),
    ]
  );

  const queryId = ethers.utils.keccak256(queryData);

  return { queryId, queryData };
}

async function monitorFeeds() {
  const { tellorPlaygroundContract, wallet } = await getContractUtils();

  for (const feed of testFeeds) {
    try {
      const { value, stat } = await fetch(
        `${process.env.PRICE_FEEDER_API_ORIGIN}/api/stats?address=${feed.address}&stat=${feed.stat}`
      ).then((res) => res.json());

      const { queryId, queryData } = buildQuery({
        chainId: 1,
        address: feed.address,
        metric: feed.stat,
      });

      const tx = await tellorPlaygroundContract
        .connect(wallet)
        .submitValue(
          queryId,
          parseEther((value as number) + '').toHexString(),
          0,
          queryData
        );
      await tx.wait();

      console.log(`Submitted ${stat} of ${feed.collection}: ${value}`);
    } catch (error) {
      logger.error(error);
    }
  }

  await new Promise((res) => {
    // Wait one hour before writing values again
    setTimeout(res, 1000 * 60 * 60);
  });

  monitorFeeds();
}

async function main() {
  console.log('Starting testnet-price-provider');
  try {
    await monitorFeeds();
  } catch (error) {
    logger.error(error);
  }
}

main();
