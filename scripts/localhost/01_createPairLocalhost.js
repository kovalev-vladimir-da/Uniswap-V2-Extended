const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

UNISWAPV2FACTORY = '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690'
STOHCOINONEERC20 = '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9'
STOHCOINTWOERC20 = '0x851356ae760d987E095750cCeb3bC6014560891C'

const artifacts = {
    UniswapV2FactoryArtifact: require('../../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json'),
    UniswapV2PairArtifact: require('../../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json'),
    StohCoinOneERC20Artifact: require('../../artifacts/contracts/tokens/StohCoinOneERC20.sol/StohCoinOneERC20.json'),
    StohCoinTwoERC20Artifact: require('../../artifacts/contracts/tokens/StohCoinTwoERC20.sol/StohCoinTwoERC20.json')
};
const { ethers } = require('hardhat')

async function main() {
    const [account0, account1] = await ethers.getSigners();
    const provider = waffle.provider;
    owner = account0 //changable, account0 is main dev, account1 is sec dev
    console.log("owner is", owner.address)

    const UniswapV2FactoryContract = new Contract(
        UNISWAPV2FACTORY,
        artifacts.UniswapV2FactoryArtifact.abi,
        provider
    )

    let UniswapV2PairAddress = await UniswapV2FactoryContract.getPair(
        STOHCOINONEERC20,
        STOHCOINTWOERC20
    )

    if (UniswapV2PairAddress != '0x0000000000000000000000000000000000000000') {
        console.log('Pool exists with address ', UniswapV2PairAddress)
    } else {
        console.log('Creating pool')
        const tx1 = await UniswapV2FactoryContract.connect(owner).createPair(
            STOHCOINONEERC20,
            STOHCOINTWOERC20
        )
        await tx1.wait()
        
        UniswapV2PairAddress = await UniswapV2FactoryContract.getPair(
            STOHCOINONEERC20,
            STOHCOINTWOERC20
        )

        console.log('UniswapV2PairAddress', UniswapV2PairAddress)
    }
}

// Run the script
// npx hardhat run --network localhost scripts/localhost/01_createPairLocalhost.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });