import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const TELLOR_PLAYGROUND_ADDRESS = "0x3251838bd813fdf6a97D32781e011cce8D225d59";

describe("NFTPriceFeeder", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;
    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const NFTPriceFeeder = await ethers.getContractFactory("NFTPriceFeeder");
    const nftPriceFeeder = await NFTPriceFeeder.deploy(
      TELLOR_PLAYGROUND_ADDRESS
    );
    return { nftPriceFeeder };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { nftPriceFeeder } = await loadFixture(deployOneYearLockFixture);
      expect(nftPriceFeeder).to.be.ok;
    });
  });
});
