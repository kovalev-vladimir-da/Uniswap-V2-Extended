const { utils }  = require('ethers')
const bytecodeUniswapPair = require('../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json');


async function main() {
    console.log('START HASH SCRIPT')

    const newHash = utils.keccak256(bytecodeUniswapPair.bytecode )

    console.log('NEW HASH IS, ', newHash)
}

// Run the script
// npx hardhat run --network localhost scripts/init_code_hash.js

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });