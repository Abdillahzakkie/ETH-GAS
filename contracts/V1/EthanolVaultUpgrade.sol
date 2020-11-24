// "SPDX-License-Identifier: MIT"
pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";


contract EthanolVaultUpgraded  is OwnableUpgradeSafe {
    address public wallet;

    function initialize() public initializer {
        wallet = msg.sender;
    }
}