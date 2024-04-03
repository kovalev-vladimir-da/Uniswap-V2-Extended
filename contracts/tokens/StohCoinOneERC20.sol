// SPDX-License-Identifier: MIT
pragma solidity =0.6.6;

import "./ERC20.sol";

contract StohCoinOneERC20 is ERC20 {
    constructor() public ERC20("StohCoinOneERC20", "SCOE2") {}

    function mint(address to, uint256 amount) public override {
        _mint(to, amount);
    }
}
