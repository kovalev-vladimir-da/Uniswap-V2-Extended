// SPDX-License-Identifier: MIT
pragma solidity =0.6.6;

import "./ERC20.sol";

contract StohCoinTwoERC20 is ERC20 {
    constructor() public ERC20("StohCoinTwoERC20", "SCTE") {}

    function mint(address to, uint256 amount) public override {
        _mint(to, amount);
    }
}
