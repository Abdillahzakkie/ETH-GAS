// "SPDX-License-Identifier: MIT"
pragma solidity >=0.4.22 <0.8.0;

import "./EthanolVault.sol";

contract EthanolVaultUpgraded is EthanolVault {
    address private admin;

    function initialize() public initializer {
        admin = msg.sender;
    }
}