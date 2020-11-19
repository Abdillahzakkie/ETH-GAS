// "SPDX-License-Identifier: MIT"

pragma solidity ^0.6.12;

import "./EthGas.sol";

contract Vault is GasToken {
    uint public rewardPool;     

    mapping(address => uint) private rewardsEarned;
    mapping(address => uint) private time;
    mapping(address => _Savings) private _savings;

    struct _Savings {
        address user;
        uint startTime;
        uint endTime;
        uint amount;
    }

    event Lock(
        address indexed stakeholder, 
        uint indexed stake,
        uint unlockTime
    );

    event ReleaseSavings(
        address indexed stakeholder,
        uint value,
        uint indexed timestamp
    );

    function initialize(string memory _name, string memory _symbol) public initializer {
        __ERC20_init(_name, _symbol);
        
        totalBurnt = 0;
        totalMinted = 0;
        super._mint(msg.sender, 7000 ether);
        _deployedTime = block.timestamp;
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
            _rewards = _value.mul(20).div(100);
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

        rewardsEarned[_user] = rewardsEarned[_user].sub(_amount);
        
        uint _burnRate = _amount.mul(4).div(100);
        uint _taxedAmount = _amount.mul(4).div(100);

        uint _totalAmount = _amount.sub(_burnRate).sub(_taxedAmount);
        rewardPool = rewardPool.add(_taxedAmount);

        super._burn(msg.sender, _burnRate);
        super._mint(admin, _totalAmount);
        return true;
    }

    function TimeLock(uint _timeLock, uint _amount) private {
        require(balanceOf(msg.sender) >= _amount, "Amount exceed balance");
        require(_savings[msg.sender].amount == 0, "Funds has already been locked");

        uint _taxedAmount = _amount.mul(3).div(100);
        uint _balance = _amount.sub(_taxedAmount);

        transfer(address(this), _amount);
        _savings[msg.sender] = _Savings(
            msg.sender, 
            block.timestamp, 
            _timeLock, 
            _balance
        );  
        emit Lock(msg.sender, _balance, block.timestamp);             
    }

    function monthlySave(uint _amount) public {
        uint _timeLock = 31 days;
        TimeLock(_timeLock, _amount);
    }

    function yearlySave(uint _amount) public {
        uint _timeLock = 31 days;
        TimeLock(_timeLock, _amount);
    }
    function release() public {
        require(_savings[msg.sender].endTime <= block.timestamp, "Unable to withdraw funds while tokens is still locked");
        require(_savings[msg.sender].amount > 0, "You have zero savings");

        uint _amount = _savings[msg.sender].amount;
        _savings[msg.sender].amount = 0;

        transfer(msg.sender, _amount);
        emit ReleaseSavings(msg.sender, _amount, block.timestamp);
    }

    function getLocked(address _user) public view returns(uint) {
        return _savings[_user].amount;
    }

    receive() external payable {
        revert("You can not send token directly to the contract");
    }
}