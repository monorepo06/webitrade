// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Governance
 * @dev Governance contract for Lumen Exchange
 * @author Lumen Exchange Team
 */
contract Governance is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        bool cancelled;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votes;
    }

    struct ProposalAction {
        address target;
        bytes data;
        uint256 value;
    }

    // State variables
    IERC20 public governanceToken;
    uint256 public proposalCount;
    uint256 public votingDelay = 1 days;
    uint256 public votingPeriod = 3 days;
    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens
    uint256 public quorumThreshold = 10000 * 10**18; // 10000 tokens
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => ProposalAction[]) public proposalActions;
    mapping(address => uint256) public lastProposalTime;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint8 support,
        uint256 votes
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event VotingDelayUpdated(uint256 newVotingDelay);
    event VotingPeriodUpdated(uint256 newVotingPeriod);
    event ProposalThresholdUpdated(uint256 newProposalThreshold);
    event QuorumThresholdUpdated(uint256 newQuorumThreshold);

    constructor(address _governanceToken) {
        require(_governanceToken != address(0), "Invalid governance token");
        governanceToken = IERC20(_governanceToken);
    }

    /**
     * @dev Create a new proposal
     * @param title Proposal title
     * @param description Proposal description
     * @param actions Array of actions to execute
     */
    function propose(
        string calldata title,
        string calldata description,
        ProposalAction[] calldata actions
    ) external whenNotPaused returns (uint256) {
        require(governanceToken.balanceOf(msg.sender) >= proposalThreshold, "Insufficient voting power");
        require(block.timestamp >= lastProposalTime[msg.sender] + votingDelay, "Proposal too soon");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.startTime = block.timestamp + votingDelay;
        proposal.endTime = block.timestamp + votingDelay + votingPeriod;
        proposal.executed = false;
        proposal.cancelled = false;
        
        // Store proposal actions
        for (uint256 i = 0; i < actions.length; i++) {
            proposalActions[proposalId].push(actions[i]);
        }
        
        lastProposalTime[msg.sender] = block.timestamp;
        
        emit ProposalCreated(proposalId, msg.sender, title, proposal.startTime, proposal.endTime);
        
        return proposalId;
    }

    /**
     * @dev Vote on a proposal
     * @param proposalId Proposal ID
     * @param support Vote support (0=against, 1=for, 2=abstain)
     */
    function vote(uint256 proposalId, uint8 support) external whenNotPaused {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        require(support <= 2, "Invalid vote type");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal executed");
        require(!proposal.cancelled, "Proposal cancelled");
        
        uint256 votes = governanceToken.balanceOf(msg.sender);
        require(votes > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = votes;
        
        if (support == 0) {
            proposal.againstVotes += votes;
        } else if (support == 1) {
            proposal.forVotes += votes;
        } else if (support == 2) {
            proposal.abstainVotes += votes;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votes);
    }

    /**
     * @dev Execute a proposal
     * @param proposalId Proposal ID
     */
    function execute(uint256 proposalId) external whenNotPaused {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Proposal executed");
        require(!proposal.cancelled, "Proposal cancelled");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        require(proposal.forVotes + proposal.againstVotes + proposal.abstainVotes >= quorumThreshold, "Quorum not met");
        
        proposal.executed = true;
        
        // Execute proposal actions
        ProposalAction[] storage actions = proposalActions[proposalId];
        for (uint256 i = 0; i < actions.length; i++) {
            ProposalAction memory action = actions[i];
            (bool success, ) = action.target.call{value: action.value}(action.data);
            require(success, "Action execution failed");
        }
        
        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Cancel a proposal (only proposer or owner)
     * @param proposalId Proposal ID
     */
    function cancel(uint256 proposalId) external {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer || msg.sender == owner(), "Not authorized");
        require(block.timestamp < proposal.startTime, "Voting started");
        require(!proposal.executed, "Proposal executed");
        require(!proposal.cancelled, "Proposal cancelled");
        
        proposal.cancelled = true;
        
        emit ProposalCancelled(proposalId);
    }

    /**
     * @dev Get proposal details
     * @param proposalId Proposal ID
     * @return Proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        bool executed,
        bool cancelled
    ) {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.executed,
            proposal.cancelled
        );
    }

    /**
     * @dev Get proposal actions
     * @param proposalId Proposal ID
     * @return actions Array of proposal actions
     */
    function getProposalActions(uint256 proposalId) external view returns (ProposalAction[] memory actions) {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        return proposalActions[proposalId];
    }

    /**
     * @dev Check if user has voted on a proposal
     * @param proposalId Proposal ID
     * @param voter Voter address
     * @return hasVoted Whether user has voted
     */
    function hasVoted(uint256 proposalId, address voter) external view returns (bool hasVoted) {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        return proposals[proposalId].hasVoted[voter];
    }

    /**
     * @dev Get user's votes on a proposal
     * @param proposalId Proposal ID
     * @param voter Voter address
     * @return votes Number of votes
     */
    function getVotes(uint256 proposalId, address voter) external view returns (uint256 votes) {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        return proposals[proposalId].votes[voter];
    }

    /**
     * @dev Get proposal state
     * @param proposalId Proposal ID
     * @return state Proposal state
     */
    function getProposalState(uint256 proposalId) external view returns (string memory state) {
        require(proposalId <= proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.cancelled) {
            return "Cancelled";
        } else if (proposal.executed) {
            return "Executed";
        } else if (block.timestamp < proposal.startTime) {
            return "Pending";
        } else if (block.timestamp <= proposal.endTime) {
            return "Active";
        } else if (proposal.forVotes <= proposal.againstVotes) {
            return "Defeated";
        } else if (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes < quorumThreshold) {
            return "Quorum Not Met";
        } else {
            return "Succeeded";
        }
    }

    /**
     * @dev Set voting delay (only owner)
     * @param newVotingDelay New voting delay
     */
    function setVotingDelay(uint256 newVotingDelay) external onlyOwner {
        require(newVotingDelay <= 7 days, "Voting delay too long");
        votingDelay = newVotingDelay;
        emit VotingDelayUpdated(newVotingDelay);
    }

    /**
     * @dev Set voting period (only owner)
     * @param newVotingPeriod New voting period
     */
    function setVotingPeriod(uint256 newVotingPeriod) external onlyOwner {
        require(newVotingPeriod >= 1 days && newVotingPeriod <= 14 days, "Invalid voting period");
        votingPeriod = newVotingPeriod;
        emit VotingPeriodUpdated(newVotingPeriod);
    }

    /**
     * @dev Set proposal threshold (only owner)
     * @param newProposalThreshold New proposal threshold
     */
    function setProposalThreshold(uint256 newProposalThreshold) external onlyOwner {
        proposalThreshold = newProposalThreshold;
        emit ProposalThresholdUpdated(newProposalThreshold);
    }

    /**
     * @dev Set quorum threshold (only owner)
     * @param newQuorumThreshold New quorum threshold
     */
    function setQuorumThreshold(uint256 newQuorumThreshold) external onlyOwner {
        quorumThreshold = newQuorumThreshold;
        emit QuorumThresholdUpdated(newQuorumThreshold);
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
