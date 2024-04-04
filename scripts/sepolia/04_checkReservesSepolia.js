const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

UNISWAPV2PAIR = '0x187ab73d1543dCC7AEF65062dF6BB11aaBBdC5C6'

const artifacts = {
    UniswapV2PairArtifact: require('../../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json'),
};
const { ethers } = require('hardhat')

async function main() {
    const [account0, account1] = await ethers.getSigners();
    const provider = waffle.provider;
    owner = account0 //changable, account0 is main dev, account1 is sec dev
    console.log("owner is", owner.address)

    const UniswapV2PairContract = new Contract(
        UNISWAPV2PAIR,
        artifacts.UniswapV2PairArtifact.abi,
        provider
    )

    reserves0 = await UniswapV2PairContract.getReserves()
    console.log('reserves tx = ', reserves0)
}

// Run the script
// npx hardhat run --network sepolia scripts/sepolia/04_checkReservesSepolia.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });