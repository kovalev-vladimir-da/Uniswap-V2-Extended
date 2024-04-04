const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

STOHCOINONEERC20 = '0x9A676e781A523b5d0C0e43731313A708CB607508'
STOHCOINTWOERC20 = '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'
UNISWAPV2ROUTER02 = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'
UNISWAPV2PAIR = '0x657d0319Bbc70f2D7d6DF9447Bf1eaDf36938bE6'

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

    const token0Amount = utils.parseEther('1')
    const token1Amount = utils.parseEther('2')

    const deadline = Math.floor(Date.now() / 1000 + (10 * 60))

    reserves0 = await UniswapV2PairContract.getReserves()
    console.log('reserves before tx = ', reserves0)

    const swapTokensTx = await UniswapV2Router02Contract.connect(
        owner
    ).swapExactTokensForTokens(
        token0Amount,
        0,
        [STOHCOINONEERC20, STOHCOINTWOERC20],
        owner.address,
        deadline,
        { gasLimit: utils.hexlify(1000000) }
    )
    swapTokensTx.wait()
    console.log('swap complete')

    reserves1 = await UniswapV2PairContract.getReserves()
    console.log('reserves after tx = ', reserves1)

    const removeLiquidityTx = await UniswapV2Router02Contract.connect(
        owner
    ).removeLiquidity(
        STOHCOINONEERC20,
        STOHCOINTWOERC20,
        token1Amount,
        0,
        0,
        owner.address,
        deadline,
        { gasLimit: utils.hexlify(1000000) }
    )
    removeLiquidityTx.wait()
    console.log('removeLiquidityTx complete')

    reserves2 = await UniswapV2PairContract.getReserves()
    console.log('reserves after tx2 = ', reserves2)


}

// Run the script
// npx hardhat run --network localhost scripts/localhost/03_swapAndRemoveLiquidity.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });