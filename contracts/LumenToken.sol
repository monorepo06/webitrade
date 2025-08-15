// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title LumenToken
 * @dev Lumen Exchange native token (LUMEN)
 * @author Lumen Exchange Team
 */
contract LumenToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    
    // Token details
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant INITIAL_SUPPLY = 50_000_000 * 10**18; // 50 million initial supply
    
    // Staking variables
    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 lockPeriod;
        uint256 rewardRate;
    }
    
    mapping(address => StakeInfo[]) public stakes;
    mapping(address => uint256) public totalStaked;
    
    uint256 public stakingRewardRate = 10; // 10% APY
    uint256 public constant REWARD_DENOMINATOR = 100;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    // Events
    event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 timestamp);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 reward, uint256 timestamp);
    event RewardClaimed(address indexed user, uint256 reward, uint256 timestamp);
    event StakingRewardRateUpdated(uint256 newRate, uint256 timestamp);
    
    constructor() ERC20("Lumen Token", "LUMEN") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Stake tokens for rewards
     * @param amount Amount to stake
     * @param lockPeriod Lock period in seconds
     */
    function stake(uint256 amount, uint256 lockPeriod) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(lockPeriod >= 30 days, "Minimum lock period is 30 days");
        require(lockPeriod <= 365 days, "Maximum lock period is 365 days");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Create stake
        stakes[msg.sender].push(StakeInfo({
            amount: amount,
            timestamp: block.timestamp,
            lockPeriod: lockPeriod,
            rewardRate: stakingRewardRate
        }));
        
        totalStaked[msg.sender] += amount;
        
        emit TokensStaked(msg.sender, amount, lockPeriod, block.timestamp);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     * @param stakeIndex Index of the stake to unstake
     */
    function unstake(uint256 stakeIndex) external nonReentrant whenNotPaused {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        
        StakeInfo storage stakeInfo = stakes[msg.sender][stakeIndex];
        require(block.timestamp >= stakeInfo.timestamp + stakeInfo.lockPeriod, "Stake is still locked");
        
        uint256 amount = stakeInfo.amount;
        uint256 reward = calculateReward(stakeInfo);
        
        // Remove stake
        stakes[msg.sender][stakeIndex] = stakes[msg.sender][stakes[msg.sender].length - 1];
        stakes[msg.sender].pop();
        
        totalStaked[msg.sender] -= amount;
        
        // Transfer tokens back to user
        _transfer(address(this), msg.sender, amount + reward);
        
        emit TokensUnstaked(msg.sender, amount, reward, block.timestamp);
    }
    
    /**
     * @dev Calculate reward for a stake
     * @param stakeInfo Stake information
     * @return reward Calculated reward
     */
    function calculateReward(StakeInfo memory stakeInfo) public view returns (uint256) {
        uint256 stakingDuration = block.timestamp - stakeInfo.timestamp;
        uint256 annualReward = (stakeInfo.amount * stakeInfo.rewardRate) / REWARD_DENOMINATOR;
        return (annualReward * stakingDuration) / SECONDS_PER_YEAR;
    }
    
    /**
     * @dev Get user's total pending rewards
     * @param user User address
     * @return totalReward Total pending rewards
     */
    function getPendingRewards(address user) external view returns (uint256 totalReward) {
        for (uint256 i = 0; i < stakes[user].length; i++) {
            totalReward += calculateReward(stakes[user][i]);
        }
    }
    
    /**
     * @dev Get user's stake information
     * @param user User address
     * @return stakeCount Number of stakes
     * @return totalStakedAmount Total staked amount
     */
    function getUserStakes(address user) external view returns (uint256 stakeCount, uint256 totalStakedAmount) {
        stakeCount = stakes[user].length;
        totalStakedAmount = totalStaked[user];
    }
    
    /**
     * @dev Set staking reward rate (only owner)
     * @param newRate New reward rate
     */
    function setStakingRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 50, "Reward rate too high"); // Max 50% APY
        stakingRewardRate = newRate;
        emit StakingRewardRateUpdated(newRate, block.timestamp);
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override required by Solidity
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
}
