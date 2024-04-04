const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

UNISWAPV2FACTORY = '0x2f07Ba49de2424e417a5F2ccf21aa88213b9544f'
STOHCOINONEERC20 = '0x8Cf064CE89EBc581860A5e406fF66349664439cc'
STOHCOINTWOERC20 = '0xd9BC5353C5A2f3d83d225d8Dc599489cd96C727e'

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
// npx hardhat run --network sepolia scripts/sepolia/01_createPairSepolia.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });