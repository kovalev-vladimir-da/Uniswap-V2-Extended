const { Contract, ContractFactory, utils, BigNumber, constants } = require('ethers')

const WETH9 = require("../../WETH9.json") // WETH9

const artifacts = {
    UniswapV2FactoryArtifact: require('../../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json'),
    UniswapV2Router02Artifact: require('../../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'),
};
const { ethers } = require('hardhat')

async function main() {
    const [owner] = await ethers.getSigners()

    console.log("owner is", owner.address)

    const UniswapV2Factory = new ContractFactory(
        artifacts.UniswapV2FactoryArtifact.abi, 
        artifacts.UniswapV2FactoryArtifact.bytecode, 
        owner
        )
    const uniswapV2Factory = await UniswapV2Factory.deploy(
        owner.address
        )
    console.log(
        'UniswapV2Factory',
        uniswapV2Factory.address
        )

    const WETH = new ContractFactory(
        WETH9.abi,
        WETH9.bytecode,
        owner
    )
    const weth = await WETH.deploy()
    console.log(
        'WETH9',
        weth.address
    )

    const UniswapV2Router02 = new ContractFactory(
        artifacts.UniswapV2Router02Artifact.abi, 
        artifacts.UniswapV2Router02Artifact.bytecode, 
        owner
        )
    const uniswapV2Router02 = await UniswapV2Router02.deploy(
        uniswapV2Factory.address, 
        weth.address
        )
    console.log(
        'UniswapV2Router02',
        uniswapV2Router02.address
        )

    const StohCoinOneERC20 = await ethers.getContractFactory('StohCoinOneERC20', owner)
    const stohCoinOneERC20 = await StohCoinOneERC20.deploy()
    console.log(
        'StohCoinOneERC20',
        stohCoinOneERC20.address
    )

    await stohCoinOneERC20.connect(owner).mint(
        owner.address,
        utils.parseEther('10001')
    )

    const StohCoinTwoERC20 = await ethers.getContractFactory('StohCoinTwoERC20', owner)
    const stohCoinTwoERC20 = await StohCoinTwoERC20.deploy()
    console.log(
        'StohCoinTwoERC20',
        stohCoinTwoERC20.address
    )

    await stohCoinTwoERC20.connect(owner).mint(
        owner.address,
        utils.parseEther('10002')
    )

    const balanceStohCoinOneERC20 = await stohCoinOneERC20.balanceOf(owner.address)
    console.log('balanceStohCoinOneERC20 for owner is ', balanceStohCoinOneERC20)

    const balanceStohCoinTwoERC20 = await stohCoinTwoERC20.balanceOf(owner.address)
    console.log('balanceStohCoinTwoERC20 for owner is ', balanceStohCoinTwoERC20)

}

// Run the script
// npx hardhat run --network localhost scripts/localhost/00_deployMainsLocalhost.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });