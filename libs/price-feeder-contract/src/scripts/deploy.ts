import { ethers } from "hardhat";
import { NFTPriceFeeder } from "../typechain-types";

const TELLOR = "0x8f55D884CAD66B79e1a131f6bCB0e66f4fD84d5B";
const TELLOR_AUTOPAY = "0x1775704809521D4D7ee65B6aFb93816af73476ec";
const TELLOR_PLAYGROUND = "0x3251838bd813fdf6a97D32781e011cce8D225d59";

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


  "npx hardhat verify ${nftPriceFeeder.address} --network mumbai \\"${TELLOR}\\" \\"${TELLOR_AUTOPAY}\\" \\"${TELLOR_PLAYGROUND}\\""`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
