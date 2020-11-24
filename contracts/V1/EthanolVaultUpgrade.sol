// "SPDX-License-Identifier: MIT"
pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

contract EthanolVaultUpgraded is Initializable {
    address public wallet;
    string public author;

    function initialize(address _wallet) public initializer {
        wallet = _wallet;
    }

    
}