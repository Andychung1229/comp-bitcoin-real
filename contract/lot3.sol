// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title QuantumLottery
 * @dev A secure lottery contract with imported security libraries
 */
contract QuantumLottery is ReentrancyGuard, Ownable, Pausable {
    uint public ticketPrice = 0.001 ether; // Reduced price for testing
    uint public constant MAX_TICKETS = 100;
    uint public constant LOTTERY_DURATION = 5 minutes; // Each lottery lasts 5 minutes
    uint public constant END_THRESHOLD = 10 seconds; // 10-second buying threshold before end

    uint public prizePool;
    uint public lotteryId;
    uint public ticketsSold;
    uint public lotteryEndTime; // When this lottery round ends
    
    // Current lottery participants - using lotteryId to avoid expensive clear operations
    mapping(uint => mapping(address => bool)) public participants;
    mapping(uint => address[]) public participantLists;
    
    // Pending withdrawals for winners (using pull pattern instead of push)
    mapping(address => uint) public pendingWithdrawals;

    // Lottery history tracking
    struct LotteryResult {
        address winner;
        uint prize;
        uint timestamp;
        uint participantCount;
        uint lotteryId;
    }
    mapping(uint => LotteryResult) public history;

    event LotteryStarted(uint indexed lotteryId, uint endTime);
    event TicketPurchased(address indexed buyer, uint lotteryId);
    event WinnerSelected(address indexed winner, uint prize, uint lotteryId);
    event AutomaticDraw(string reason, uint lotteryId);
    event FundsWithdrawn(address indexed user, uint amount);
    event ManagerFeeTransferred(uint amount);

    constructor() Ownable(msg.sender) {
        _startNewLottery();
    }

    /**
     * @dev Allows users to purchase a lottery ticket
     */
    function buyTicket() external payable whenNotPaused nonReentrant {
        // Check if lottery is active based on time
        require(block.timestamp < lotteryEndTime, "QuantumLottery: lottery time has expired");
        
        // Check if lottery is in threshold period
        require(block.timestamp < lotteryEndTime - END_THRESHOLD, 
                "QuantumLottery: in final countdown period");
        
        // Check if max tickets sold
        require(ticketsSold < MAX_TICKETS, "QuantumLottery: maximum tickets sold");
        
        require(msg.value == ticketPrice, "QuantumLottery: incorrect ticket price");
        require(!participants[lotteryId][msg.sender], "QuantumLottery: already purchased a ticket");

        // Update state - follow checks-effects-interactions pattern
        participants[lotteryId][msg.sender] = true;
        participantLists[lotteryId].push(msg.sender);
        prizePool += msg.value;
        ticketsSold++;
        
        emit TicketPurchased(msg.sender, lotteryId);
        
        // Check if this was the last ticket
        if (ticketsSold == MAX_TICKETS) {
            // Automatically draw when max tickets sold
            _selectWinner("Maximum participants reached");
        }
    }

    /**
     * @dev Public function to check and trigger automatic draw if conditions are met
     */
    function checkAndDraw() external whenNotPaused nonReentrant {
        // Only allow drawing after the end time
        require(block.timestamp >= lotteryEndTime, 
                "QuantumLottery: cannot draw before lottery end time");
        
        // If there are participants, draw a winner
        if (ticketsSold > 0) {
            _selectWinner("Time limit reached");
        } else {
            // No participants, just reset lottery
            _startNewLottery();
        }
    }

    /**
     * @dev Manager function to manually draw a winner
     */
    function drawWinner() external onlyOwner whenNotPaused nonReentrant {
        require(ticketsSold > 0, "QuantumLottery: no participants");
        _selectWinner("Manual draw by manager");
    }
    
    /**
     * @dev Internal function to select a winner using improved practices
     * @param reason String description of what triggered the draw
     */
    function _selectWinner(string memory reason) internal {
        // Capture current state values to avoid confusion during state changes
        uint currentLotteryId = lotteryId;
        uint currentPrize = prizePool * 95 / 100;  // 95% to winner
        uint managerFee = prizePool - currentPrize; // 5% to manager
        
        // For production use Chainlink VRF or a similar solution
        bytes32 entropy = keccak256(abi.encodePacked(
            block.prevrandao,
            block.timestamp,
            block.coinbase,
            ticketsSold,
            blockhash(block.number - 1),
            reason
        ));

        uint index = uint(entropy) % ticketsSold;
        address winner = participantLists[currentLotteryId][index];
        
        // Record result before any external calls (following checks-effects-interactions)
        _recordResult(winner, currentPrize, currentLotteryId);
        
        // Add prize to pending withdrawals instead of sending directly
        pendingWithdrawals[winner] += currentPrize;
        
        // Transfer fee to manager - Lower risk since manager is trusted
        if (managerFee > 0) {
            (bool success,) = payable(owner()).call{value: managerFee}("");
            if (success) {
                emit ManagerFeeTransferred(managerFee);
            }
        }
        
        // Start new lottery round
        _startNewLottery();
        
        emit WinnerSelected(winner, currentPrize, currentLotteryId);
        emit AutomaticDraw(reason, currentLotteryId);
    }

    /**
     * @dev Implements the pull pattern for prize withdrawals
     */
    function withdrawPrize() external nonReentrant {
        uint amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "QuantumLottery: no funds to withdraw");
        
        // Update state before transfer (prevent reentrancy)
        pendingWithdrawals[msg.sender] = 0;
        
        // Transfer funds
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "QuantumLottery: withdrawal failed");
        
        emit FundsWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Start a new lottery round, resetting state
     */
    function _startNewLottery() private {
        lotteryId++;
        ticketsSold = 0;
        prizePool = 0;
        lotteryEndTime = block.timestamp + LOTTERY_DURATION;
        
        // No need to reset participants mapping - we use a new lotteryId key
        
        emit LotteryStarted(lotteryId, lotteryEndTime);
    }

    /**
     * @dev Record lottery results in history
     */
    function _recordResult(address winner, uint prize, uint id) private {
        // Store only essential participant info to save gas
        history[id] = LotteryResult({
            winner: winner,
            prize: prize,
            timestamp: block.timestamp,
            participantCount: ticketsSold,
            lotteryId: id
        });
    }

    /**
     * @dev Get current participants
     */
    function getParticipants() public view returns (address[] memory) {
        return participantLists[lotteryId];
    }

    /**
     * @dev Get participants from a previous lottery
     */
    function getParticipantsByLottery(uint id) public view returns (address[] memory) {
        return participantLists[id];
    }
    
    /**
     * @dev Get remaining time for current lottery round
     */
    function getRemainingTime() public view returns (uint) {
        if (block.timestamp >= lotteryEndTime) {
            return 0;
        }
        return lotteryEndTime - block.timestamp;
    }
    
    /**
     * @dev Check if we're in the threshold period
     */
    function isInThresholdPeriod() public view returns (bool) {
        return block.timestamp >= lotteryEndTime - END_THRESHOLD && 
               block.timestamp < lotteryEndTime;
    }
    
    /**
     * @dev Check if lottery is active
     */
    function isLotteryActive() public view returns (bool) {
        if (paused()) return false;
        
        return block.timestamp < lotteryEndTime - END_THRESHOLD && 
               ticketsSold < MAX_TICKETS;
    }

    /**
     * @dev Pause the contract
     */
    function pauseContract() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpauseContract() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency lottery reset
     */
    function forceClose() external onlyOwner nonReentrant {
        _startNewLottery();
    }
    
    /**
     * @dev Allow manager to update ticket price for future lotteries
     */
    function setTicketPrice(uint newPrice) external onlyOwner {
        require(newPrice > 0, "QuantumLottery: price must be greater than zero");
        ticketPrice = newPrice;
    }
    
    /**
     * @dev Function to handle receipt of ETH when no data is provided (fallback)
     */
    receive() external payable {
        // Add sent ETH to the prize pool
        prizePool += msg.value;
    }
}