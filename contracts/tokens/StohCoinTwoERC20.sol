// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ERC20.sol";

contract StohCoinTwoERC20 is ERC20 {
    constructor() ERC20("StohCoinTwoERC20", "SCTE") {}

    function mint(address to, uint256 amount) public override {
        _mint(to, amount);
    }
}
