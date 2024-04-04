const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

STOHCOINONEERC20 = '0x8Cf064CE89EBc581860A5e406fF66349664439cc'
STOHCOINTWOERC20 = '0xd9BC5353C5A2f3d83d225d8Dc599489cd96C727e'
UNISWAPV2ROUTER02 = '0x4749a25F818E2a62c28A35982Ad13136F73AfD3B'
UNISWAPV2PAIR = '0x187ab73d1543dCC7AEF65062dF6BB11aaBBdC5C6'

const artifacts = {
    UniswapV2Router02Artifact: require('../../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'),
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

    const StohCoinOneERC20Contract = new Contract(
        STOHCOINONEERC20,
        artifacts.StohCoinOneERC20Artifact.abi,
        provider
    )
    const StohCoinTwoERC20Contract = new Contract(
        STOHCOINTWOERC20,
        artifacts.StohCoinTwoERC20Artifact.abi,
        provider
    )
    const UniswapV2Router02Contract = new Contract(
        UNISWAPV2ROUTER02,
        artifacts.UniswapV2Router02Artifact.abi,
        provider
    )
    const UniswapV2PairContract = new Contract(
        UNISWAPV2PAIR,
        artifacts.UniswapV2PairArtifact.abi,
        provider
    )

    console.log('contracts connected')

    const approval1 = await StohCoinOneERC20Contract.connect(
        owner
    ).approve(
        UNISWAPV2ROUTER02,
        constants.MaxUint256
    )
    approval1.wait()

    const approval2 = await StohCoinTwoERC20Contract.connect(
        owner
    ).approve(
        UNISWAPV2ROUTER02,
        constants.MaxUint256
    )
    approval2.wait()

    const approval3 = await StohCoinOneERC20Contract.connect(
        owner
    ).approve(
        UNISWAPV2PAIR,
        constants.MaxUint256
    )
    approval3.wait()

    const approval4 = await StohCoinTwoERC20Contract.connect(
        owner
    ).approve(
        UNISWAPV2PAIR,
        constants.MaxUint256
    )
    approval4.wait()

    const token0Amount = utils.parseEther('100')
    const token1Amount = utils.parseEther('100')

    const deadline = Math.floor(Date.now() / 1000 + (10 * 60))

    reserves0 = await UniswapV2PairContract.getReserves()
    console.log('reserves before tx = ', reserves0)

    const addLiquidityTx = await UniswapV2Router02Contract.connect(
        owner
    ).addLiquidity(
        STOHCOINONEERC20,
        STOHCOINTWOERC20,
        token0Amount,
        token1Amount,
        0,
        0,
        owner.address,
        deadline,
        { gasLimit: utils.hexlify(1000000) }
    )
    addLiquidityTx.wait()
    console.log('liquidity add complete')

    reserves1 = await UniswapV2PairContract.getReserves()
    console.log('reserves after tx = ', reserves1)
}

// Run the script
// npx hardhat run --network sepolia scripts/sepolia/02_addLiquiditySepolia.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });