// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LumenExchange
 * @dev Main exchange contract for Lumen Exchange
 * @author Lumen Exchange Team
 */
contract LumenExchange is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event OrderPlaced(
        uint256 indexed orderId,
        address indexed user,
        address indexed tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        bool isBuy,
        uint256 timestamp
    );

    event OrderFilled(
        uint256 indexed orderId,
        address indexed user,
        uint256 amountFilled,
        uint256 price,
        uint256 timestamp
    );

    event OrderCancelled(
        uint256 indexed orderId,
        address indexed user,
        uint256 timestamp
    );

    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event Withdrawal(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    // Structs
    struct Order {
        uint256 id;
        address user;
        address tokenA;
        address tokenB;
        uint256 amountA;
        uint256 amountB;
        uint256 price;
        bool isBuy;
        bool isActive;
        uint256 timestamp;
        uint256 filledAmount;
    }

    struct Balance {
        uint256 available;
        uint256 locked;
    }

    // State variables
    uint256 public orderIdCounter;
    uint256 public tradingFeeRate = 10; // 0.1% (10/10000)
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Mappings
    mapping(address => mapping(address => Balance)) public balances;
    mapping(uint256 => Order) public orders;
    mapping(address => bool) public supportedTokens;
    mapping(address => bool) public authorizedOperators;

    // Modifiers
    modifier onlyAuthorized() {
        require(authorizedOperators[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    modifier validToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }

    modifier validOrder(uint256 orderId) {
        require(orders[orderId].id != 0, "Order does not exist");
        require(orders[orderId].isActive, "Order is not active");
        _;
    }

    constructor() {
        // Initialize with owner as authorized operator
        authorizedOperators[msg.sender] = true;
    }

    /**
     * @dev Add a supported token
     * @param token Token contract address
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        supportedTokens[token] = true;
    }

    /**
     * @dev Remove a supported token
     * @param token Token contract address
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
    }

    /**
     * @dev Set trading fee rate
     * @param newFeeRate New fee rate (in basis points)
     */
    function setTradingFeeRate(uint256 newFeeRate) external onlyOwner {
        require(newFeeRate <= 1000, "Fee rate too high"); // Max 10%
        tradingFeeRate = newFeeRate;
    }

    /**
     * @dev Add authorized operator
     * @param operator Operator address
     */
    function addAuthorizedOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = true;
    }

    /**
     * @dev Remove authorized operator
     * @param operator Operator address
     */
    function removeAuthorizedOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = false;
    }

    /**
     * @dev Deposit tokens to the exchange
     * @param token Token contract address
     * @param amount Amount to deposit
     */
    function deposit(address token, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        validToken(token) 
    {
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender][token].available += amount;
        
        emit Deposit(msg.sender, token, amount, block.timestamp);
    }

    /**
     * @dev Withdraw tokens from the exchange
     * @param token Token contract address
     * @param amount Amount to withdraw
     */
    function withdraw(address token, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        validToken(token) 
    {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender][token].available >= amount, "Insufficient balance");
        
        balances[msg.sender][token].available -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Withdrawal(msg.sender, token, amount, block.timestamp);
    }

    /**
     * @dev Place a buy order
     * @param tokenA Token to buy
     * @param tokenB Token to sell
     * @param amountA Amount of tokenA to buy
     * @param price Price in tokenB per tokenA
     */
    function placeBuyOrder(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 price
    ) external nonReentrant whenNotPaused validToken(tokenA) validToken(tokenB) {
        require(amountA > 0 && price > 0, "Invalid amount or price");
        
        uint256 totalCost = (amountA * price) / 1e18;
        require(balances[msg.sender][tokenB].available >= totalCost, "Insufficient balance");
        
        // Lock the balance
        balances[msg.sender][tokenB].available -= totalCost;
        balances[msg.sender][tokenB].locked += totalCost;
        
        // Create order
        orderIdCounter++;
        orders[orderIdCounter] = Order({
            id: orderIdCounter,
            user: msg.sender,
            tokenA: tokenA,
            tokenB: tokenB,
            amountA: amountA,
            amountB: totalCost,
            price: price,
            isBuy: true,
            isActive: true,
            timestamp: block.timestamp,
            filledAmount: 0
        });
        
        emit OrderPlaced(orderIdCounter, msg.sender, tokenA, tokenB, amountA, totalCost, true, block.timestamp);
    }

    /**
     * @dev Place a sell order
     * @param tokenA Token to sell
     * @param tokenB Token to buy
     * @param amountA Amount of tokenA to sell
     * @param price Price in tokenB per tokenA
     */
    function placeSellOrder(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 price
    ) external nonReentrant whenNotPaused validToken(tokenA) validToken(tokenB) {
        require(amountA > 0 && price > 0, "Invalid amount or price");
        require(balances[msg.sender][tokenA].available >= amountA, "Insufficient balance");
        
        // Lock the balance
        balances[msg.sender][tokenA].available -= amountA;
        balances[msg.sender][tokenA].locked += amountA;
        
        // Create order
        orderIdCounter++;
        orders[orderIdCounter] = Order({
            id: orderIdCounter,
            user: msg.sender,
            tokenA: tokenA,
            tokenB: tokenB,
            amountA: amountA,
            amountB: (amountA * price) / 1e18,
            price: price,
            isBuy: false,
            isActive: true,
            timestamp: block.timestamp,
            filledAmount: 0
        });
        
        emit OrderPlaced(orderIdCounter, msg.sender, tokenA, tokenB, amountA, (amountA * price) / 1e18, false, block.timestamp);
    }

    /**
     * @dev Fill an order
     * @param orderId Order ID to fill
     * @param fillAmount Amount to fill
     */
    function fillOrder(uint256 orderId, uint256 fillAmount) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyAuthorized 
        validOrder(orderId) 
    {
        Order storage order = orders[orderId];
        require(fillAmount > 0, "Fill amount must be greater than 0");
        require(fillAmount <= (order.amountA - order.filledAmount), "Fill amount exceeds remaining");
        
        uint256 remainingAmount = order.amountA - order.filledAmount;
        uint256 actualFillAmount = fillAmount > remainingAmount ? remainingAmount : fillAmount;
        
        if (order.isBuy) {
            // Buy order: user gets tokenA, pays tokenB
            uint256 cost = (actualFillAmount * order.price) / 1e18;
            uint256 fee = (cost * tradingFeeRate) / FEE_DENOMINATOR;
            
            // Transfer tokens
            balances[order.user][order.tokenA].available += actualFillAmount;
            balances[order.user][order.tokenB].locked -= cost;
            
            // Handle fee (could be sent to fee recipient)
            if (fee > 0) {
                balances[order.user][order.tokenB].available += (cost - fee);
            } else {
                balances[order.user][order.tokenB].available += cost;
            }
        } else {
            // Sell order: user gets tokenB, pays tokenA
            uint256 proceeds = (actualFillAmount * order.price) / 1e18;
            uint256 fee = (proceeds * tradingFeeRate) / FEE_DENOMINATOR;
            
            // Transfer tokens
            balances[order.user][order.tokenB].available += (proceeds - fee);
            balances[order.user][order.tokenA].locked -= actualFillAmount;
        }
        
        order.filledAmount += actualFillAmount;
        
        // Check if order is fully filled
        if (order.filledAmount >= order.amountA) {
            order.isActive = false;
        }
        
        emit OrderFilled(orderId, order.user, actualFillAmount, order.price, block.timestamp);
    }

    /**
     * @dev Cancel an order
     * @param orderId Order ID to cancel
     */
    function cancelOrder(uint256 orderId) 
        external 
        nonReentrant 
        whenNotPaused 
        validOrder(orderId) 
    {
        Order storage order = orders[orderId];
        require(order.user == msg.sender, "Not order owner");
        
        uint256 remainingAmount = order.amountA - order.filledAmount;
        
        if (order.isBuy) {
            // Unlock tokenB
            uint256 remainingCost = (remainingAmount * order.price) / 1e18;
            balances[order.user][order.tokenB].locked -= remainingCost;
            balances[order.user][order.tokenB].available += remainingCost;
        } else {
            // Unlock tokenA
            balances[order.user][order.tokenA].locked -= remainingAmount;
            balances[order.user][order.tokenA].available += remainingAmount;
        }
        
        order.isActive = false;
        
        emit OrderCancelled(orderId, order.user, block.timestamp);
    }

    /**
     * @dev Get user balance for a token
     * @param user User address
     * @param token Token address
     * @return available Available balance
     * @return locked Locked balance
     */
    function getBalance(address user, address token) external view returns (uint256 available, uint256 locked) {
        return (balances[user][token].available, balances[user][token].locked);
    }

    /**
     * @dev Get order details
     * @param orderId Order ID
     * @return Order struct
     */
    function getOrder(uint256 orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal function for owner
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
