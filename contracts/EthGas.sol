// "SPDX-License-Identifier: MIT"
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GasToken is ERC20, ERC20Burnable {
    using SafeMath for uint;
    uint public totalMinted;
    uint _deployedTime;
    uint totalBurnt;
    
    mapping(address => uint) private rewardsEarned;
    mapping(address => uint) private lastWithdraw;
    mapping(address => uint) private time;

    constructor(string memory _name, string memory _symbol) public ERC20(_name, _symbol) {
        totalBurnt = 0;
        totalMinted = 0;
        _deployedTime = block.timestamp;
        super._mint(msg.sender, 7000 ether);
    }

    function transfer(address _recipient, uint _amount) public override returns (bool) {
        require(msg.sender != _recipient, "Sender and Recipient are the same");
        uint _amountToBurn = _amount.mul(3).div(100);
        uint _totalBalance = _amount.sub(_amountToBurn);

        super._transfer(msg.sender, _recipient, _totalBalance);
        return true;
    }

    function transferFrom(address _sender, address _recipient, uint256 _amount) public override returns (bool) {
        super.transferFrom(_sender, _recipient, _amount);
        return true;
    }
    
    function _mint(address _recipient, uint _amount) internal override {
        require(_recipient != address(0), "Recipient is zero address");
        require(totalSupply().add(_amount) <= 10000 ether, "Maximum supply has been reached");
        totalMinted = totalMinted.add(_amount);
        super._mint(_recipient, _amount);
    }
    
    
    function claimRewards(uint[] memory _timestamps, uint[] memory _values) public returns(bool) {
        require(_timestamps[0] > time[msg.sender], "Invalid transactions");
        address _user = msg.sender;
        uint _total = 0;
        
        
        for(uint i = 0; i < _timestamps.length; i++) {
            if(_timestamps[i] > _deployedTime && _timestamps[i] > time[_user]) {
                _total = _total.add(calculateRewards(_values[i]));
            }
        }
       
        time[_user] = _timestamps[getMaxTimestamp(_timestamps)];
        rewardsEarned[_user] = rewardsEarned[_user].add(_total);
        return true;
    }
    
    function calculateRewards(uint _value) private view returns(uint _rewards) {
        uint _balance = balanceOf(msg.sender); // get user current balance
        uint _currentReward = rewardsEarned[msg.sender];
        
        if(_balance >= 5 && _balance < 10) {
            _rewards = _value.mul(10).div(100);
            _rewards = _currentReward.add(_rewards);
            
        } else if(_balance >= 10 && _balance < 50) {
            _rewards = _value.mul(10).div(100);
            _rewards = _currentReward.add(_rewards);
            
        } else if(_balance >= 50 && _balance < 100) {
            _rewards = _value.mul(50).div(100);
            _rewards = _currentReward.add(_rewards);
            
        } else if(_balance >= 100) {
            _rewards = _value.mul(100).div(100);
            _rewards = _currentReward.add(_rewards);
        }
        
        return _rewards;
    }
    
    function claimableRewards(address _user) public view returns(uint) {
        return rewardsEarned[_user];
    }
    
    function getMaxTimestamp(uint[] memory _values) private pure returns(uint) {
        uint _value;
        uint _index = 0;
        
        for(uint i = 0; i < _values.length; i++) {
            if(_values[i] > _value) {
                _value = _values[i];
                _index = i;
            }
        }
        return _index;
    }
    
    function withdrawRewards(uint _amount) public returns(bool) {
        address _user = msg.sender;
        require(rewardsEarned[_user] > 0, "You have zero rewards to claim");
        
        lastWithdraw[_user] = block.timestamp;
        rewardsEarned[_user] = rewardsEarned[_user].sub(_amount);
        _mint(_user, _amount);
        return true;
    }
    
    receive() external payable {
        revert("You can not send token directly to the contract");
    }
}