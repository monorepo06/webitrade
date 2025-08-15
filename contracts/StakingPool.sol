// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title StakingPool
 * @dev Staking pool contract for Lumen Exchange
 * @author Lumen Exchange Team
 */
contract StakingPool is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct PoolInfo {
        IERC20 stakingToken;
        IERC20 rewardToken;
        uint256 rewardRate;
        uint256 totalStaked;
        uint256 lastUpdateTime;
        uint256 rewardPerTokenStored;
        bool active;
    }

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 pendingRewards;
        uint256 lastStakeTime;
    }

    // State variables
    mapping(uint256 => PoolInfo) public pools;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    
    uint256 public poolCount;
    uint256 public constant REWARD_DENOMINATOR = 10000;
    
    // Events
    event PoolCreated(uint256 indexed poolId, address stakingToken, address rewardToken, uint256 rewardRate);
    event Staked(uint256 indexed poolId, address indexed user, uint256 amount);
    event Unstaked(uint256 indexed poolId, address indexed user, uint256 amount);
    event RewardClaimed(uint256 indexed poolId, address indexed user, uint256 amount);
    event PoolUpdated(uint256 indexed poolId, uint256 newRewardRate);

    constructor() {
        // Initialize with owner
    }

    /**
     * @dev Create a new staking pool
     * @param stakingToken Token to stake
     * @param rewardToken Token to receive as reward
     * @param rewardRate Reward rate per block
     */
    function createPool(
        IERC20 stakingToken,
        IERC20 rewardToken,
        uint256 rewardRate
    ) external onlyOwner {
        require(address(stakingToken) != address(0), "Invalid staking token");
        require(address(rewardToken) != address(0), "Invalid reward token");
        require(rewardRate > 0, "Invalid reward rate");

        pools[poolCount] = PoolInfo({
            stakingToken: stakingToken,
            rewardToken: rewardToken,
            rewardRate: rewardRate,
            totalStaked: 0,
            lastUpdateTime: block.timestamp,
            rewardPerTokenStored: 0,
            active: true
        });

        emit PoolCreated(poolCount, address(stakingToken), address(rewardToken), rewardRate);
        poolCount++;
    }

    /**
     * @dev Update pool reward rate
     * @param poolId Pool ID
     * @param newRewardRate New reward rate
     */
    function updatePool(uint256 poolId, uint256 newRewardRate) external onlyOwner {
        require(poolId < poolCount, "Invalid pool ID");
        require(newRewardRate > 0, "Invalid reward rate");

        PoolInfo storage pool = pools[poolId];
        updatePoolRewards(poolId);
        pool.rewardRate = newRewardRate;

        emit PoolUpdated(poolId, newRewardRate);
    }

    /**
     * @dev Stake tokens in a pool
     * @param poolId Pool ID
     * @param amount Amount to stake
     */
    function stake(uint256 poolId, uint256 amount) external nonReentrant whenNotPaused {
        require(poolId < poolCount, "Invalid pool ID");
        require(amount > 0, "Amount must be greater than 0");

        PoolInfo storage pool = pools[poolId];
        require(pool.active, "Pool is not active");

        UserInfo storage user = userInfo[poolId][msg.sender];

        // Update pool and user rewards
        updatePoolRewards(poolId);
        updateUserRewards(poolId, msg.sender);

        // Transfer tokens from user to contract
        pool.stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Update user info
        user.amount += amount;
        user.rewardDebt = (user.amount * pool.rewardPerTokenStored) / 1e18;
        user.lastStakeTime = block.timestamp;

        // Update pool info
        pool.totalStaked += amount;

        emit Staked(poolId, msg.sender, amount);
    }

    /**
     * @dev Unstake tokens from a pool
     * @param poolId Pool ID
     * @param amount Amount to unstake
     */
    function unstake(uint256 poolId, uint256 amount) external nonReentrant whenNotPaused {
        require(poolId < poolCount, "Invalid pool ID");
        require(amount > 0, "Amount must be greater than 0");

        PoolInfo storage pool = pools[poolId];
        UserInfo storage user = userInfo[poolId][msg.sender];

        require(user.amount >= amount, "Insufficient staked amount");

        // Update pool and user rewards
        updatePoolRewards(poolId);
        updateUserRewards(poolId, msg.sender);

        // Update user info
        user.amount -= amount;
        user.rewardDebt = (user.amount * pool.rewardPerTokenStored) / 1e18;

        // Update pool info
        pool.totalStaked -= amount;

        // Transfer tokens back to user
        pool.stakingToken.safeTransfer(msg.sender, amount);

        emit Unstaked(poolId, msg.sender, amount);
    }

    /**
     * @dev Claim rewards from a pool
     * @param poolId Pool ID
     */
    function claimRewards(uint256 poolId) external nonReentrant whenNotPaused {
        require(poolId < poolCount, "Invalid pool ID");

        PoolInfo storage pool = pools[poolId];
        UserInfo storage user = userInfo[poolId][msg.sender];

        // Update pool and user rewards
        updatePoolRewards(poolId);
        updateUserRewards(poolId, msg.sender);

        uint256 pendingReward = user.pendingRewards;
        if (pendingReward > 0) {
            user.pendingRewards = 0;
            user.rewardDebt = (user.amount * pool.rewardPerTokenStored) / 1e18;

            // Transfer reward tokens to user
            pool.rewardToken.safeTransfer(msg.sender, pendingReward);

            emit RewardClaimed(poolId, msg.sender, pendingReward);
        }
    }

    /**
     * @dev Update pool rewards
     * @param poolId Pool ID
     */
    function updatePoolRewards(uint256 poolId) internal {
        PoolInfo storage pool = pools[poolId];
        
        if (pool.totalStaked == 0) {
            pool.lastUpdateTime = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - pool.lastUpdateTime;
        uint256 reward = (timeElapsed * pool.rewardRate * 1e18) / (365 days);
        
        pool.rewardPerTokenStored += reward;
        pool.lastUpdateTime = block.timestamp;
    }

    /**
     * @dev Update user rewards
     * @param poolId Pool ID
     * @param user User address
     */
    function updateUserRewards(uint256 poolId, address user) internal {
        UserInfo storage userData = userInfo[poolId][user];
        PoolInfo storage pool = pools[poolId];

        uint256 reward = (userData.amount * pool.rewardPerTokenStored) / 1e18;
        userData.pendingRewards += reward - userData.rewardDebt;
    }

    /**
     * @dev Get user's pending rewards
     * @param poolId Pool ID
     * @param user User address
     * @return Pending rewards
     */
    function getPendingRewards(uint256 poolId, address user) external view returns (uint256) {
        require(poolId < poolCount, "Invalid pool ID");

        PoolInfo storage pool = pools[poolId];
        UserInfo storage userData = userInfo[poolId][user];

        if (pool.totalStaked == 0) {
            return userData.pendingRewards;
        }

        uint256 timeElapsed = block.timestamp - pool.lastUpdateTime;
        uint256 reward = (timeElapsed * pool.rewardRate * 1e18) / (365 days);
        uint256 currentRewardPerToken = pool.rewardPerTokenStored + reward;

        uint256 userReward = (userData.amount * currentRewardPerToken) / 1e18;
        return userData.pendingRewards + userReward - userData.rewardDebt;
    }

    /**
     * @dev Get pool information
     * @param poolId Pool ID
     * @return Pool information
     */
    function getPoolInfo(uint256 poolId) external view returns (
        address stakingToken,
        address rewardToken,
        uint256 rewardRate,
        uint256 totalStaked,
        bool active
    ) {
        require(poolId < poolCount, "Invalid pool ID");
        
        PoolInfo storage pool = pools[poolId];
        return (
            address(pool.stakingToken),
            address(pool.rewardToken),
            pool.rewardRate,
            pool.totalStaked,
            pool.active
        );
    }

    /**
     * @dev Get user information
     * @param poolId Pool ID
     * @param user User address
     * @return User information
     */
    function getUserInfo(uint256 poolId, address user) external view returns (
        uint256 amount,
        uint256 pendingRewards,
        uint256 lastStakeTime
    ) {
        require(poolId < poolCount, "Invalid pool ID");
        
        UserInfo storage userData = userInfo[poolId][user];
        return (
            userData.amount,
            userData.pendingRewards,
            userData.lastStakeTime
        );
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdraw function for owner
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
