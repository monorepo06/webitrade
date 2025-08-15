// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PriceOracle
 * @dev Price oracle contract for Lumen Exchange
 * @author Lumen Exchange Team
 */
contract PriceOracle is Ownable, Pausable {
    
    // Structs
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        uint256 confidence;
    }
    
    // State variables
    mapping(address => PriceData) public prices;
    mapping(address => bool) public authorizedUpdaters;
    mapping(address => bool) public supportedTokens;
    
    uint256 public constant PRICE_DECIMALS = 8;
    uint256 public constant MAX_PRICE_AGE = 1 hours;
    uint256 public constant MIN_CONFIDENCE = 50; // 50%
    
    // Events
    event PriceUpdated(address indexed token, uint256 price, uint256 timestamp, uint256 confidence);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event UpdaterAuthorized(address indexed updater);
    event UpdaterDeauthorized(address indexed updater);
    
    // Modifiers
    modifier onlyAuthorizedUpdater() {
        require(authorizedUpdaters[msg.sender] || msg.sender == owner(), "Not authorized updater");
        _;
    }
    
    modifier validToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }
    
    constructor() {
        authorizedUpdaters[msg.sender] = true;
    }
    
    /**
     * @dev Add a supported token
     * @param token Token address
     */
    function addToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }
    
    /**
     * @dev Remove a supported token
     * @param token Token address
     */
    function removeToken(address token) external onlyOwner {
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }
    
    /**
     * @dev Authorize a price updater
     * @param updater Updater address
     */
    function authorizeUpdater(address updater) external onlyOwner {
        require(updater != address(0), "Invalid updater address");
        authorizedUpdaters[updater] = true;
        emit UpdaterAuthorized(updater);
    }
    
    /**
     * @dev Deauthorize a price updater
     * @param updater Updater address
     */
    function deauthorizeUpdater(address updater) external onlyOwner {
        authorizedUpdaters[updater] = false;
        emit UpdaterDeauthorized(updater);
    }
    
    /**
     * @dev Update price for a token
     * @param token Token address
     * @param price New price
     * @param confidence Confidence level (0-100)
     */
    function updatePrice(
        address token,
        uint256 price,
        uint256 confidence
    ) external onlyAuthorizedUpdater validToken(token) {
        require(price > 0, "Price must be greater than 0");
        require(confidence >= MIN_CONFIDENCE, "Confidence too low");
        require(confidence <= 100, "Confidence too high");
        
        prices[token] = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: confidence
        });
        
        emit PriceUpdated(token, price, block.timestamp, confidence);
    }
    
    /**
     * @dev Update multiple prices at once
     * @param tokens Array of token addresses
     * @param priceArray Array of prices
     * @param confidenceArray Array of confidence levels
     */
    function updatePrices(
        address[] calldata tokens,
        uint256[] calldata priceArray,
        uint256[] calldata confidenceArray
    ) external onlyAuthorizedUpdater {
        require(tokens.length == priceArray.length, "Arrays length mismatch");
        require(tokens.length == confidenceArray.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < tokens.length; i++) {
            require(supportedTokens[tokens[i]], "Token not supported");
            require(priceArray[i] > 0, "Price must be greater than 0");
            require(confidenceArray[i] >= MIN_CONFIDENCE, "Confidence too low");
            require(confidenceArray[i] <= 100, "Confidence too high");
            
            prices[tokens[i]] = PriceData({
                price: priceArray[i],
                timestamp: block.timestamp,
                confidence: confidenceArray[i]
            });
            
            emit PriceUpdated(tokens[i], priceArray[i], block.timestamp, confidenceArray[i]);
        }
    }
    
    /**
     * @dev Get current price for a token
     * @param token Token address
     * @return price Current price
     * @return timestamp Price timestamp
     * @return confidence Price confidence
     */
    function getPrice(address token) external view validToken(token) returns (
        uint256 price,
        uint256 timestamp,
        uint256 confidence
    ) {
        PriceData memory priceData = prices[token];
        require(priceData.price > 0, "Price not available");
        require(block.timestamp - priceData.timestamp <= MAX_PRICE_AGE, "Price too old");
        
        return (priceData.price, priceData.timestamp, priceData.confidence);
    }
    
    /**
     * @dev Get price with validation
     * @param token Token address
     * @return price Current price
     */
    function getValidPrice(address token) external view validToken(token) returns (uint256 price) {
        PriceData memory priceData = prices[token];
        require(priceData.price > 0, "Price not available");
        require(block.timestamp - priceData.timestamp <= MAX_PRICE_AGE, "Price too old");
        require(priceData.confidence >= MIN_CONFIDENCE, "Price confidence too low");
        
        return priceData.price;
    }
    
    /**
     * @dev Check if price is valid and recent
     * @param token Token address
     * @return isValid Whether price is valid
     */
    function isPriceValid(address token) external view validToken(token) returns (bool isValid) {
        PriceData memory priceData = prices[token];
        
        if (priceData.price == 0) return false;
        if (block.timestamp - priceData.timestamp > MAX_PRICE_AGE) return false;
        if (priceData.confidence < MIN_CONFIDENCE) return false;
        
        return true;
    }
    
    /**
     * @dev Get price age
     * @param token Token address
     * @return age Price age in seconds
     */
    function getPriceAge(address token) external view validToken(token) returns (uint256 age) {
        PriceData memory priceData = prices[token];
        if (priceData.timestamp == 0) return type(uint256).max;
        return block.timestamp - priceData.timestamp;
    }
    
    /**
     * @dev Calculate price change percentage
     * @param token Token address
     * @param oldPrice Old price
     * @return changePercentage Price change percentage
     */
    function calculatePriceChange(address token, uint256 oldPrice) external view validToken(token) returns (int256 changePercentage) {
        PriceData memory priceData = prices[token];
        require(priceData.price > 0, "Current price not available");
        require(oldPrice > 0, "Old price must be greater than 0");
        
        if (priceData.price > oldPrice) {
            return int256(((priceData.price - oldPrice) * 10000) / oldPrice);
        } else {
            return -int256(((oldPrice - priceData.price) * 10000) / oldPrice);
        }
    }
    
    /**
     * @dev Get multiple prices
     * @param tokens Array of token addresses
     * @return priceArray Array of prices
     * @return timestampArray Array of timestamps
     * @return confidenceArray Array of confidence levels
     */
    function getPrices(address[] calldata tokens) external view returns (
        uint256[] memory priceArray,
        uint256[] memory timestampArray,
        uint256[] memory confidenceArray
    ) {
        priceArray = new uint256[](tokens.length);
        timestampArray = new uint256[](tokens.length);
        confidenceArray = new uint256[](tokens.length);
        
        for (uint256 i = 0; i < tokens.length; i++) {
            require(supportedTokens[tokens[i]], "Token not supported");
            PriceData memory priceData = prices[tokens[i]];
            
            priceArray[i] = priceData.price;
            timestampArray[i] = priceData.timestamp;
            confidenceArray[i] = priceData.confidence;
        }
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
}
