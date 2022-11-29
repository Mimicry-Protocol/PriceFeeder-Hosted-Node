import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-abi-exporter";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    root: "./src",
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MUMBAI_URL!,
      },
    },
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI_URL,
      accounts: [process.env.CONTRACT_DEPLOYER_PK!],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  abiExporter: {
    path: "../abis",
    runOnCompile: true,
    spacing: 2,
  },
};

export default config;
