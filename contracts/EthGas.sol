// "SPDX-License-Identifier: MIT"
pragma solidity 0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";

abstract contract GasToken is ERC20UpgradeSafe, ERC20BurnableUpgradeSafe, OwnableUpgradeSafe {
    using SafeMath for uint;
    uint public totalMinted;
    uint _deployedTime;
    uint totalBurnt;
    address public admin;

    function transfer(address _recipient, uint _amount) public override returns (bool) {
        require(msg.sender != _recipient, "Sender and Recipient are the same");

        uint _burnRate = _amount.mul(3).div(100);
        uint _totalBalance = _amount.sub(_burnRate);

        super._burn(msg.sender, _burnRate);
        super._transfer(msg.sender, _recipient, _totalBalance);

        return true;
    }
    
    function _mint(address _recipient, uint _amount) internal override {
        require(_recipient != address(0), "Recipient is zero address");
        require(totalSupply().add(_amount) <= 10000 ether, "Maximum supply has been reached");
        totalMinted = totalMinted.add(_amount);
        super._mint(_recipient, _amount);
    }
}