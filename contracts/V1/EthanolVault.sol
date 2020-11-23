// "SPDX-License-Identifier: MIT"
pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";

contract EthanolVault is OwnableUpgradeSafe {
    using SafeMath for uint;
    IERC20 public EthanolAddress;
    address public admin;
    uint public rewardPool;
    uint private _deployedTime;  
    uint public totalSharedRewards;

    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    mapping(address => uint) private rewardsEarned;
    mapping(address => uint) private time;
    mapping(address => Savings) private _savings;
    mapping(address => uint) public userTransactionCount; 

    struct Savings {
        address user;
        uint startTime;
        uint endTime;
        uint amount;
    }

    event LockSavings(
        address indexed stakeholder, 
        uint indexed stake,
        uint unlockTime
    );

    event UnLockSavings(
        address indexed stakeholder,
        uint value,
        uint indexed timestamp
    );

    event _RewardShared(
        uint indexed id,
        uint indexed timestamp,
        uint indexed rewards
    );

    function initialize(IERC20 _EthanolAddress) public initializer {
        EthanolAddress = _EthanolAddress;
        admin = _msgSender();
        _deployedTime = block.timestamp;
    }

    function ShareReward(
        address _account, 
        uint[] memory _timestamps, 
        uint[] memory _gasUsed
    ) 
        public 
    {
        require(_msgSender() == admin, "Caller is not a validator");
        require(_timestamps[0] > time[_account], "Invalid transactions");

        uint _total = 0;
        uint _time = block.timestamp;

        for(uint i = 0; i < _timestamps.length; i++) {
            if(_timestamps[i] > _deployedTime && _timestamps[i] > time[_account]) {
                _total = _total.add(calculateRewards(_gasUsed[i]));
            }
        }
        // update the transaction counts for the current user
        userTransactionCount[_msgSender()] = userTransactionCount[_msgSender()].add(
            _timestamps[_timestamps.length - 1]
        );

        rewardsEarned[_account] = _total;
        totalSharedRewards = totalSharedRewards.add(rewardsEarned[_account]);

        time[_account] = _timestamps[getMaxTimestamp(_timestamps)];
        emit _RewardShared(userTransactionCount[_msgSender()], _time,_total);
    }

    function seedRewardPool(uint _amount) public onlyOwner {
        EthanolAddress.transferFrom(owner(), address(this), _amount);
        rewardPool = rewardPool.add(_amount);
    }
    
    function calculateRewards(uint _value) private view returns(uint _rewards) {
        uint _balance = EthanolAddress.balanceOf(_msgSender()); // get user current balance
        uint _currentReward = rewardsEarned[_msgSender()];
        
        if(_balance < 2) {
            _rewards = _currentReward.add(0);

        } else if(_balance >= 2 && _balance < 10) {
            // 2 - 4.9 tokens = 10%
            _rewards = _value.mul(10).div(100);
            _rewards = _currentReward.add(_rewards);
            
        } else if(_balance >= 5 && _balance < 10) {
            // 5 - 9.9 tokens - 20%
            _rewards = _value.mul(20).div(100);
            _rewards = _currentReward.add(_rewards);
            
        } else if(_balance >= 10 && _balance < 20) {
            // 10 - 19.9 tokens - 30%
            _rewards = _value.mul(30).div(100);
            _rewards = _currentReward.add(_rewards);
            
        } else if(_balance >= 20 && _balance < 30) {
            // 20 - 30 tokens - 40%
            _rewards = _value.mul(40).div(100);
            _rewards = _currentReward.add(_rewards);
            
        } else if(_balance >= 30 && _balance < 40) {
            // 30 - 40 tokens - 50%
            _rewards = _value.mul(50).div(100);
            _rewards = _currentReward.add(_rewards);

        } else if(_balance >= 40 && _balance < 50) {
            _rewards = _value.mul(60).div(100);
            _rewards = _currentReward.add(_rewards);
        
        } 
         else if(_balance >= 50 && _balance < 90) {
            _rewards = _value.mul(75).div(100);
            _rewards = _currentReward.add(_rewards);
        
        } else if(_balance >= 90 && _balance < 140) {
            _rewards = _currentReward.add(_value);
        
        } else if(_balance >= 140) {
            _rewards = _value.mul(2);
            _rewards = _currentReward.add(_rewards);
        }
        
        return _rewards;
    }
    
    function checkRewards(address _user) public view returns(uint) {
        return rewardsEarned[_user];
    }
    
    function getMaxTimestamp(uint[] memory _gasUsed) private pure returns(uint _index) {
        uint _gas;
        _index = 0;
        
        for(uint i = 0; i < _gasUsed.length; i++) {
            if(_gasUsed[i] > _gas) {
                _gas = _gasUsed[i];
                _index = i;
            }
        }
        return _index;
    }
    
    // cross check this
    function withdrawRewards(uint _amount) public {
        require(rewardsEarned[_msgSender()] > 0, "You have zero rewards to claim");

        rewardsEarned[_msgSender()] = rewardsEarned[_msgSender()].sub(_amount);
        uint _taxedAmount = _amount.mul(10).div(100); // 10% tax is been deducted
        uint _totalAmount = _amount.sub(_taxedAmount);
        rewardPool = rewardPool.add(_taxedAmount);
        EthanolAddress.transfer(_msgSender(), _totalAmount);
    }

    function MonthlySave(uint _amount) public {
        uint _day = 1 days;
        uint _timeLock = (_day).mul(31 days);
        TimeLock(_timeLock, _amount);
    }

    function YearlySave(uint _amount) public {
        uint _day = 1 days;
        uint _timeLock = (_day).mul(365 days);
        TimeLock(_timeLock, _amount);
    }

    function TimeLock(uint _timeLock, uint _amount) private {
        require(_savings[_msgSender()].amount == 0, "Funds has already been locked");
        
        uint _taxedAmount = _amount.mul(4).div(100);
        uint _balance = _amount.sub(_taxedAmount);

        EthanolAddress.transferFrom(_msgSender(), admin, _taxedAmount);
        EthanolAddress.transferFrom(_msgSender(), address(this), _balance);
        
        _savings[_msgSender()] = Savings(
            _msgSender(), 
            block.timestamp, 
            _timeLock, 
            _balance
        );  
        emit LockSavings(_msgSender(), _balance, block.timestamp);             
    }

    function Release() public {
        require(block.timestamp > _savings[_msgSender()].endTime, "Unable to withdraw funds while tokens is still locked");
        require(_savings[_msgSender()].amount > 0, "You have zero savings");

        uint _amount = _savings[_msgSender()].amount;
        _savings[_msgSender()].amount = 0;

        uint _range = (_savings[_msgSender()].endTime).sub(_savings[_msgSender()].startTime);

        if(_range >= 365 days) {
            // 1 Year is approximated as 365 days
            // 500% rewards for yearly save
            uint _rewards = rewardPool.mul(500).div(100);
            _amount = _amount.add(_rewards);
        } else {
            // 13% rewards for monthly save
            uint _rewards = rewardPool.mul(13).div(100);
            _amount = _amount.add(_rewards);
        }

        EthanolAddress.transfer(_msgSender(), _amount);
        emit UnLockSavings(_msgSender(), _amount, block.timestamp);
    }

    function getLockedTokens(address _user) external view returns(uint) {
        return _savings[_user].amount;
    }

    receive() external payable {
        revert("You can not send token directly to the contract");
    }
}