const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

STOHCOINONEERC20 = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
STOHCOINTWOERC20 = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
UNISWAPV2ROUTER02 = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
UNISWAPV2PAIR = '0x244C9A49EA0616c6645E0dD15f6AeFE5B049dc79'

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
// npx hardhat run --network localhost scripts/localhost/02_addLiquidityLocalhost.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });