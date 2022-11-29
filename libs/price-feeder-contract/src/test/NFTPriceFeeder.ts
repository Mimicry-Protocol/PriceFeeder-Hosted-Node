import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { defaultAbiCoder } from "@ethersproject/abi";
import { formatEther, keccak256, parseEther } from "ethers/lib/utils";
import { NFTPriceFeeder, ERC20__factory } from "../typechain-types";

import web3 from "web3";
import { BigNumber, getDefaultProvider } from "ethers";

const TELLOR = "0x8f55D884CAD66B79e1a131f6bCB0e66f4fD84d5B";
const TELLOR_AUTOPAY = "0x1775704809521D4D7ee65B6aFb93816af73476ec";
const TELLOR_PLAYGROUND = "0x3251838bd813fdf6a97D32781e011cce8D225d59";
const TRB_TOKEN = "0xCE4e32fE9D894f8185271Aa990D2dB425DF3E6bE";

const defaultChainId = 1;
const defaultMetric = 0;
const defaultTrbReward = parseEther("0.005");
const defaultRewardIncreasePerSecond = parseEther("0.0005");
const defaultAutopayInterval = 1800;
const defaultWindow = 900;
const defaultPriceVariabilityThreshold = 50;
const defaultAmount = parseEther("1");

async function createFeed(
  nftPriceFeeder: NFTPriceFeeder,
  collectionAddress: string
) {
  const tellorToken = ERC20__factory.connect(TRB_TOKEN, ethers.provider);

  const signer = await ethers.getImpersonatedSigner(
    process.env.SIGNER_WITH_TRB_ADDRESS!
  );

  await tellorToken
    .connect(signer)
    .approve(nftPriceFeeder.address, parseEther("1"));

  return nftPriceFeeder
    .connect(signer)
    .createFeed(
      defaultChainId,
      collectionAddress,
      defaultMetric,
      defaultTrbReward,
      defaultRewardIncreasePerSecond,
      defaultAutopayInterval,
      defaultWindow,
      defaultPriceVariabilityThreshold,
      defaultAmount
    );
}

describe("NFTPriceFeeder", function () {
  async function deployPriceFeeder() {
    // Contracts are deployed using the first signer/account by default
    const signers = await ethers.getSigners();
    const NFTPriceFeeder = await ethers.getContractFactory("NFTPriceFeeder");
    const nftPriceFeeder = (await NFTPriceFeeder.deploy(
      TELLOR,
      TELLOR_AUTOPAY,
      TELLOR_PLAYGROUND
    )) as NFTPriceFeeder;

    const tellorToken = ERC20__factory.connect(TRB_TOKEN, ethers.provider);

    return { nftPriceFeeder, tellorToken, signers };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { nftPriceFeeder } = await loadFixture(deployPriceFeeder);
      expect(nftPriceFeeder).to.be.ok;
    });

    it("Creates a feed", async function () {
      const { nftPriceFeeder } = await loadFixture(deployPriceFeeder);

      const cryptoCovenTx = await createFeed(
        nftPriceFeeder,
        "0x5180db8f5c931aae63c74266b211f580155ecac8"
      );

      const cryptoCovenReceipt = await cryptoCovenTx.wait();

      const feedCreatedEvent = cryptoCovenReceipt.events?.find(
        (item) => item.event === "FeedCreated"
      );

      const eventArgs = {
        feedId: feedCreatedEvent?.args?.feedId,
        chainId: feedCreatedEvent?.args?.chainId,
        collectionAddress: feedCreatedEvent?.args?.collectionAddress,
        metric: feedCreatedEvent?.args?.metric,
        amount: feedCreatedEvent?.args?.amount,
        createdAt: feedCreatedEvent?.args?.createdAt,
        createdBy: feedCreatedEvent?.args?.createdBy,
      };

      expect(eventArgs.feedId).to.be.string;
      expect(BigNumber.from(eventArgs.createdAt).gt("0")).to.be.true;
      expect(BigNumber.from(eventArgs.chainId).eq(BigNumber.from("1"))).to.be
        .true;
      expect(BigNumber.from(eventArgs.metric).eq(BigNumber.from("0"))).to.be
        .true;
      expect(
        BigNumber.from(eventArgs.amount).eq(
          BigNumber.from("1000000000000000000")
        )
      ).to.be.true;

      expect(eventArgs).to.include({
        collectionAddress: "0x5180db8F5c931aaE63c74266b211F580155ecac8",
        createdBy: "0xfa6b3dF826636Eb76E23C1Ee38180dB3b8f60a86",
      });
    });

    it.only("Creates a feed", async function () {
      const { nftPriceFeeder } = await loadFixture(deployPriceFeeder);

      await createFeed(
        nftPriceFeeder,
        // Crypto Coven
        "0x5180db8f5c931aae63c74266b211f580155ecac8"
      );

      await createFeed(
        nftPriceFeeder,
        // Wanderers NFT
        "0x8184a482A5038B124d933B779E0Ea6e0fb72F54E"
      );

      const queriesWithFeeds = await nftPriceFeeder.getAllQueriesWithFeeds();

      expect(queriesWithFeeds.length).to.equal(2);

      queriesWithFeeds.forEach(([query, feed]) => {
        expect(typeof query.collectionAddress).to.be.string;
        expect(query.collectionAddress.length).to.be.greaterThan(0);
        console.log(query, feed);
      });
    });
  });
});
