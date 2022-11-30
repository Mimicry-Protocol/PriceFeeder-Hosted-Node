import { ethers } from "hardhat";
import { NFTPriceFeeder } from "../typechain-types";

const TELLOR = process.env.TELLOR_CONTRACT_ADDRESS;
const TELLOR_AUTOPAY = process.env.TELLOR_AUTOPAY_CONTRACT_ADDRESS;
const TELLOR_PLAYGROUND = process.env.TELLOR_PLAYGROUND_CONTRACT_ADDRESS;

// "command": "npx hardhat verify {args.contractAddress} --network {args.network} \"{args.constructorArg}\"",

async function main() {
  const NFTPriceFeeder = await ethers.getContractFactory("NFTPriceFeeder");
  const nftPriceFeeder = (await NFTPriceFeeder.deploy(
    TELLOR,
    TELLOR_AUTOPAY,
    TELLOR_PLAYGROUND
  )) as NFTPriceFeeder;

  await nftPriceFeeder.deployed();

  console.log(`NFTPriceFeeder deployed to: ${nftPriceFeeder.address}

  Verify command:
  "npx hardhat verify ${nftPriceFeeder.address} --network mumbai "${TELLOR}" "${TELLOR_AUTOPAY}" "${TELLOR_PLAYGROUND}"

`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
