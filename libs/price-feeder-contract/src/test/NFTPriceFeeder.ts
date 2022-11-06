import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { defaultAbiCoder } from "@ethersproject/abi";
import { formatEther, keccak256 } from "ethers/lib/utils";
import { NFTPriceFeeder } from "../typechain-types";

import web3 from "web3";

const TELLOR_AUTOPAY = "0x1775704809521D4D7ee65B6aFb93816af73476ec";
const TELLOR_PLAYGROUND = "0x3251838bd813fdf6a97D32781e011cce8D225d59";

describe("NFTPriceFeeder", function () {
  async function deployPriceFeeder() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const NFTPriceFeeder = await ethers.getContractFactory("NFTPriceFeeder");
    const nftPriceFeeder = (await NFTPriceFeeder.deploy(
      TELLOR_AUTOPAY,
      TELLOR_PLAYGROUND
    )) as NFTPriceFeeder;
    return { nftPriceFeeder };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { nftPriceFeeder } = await loadFixture(deployPriceFeeder);
      expect(nftPriceFeeder).to.be.ok;
    });

    it.only("Logs gas cost of writing to playground", async function () {
      const { nftPriceFeeder } = await loadFixture(deployPriceFeeder);

      const args = defaultAbiCoder.encode(
        ["uint", "address", "uint"],
        [1, "0x5180db8F5c931aaE63c74266b211F580155ecac8", 0]
      );
      const queryData = defaultAbiCoder.encode(
        ["string", "bytes"],
        ["MimicryCollectionStat", args]
      );
      const queryId = keccak256(queryData);

      const tx = await nftPriceFeeder._mockWriteToPlayground(
        queryId,
        ethers.utils.formatBytes32String("hello"),
        0,
        queryData
      );

      const receipt = await tx.wait();

      const transactionCost = receipt.cumulativeGasUsed.mul(
        receipt.effectiveGasPrice
      );
      const asMatic = formatEther(transactionCost);

      console.log({
        transactionCost: transactionCost.toString(),
        asMatic: asMatic.toString(),
      });

      expect(true).to.be.ok;
    });
  });
});
