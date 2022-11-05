import { ethers } from "hardhat";

async function main() {
  const NFTPriceFeeder = await ethers.getContractFactory("NFTPriceFeeder");
  const nftPriceFeeder = await NFTPriceFeeder.deploy();

  await nftPriceFeeder.deployed();

  console.log(`NFTPriceFeeder deployed to ${nftPriceFeeder.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
