// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAICOIN is ERC20 { 
    constructor() ERC20("DAICOIN", "DAI")  {
        _mint(msg.sender, 100000 * 10**decimals());
    }
}
