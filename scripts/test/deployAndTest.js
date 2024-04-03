const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

const WETH9 = require("../../WETH9.json")

const factoryArtifact = require('../../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json')
const routerArtifact = require('../../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json')
const pairArtifact = require('../../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json')
const { ethers } = require('hardhat')

async function main() {
    const [owner] = await ethers.getSigners()

    const Factory = new ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, owner)
    const factory = await Factory.deploy(owner.address)
    console.log('factory', factory.address)

    const Usdt = await ethers.getContractFactory('StohCoinOneERC20')
    const usdt = await Usdt.deploy()
    console.log('usdt', usdt.address)

    const Usdc = await ethers.getContractFactory('StohCoinTwoERC20',)
    const usdc = await Usdc.deploy()
    console.log('usdc', usdc.address)

    await usdt.connect(owner).mint(
        owner.address,
        utils.parseEther('10000')
    )

    await usdc.connect(owner).mint(
        owner.address,
        utils.parseEther('10000')
    )

    const tx1 = await factory.createPair(
        usdt.address,
        usdc.address
    )
    await tx1.wait()

    const pairAddress = await factory.getPair(
        usdt.address,
        usdc.address
    )
    console.log('pairAddress', pairAddress)

    const pair = new Contract(pairAddress, pairArtifact.abi, owner)
    let reserves
    reserves = await pair.getReserves()

    console.log('reserves', reserves)

    const Weth = new ContractFactory(
        WETH9.abi,
        WETH9.bytecode,
        owner
    )
    const weth = await Weth.deploy()
    console.log('weth', weth.address)

    const Router = new ContractFactory(
        routerArtifact.abi,
        routerArtifact.bytecode,
        owner
    )
    const router = await Router.deploy(
        factory.address,
        weth.address
    )
    console.log('router', router.address)

    const approval1 = await usdt.approve(
        router.address,
        constants.MaxUint256
    )
    approval1.wait()
    const approval2 = await usdc.approve(
        router.address,
        constants.MaxUint256
    )
    approval2.wait()

    const token0Amount = utils.parseEther('100')
    const token1Amount = utils.parseEther('100')

    const deadline = Math.floor(Date.now() / 1000 + (10 * 60))


    console.log('mark', router.address)
    const addLiquidityTx = await router.connect(owner).addLiquidity(
        usdt.address,
        usdc.address, 
        token0Amount,
        token1Amount,
        0,
        0,
        owner.address,
        deadline,
        { gasLimit: utils.hexlify(1000000) }
    )
    addLiquidityTx.wait()

    reserves = await pair.getReserves()
    console.log('reserves', reserves)
}

// Run the script
// npx hardhat run --network localhost scripts/test/deployAndTest.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });