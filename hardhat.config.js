/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const INFURA_API_URL = process.env.INFURA_API_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const WALLET_SECRET_1 = process.env.WALLET_SECRET_1;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: `${INFURA_API_URL}`,
      accounts: [SEPOLIA_PRIVATE_KEY, WALLET_SECRET_1],
    },
  },
};
