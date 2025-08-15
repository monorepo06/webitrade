# Lumen Exchange Smart Contracts

This directory contains the smart contracts for the Lumen Exchange decentralized trading platform.

## Contracts Overview

### 1. LumenExchange.sol
The main exchange contract that handles:
- Token deposits and withdrawals
- Order placement and management
- Order matching and execution
- Trading fee collection
- Balance management

**Key Features:**
- Non-custodial trading
- Order book management
- Fee collection system
- Pausable for emergency situations
- Reentrancy protection

### 2. LumenToken.sol
The native LUMEN token contract with:
- ERC20 standard implementation
- Staking functionality
- Burnable tokens
- Pausable transfers
- Owner-controlled minting

**Key Features:**
- 100 million max supply
- 50 million initial supply
- Staking rewards system
- Configurable reward rates

### 3. StakingPool.sol
A flexible staking pool system for:
- Multiple token staking
- Reward distribution
- Pool management
- User stake tracking

**Key Features:**
- Multiple staking pools
- Configurable reward rates
- Automatic reward calculation
- Emergency withdrawal functions

### 4. PriceOracle.sol
Price feed oracle for:
- Real-time price updates
- Price validation
- Confidence scoring
- Multiple token support

**Key Features:**
- Authorized price updaters
- Price age validation
- Confidence thresholds
- Batch price updates

### 5. Governance.sol
Decentralized governance system for:
- Proposal creation and voting
- Parameter updates
- Protocol upgrades
- Community decision making

**Key Features:**
- Token-weighted voting
- Proposal execution
- Quorum requirements
- Voting periods

### 6. Migrations.sol
Truffle migration tracking contract for deployment management.

## Deployment

### Prerequisites
- Node.js 16+
- Truffle or Hardhat
- Solidity 0.8.19+

### Dependencies
```bash
npm install @openzeppelin/contracts
```

### Compilation
```bash
truffle compile
# or
npx hardhat compile
```

### Testing
```bash
truffle test
# or
npx hardhat test
```

### Deployment
```bash
truffle migrate --network <network>
# or
npx hardhat run scripts/deploy.js --network <network>
```

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency pause functionality
- **Ownable**: Access control for admin functions
- **SafeERC20**: Safe token transfers
- **Input Validation**: Comprehensive input validation
- **Access Control**: Role-based permissions

## Gas Optimization

- Efficient storage patterns
- Batch operations where possible
- Minimal external calls
- Optimized data structures

## Audit Considerations

Before mainnet deployment, consider:
- Professional security audit
- Formal verification
- Bug bounty program
- Testnet deployment and testing
- Community review

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
- GitHub Issues
- Discord Community
- Email: support@lumen-exchange.com
