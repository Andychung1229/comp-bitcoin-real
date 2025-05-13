// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuantumLottery {
    address public manager;
    uint public ticketPrice = 0.001 ether; // Reduced price for testing
    uint public constant MAX_TICKETS = 100;
    uint public constant LOTTERY_DURATION = 5 minutes; // Each lottery lasts 2 minutes
    uint public constant END_THRESHOLD = 10 seconds; // 10-second buying threshold before end

    uint public prizePool;
    uint public lotteryId;
    uint public ticketsSold;
    uint public lotteryEndTime; // When this lottery round ends

    // Current lottery participants
    mapping(address => bool) public participants;
    address[] public participantList;

    // Lottery history tracking
    struct LotteryResult {
        address winner;
        uint prize;
        uint timestamp;
        address[] participants;
    }
    mapping(uint => LotteryResult) public history;

    event LotteryStarted(uint indexed lotteryId, uint endTime);
    event TicketPurchased(address indexed buyer);
    event WinnerSelected(address indexed winner, uint prize);
    event AutomaticDraw(string reason);

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager");
        _;
    }

    constructor() {
        manager = msg.sender;
        _startNewLottery();
    }

    function buyTicket() external payable {
        // Check if lottery is active based on time
        require(block.timestamp < lotteryEndTime, "Lottery time has expired");
        
        // Check if lottery is in threshold period
        require(block.timestamp < lotteryEndTime - END_THRESHOLD, "In final countdown period");
        
        // Check if max tickets sold
        require(ticketsSold < MAX_TICKETS, "Max tickets sold");
        
        require(msg.value == ticketPrice, "Incorrect value");
        require(!participants[msg.sender], "Already bought");

        participants[msg.sender] = true;
        participantList.push(msg.sender);
        prizePool += msg.value;
        ticketsSold++;
        
        emit TicketPurchased(msg.sender);
        
        // Check if this was the last ticket
        if (ticketsSold == MAX_TICKETS) {
            // Call drawWinner after the last ticket is sold
            _drawWinner("Maximum participants reached");
        }
    }

    // Anyone can trigger this function to check and automatically draw if conditions are met
    function checkAndDraw() external {
        // Only allow drawing after the end time
        require(block.timestamp >= lotteryEndTime, "Cannot draw before lottery end time");
        
        // If there are participants, draw a winner
        if (ticketsSold > 0) {
            _drawWinner("Time limit reached");
        } else {
            // No participants, just reset lottery
            _startNewLottery();
        }
    }

    // Manual draw function (still available for manager)
    function drawWinner() external onlyManager {
        require(ticketsSold > 0, "No participants");
        _drawWinner("Manual draw by manager");
    }
    
    // Internal draw winner function used by both automatic and manual draws
    function _drawWinner(string memory reason) internal {
        // Improved randomness using multiple block properties
        bytes32 entropy = keccak256(abi.encodePacked(
            block.prevrandao,
            block.timestamp,
            block.coinbase,
            ticketsSold,
            reason
        ));

        uint index = uint(entropy) % ticketsSold;
        address winner = participantList[index];

        // 95% to winner, 5% to manager
        uint prize = prizePool * 95 / 100;
        uint fee = prizePool - prize;

        if (prize > 0) {
            (bool success,) = winner.call{value: prize}("");
            require(success, "Transfer failed");
        }
        
        if (fee > 0) {
            payable(manager).transfer(fee);
        }

        emit WinnerSelected(winner, prize);
        _recordResult(winner, prize);
        _startNewLottery();
    }

    function _startNewLottery() private {
        lotteryId++;
        ticketsSold = 0;
        prizePool = 0;
        lotteryEndTime = block.timestamp + LOTTERY_DURATION;
        
        // Reset participant data
        for (uint i = 0; i < participantList.length; i++) {
            participants[participantList[i]] = false;
        }
        delete participantList;

        emit LotteryStarted(lotteryId, lotteryEndTime);
    }

    function _recordResult(address winner, uint prize) private {
        // Store participant list in history
        history[lotteryId] = LotteryResult({
            winner: winner,
            prize: prize,
            timestamp: block.timestamp,
            participants: participantList
        });
    }

    // Public getter for current participant list
    function getParticipants() public view returns (address[] memory) {
        return participantList;
    }

    // Public getter for previous participants by lotteryId
    function getParticipantsByLottery(uint id) public view returns (address[] memory) {
        return history[id].participants;
    }
    
    // Get remaining time for current lottery round
    function getRemainingTime() public view returns (uint) {
        if (block.timestamp >= lotteryEndTime) {
            return 0;
        }
        return lotteryEndTime - block.timestamp;
    }
    
    // Get whether we're in the threshold period
    function isInThresholdPeriod() public view returns (bool) {
        return block.timestamp >= lotteryEndTime - END_THRESHOLD && 
               block.timestamp < lotteryEndTime;
    }
    
    // Check if lottery is active (time not expired, not in threshold)
    function isLotteryActive() public view returns (bool) {
        return block.timestamp < lotteryEndTime - END_THRESHOLD && 
               ticketsSold < MAX_TICKETS;
    }

    // Emergency shutdown pattern
    function forceClose() external onlyManager {
        _startNewLottery();
    }
}