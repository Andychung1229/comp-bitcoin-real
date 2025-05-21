const { ethers, formatUnits } = require("ethers");

// Updated ABI to match your updated contract - isLotteryActive instead of isOpen
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "reason",
                "type": "string"
            }
        ],
        "name": "AutomaticDraw",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "lotteryId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            }
        ],
        "name": "LotteryStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "TicketPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "winner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "prize",
                "type": "uint256"
            }
        ],
        "name": "WinnerSelected",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "buyTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "checkAndDraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "drawWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getParticipants",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "getParticipantsByLottery",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRemainingTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "history",
        "outputs": [
            {
                "internalType": "address",
                "name": "winner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "prize",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isInThresholdPeriod",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isLotteryActive",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lotteryEndTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lotteryId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "manager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "participants",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "participantList",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "prizePool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ticketPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ticketsSold",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Contract address - this is where our smart contract is deployed on the blockchain
// const contractAddress = "0xCeC3234207773E7bF14Dfb555bc0a61562f0be3f";
// const contractAddress = "0x958F61A81Be266376a4658f5574F41f0c6C36407"; 
const contractAddress = "0x2199C9d2657c4Cc7810FC3a37F5522225555fCE4"; 

// Global variables
let lotteryContract;
let currentAccount = null;
let isManager = false;
let countdownInterval;
let checkDrawInterval;
let isDrawingInProgress = false;
let lastRemainingTime = null; // Track the last remaining time value
let lotteryEndTimeLocal = 0;
let localCountdownInterval;


// DOM Elements
const connectWalletBtn = document.getElementById('connect-wallet');
const accountDisplay = document.getElementById('account-display');
const accountInfo = document.getElementById('account-info');
const appContent = document.getElementById('app-content');
const ticketPrice = document.getElementById('ticket-price');
const ticketPriceAction = document.getElementById('ticket-price-action');
const prizePool = document.getElementById('prize-pool');
const ticketsSold = document.getElementById('tickets-sold');
const buyTicketBtn = document.getElementById('buy-ticket');
const drawWinnerBtn = document.getElementById('draw-winner');
// const forceCloseBtn = document.getElementById('force-close');
const participantCount = document.getElementById('participant-count');
const participantsList = document.getElementById('participants-list');
const lotterySelect = document.getElementById('lottery-select');
const lotteryHistory = document.getElementById('lottery-history');
const historyWinner = document.getElementById('history-winner');
const historyPrize = document.getElementById('history-prize');
const historyTime = document.getElementById('history-time');
const historyParticipants = document.getElementById('history-participants');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const managerActions = document.getElementById('manager-actions');
const buyLoader = document.getElementById('buy-loader');
const drawLoader = document.getElementById('draw-loader');
const closeLoader = document.getElementById('close-loader');
const logoutButton = document.getElementById('logout-button');
const countdownDisplay = document.getElementById('countdown-display');
const publicDrawContainer = document.getElementById('public-draw-container');
const publicDrawButton = document.getElementById('public-draw-button');
const publicDrawLoader = document.getElementById('public-draw-loader');
const initializeRoundButton = document.getElementById('initialize-round-button');
const initializeRoundLoader = document.getElementById('initialize-round-loader');
const drawActionMessage = document.getElementById('draw-action-message');
const drawActionNote = document.getElementById('draw-action-note');

// Initialize the application when the page loads
window.addEventListener('load', async function() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        connectWalletBtn.addEventListener('click', connectWallet);
        await checkConnectionOnLoad();
    } else {
        console.log('MetaMask is not installed!');
        showNotification('Please install MetaMask to use this dApp', 'error');
        connectWalletBtn.disabled = true;
        connectWalletBtn.textContent = 'MetaMask Not Installed';
    }
});

// Check if user is already connected on page load
async function checkConnectionOnLoad() {
    try {
        // Check if MetaMask is connected already
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        console.log('Connected accounts:', accounts);
        if (accounts.length > 0) {
            // User is already connected
            console.log('User is already connected:', accounts[0]);
            await handleAccountsChanged(accounts);
        }
    } catch (error) {
        console.error('Error checking connection on load:', error);
    }
}

// Connect to MetaMask wallet
async function connectWallet() {
    try {
        showNotification('Connecting to MetaMask...', 'warning');
        
        // Request account access from MetaMask
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        await handleAccountsChanged(accounts);
        
        // Listen for account changes
        ethereum.on('accountsChanged', handleAccountsChanged);
        
        // Listen for chain changes
        ethereum.on('chainChanged', () => {
            window.location.reload();
        });
        
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        if (error.code === 4001) {
            // User rejected the request
            showNotification('Connection rejected. Please connect to MetaMask.', 'error');
        } else {
            showNotification('Error connecting to MetaMask. Please try again.', 'error');
        }
    }
}

// Disconnect from MetaMask wallet
async function disconnectWallet() {
    try {
        // Reset the UI
        resetUI();
        
        // Show notification
        showNotification('Disconnected from MetaMask.', 'warning');
        
        // Since MetaMask doesn't provide a direct disconnect method,
        // we're simulating a disconnect by resetting our app state
        currentAccount = null;
        isManager = false;
        
        // Clear intervals
        clearInterval(countdownInterval);
        clearInterval(checkDrawInterval);
        
        // Remove event listeners
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        
    } catch (error) {
        console.error('Error disconnecting from MetaMask:', error);
        showNotification('Error disconnecting from MetaMask.', 'error');
    }
}

// Handle account changes (connection/disconnection)
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User has disconnected all accounts
        showNotification('Please connect to MetaMask.', 'warning');
        resetUI();
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        
        // Display account info
        accountDisplay.classList.remove('hide');
        connectWalletBtn.classList.add('hide');
        accountInfo.textContent = `${shortenAddress(currentAccount)}`;
        console.log('Connected account:', currentAccount);
        
        // Initialize the contract
        await initializeContract();
        
        // Show the app content
        appContent.classList.remove('hide');
        
        // Load lottery data
        await refreshUI();
        
        // Start countdown timer and auto-checking for drawing
        startTimers();
        
        showNotification('Connected to MetaMask!', 'success');
    }
}

// Reset UI when disconnected
function resetUI() {
    currentAccount = null;
    isManager = false;
    isDrawingInProgress = false;
    lastRemainingTime = null;
    accountDisplay.classList.add('hide');
    connectWalletBtn.classList.remove('hide');
    appContent.classList.add('hide');
    
    // Clear intervals
    clearInterval(countdownInterval);
    clearInterval(checkDrawInterval);
}

// Initialize the contract with ethers.js
async function initializeContract() {
    try {
        // Create a provider with the user's web3 provider
        console.log('Initializing contract...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Provider:', provider);
        // Create a signer
        const signer = await provider.getSigner();
        
        // Create contract instance
        lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log('Contract instance created:', lotteryContract);

        // Check if current user is the manager
        const managerAddress = await lotteryContract.manager();
        isManager = managerAddress.toLowerCase() === currentAccount.toLowerCase();
        
        // Show/hide manager actions
        managerActions.style.display = isManager ? 'block' : 'none';
        
        // Add event listeners for buttons
        buyTicketBtn.addEventListener('click', buyTicket);
        drawWinnerBtn.addEventListener('click', drawWinner);
        // forceCloseBtn.addEventListener('click', forceClose);
        lotterySelect.addEventListener('change', loadLotteryHistory);
        // Add event listener for public draw button
        publicDrawButton.addEventListener('click', publicDrawWinner);
        initializeRoundButton.addEventListener('click', initializeNewRound);
        
        // Add logout button event listener
        logoutButton.addEventListener('click', disconnectWallet);
        
        // Setup contract event listeners
        setupEventListeners();
        
        // Get initial lottery end time
        await getLotteryEndTime();
        
        console.log('Contract initialized successfully!');
    } catch (error) {
        console.error('Error initializing contract:', error);
        showNotification('Error initializing the lottery contract.', 'error');
    }
}

// Setup event listeners for the contract
// Modify the setupEventListeners function to update local end time:
function setupEventListeners() {
    // Listen for ticket purchases
    lotteryContract.on('TicketPurchased', async (buyer) => {
        if (buyer.toLowerCase() === currentAccount.toLowerCase()) {
            showNotification('Your ticket purchase was successful!', 'success');
        }
        await refreshUI();
    });
    
    // Listen for winner selection
    lotteryContract.on('WinnerSelected', async (winner, prize) => {
        const formattedPrize = formatUnits(prize, "ether");
        const message = winner.toLowerCase() === currentAccount.toLowerCase() 
            ? `Congratulations! You won ${formattedPrize} ETH!` 
            : `Winner selected! ${shortenAddress(winner)} won ${formattedPrize} ETH`;
        showNotification(message, 'success');
        
        // Reset local variables and refresh UI
        isDrawingInProgress = false;
        await refreshUI();
        await getLotteryEndTime(); // Get the new lottery end time
    });
    
    // Listen for lottery starts
    lotteryContract.on('LotteryStarted', async (lotteryId, endTime) => {
        showNotification(`New lottery round #${lotteryId} started!`, 'success');
        
        // Reset drawing state
        isDrawingInProgress = false; 
        lastRemainingTime = null;
        
        // Update the local end time
        lotteryEndTimeLocal = Number(endTime);
        
        await refreshUI();
    });
    
    // Listen for automatic draw events
    lotteryContract.on('AutomaticDraw', async (reason) => {
        showNotification(`Automatic draw triggered: ${reason}`, 'warning');
        await refreshUI();
    });
}

// Add function to handle public drawing
async function publicDrawWinner() {
    try {
        publicDrawLoader.classList.add('show-loader');
        publicDrawButton.disabled = true;
        
        showNotification('Initiating draw... Confirm the transaction to proceed', 'warning');
        
        // Call the checkAndDraw function which any address can call
        const tx = await lotteryContract.checkAndDraw();
        
        showNotification('Drawing transaction sent! Waiting for confirmation...', 'warning');
        
        // Wait for transaction to be mined
        await tx.wait();
        
        showNotification('Drawing completed! New round starting!', 'success');
        
        // Hide the draw buttons after successful draw
        publicDrawContainer.classList.add('hide');
        
    } catch (error) {
        console.error('Error in public draw:', error);
        
        // Show appropriate error message
        if (error.message && error.message.includes('user rejected')) {
            showNotification('Transaction rejected. You can try again when ready.', 'warning');
        } else if (error.data?.message) {
            showNotification(`Error: ${error.data.message}`, 'error');
        } else if (error.message) {
            showNotification(`Error: ${error.message}`, 'error');
        } else {
            showNotification('Error drawing winner. Please try again.', 'error');
        }
        
    } finally {
        publicDrawLoader.classList.remove('show-loader');
        publicDrawButton.disabled = false;
    }
}

// Add function to initialize a new round when no participants
async function initializeNewRound() {
    try {
        initializeRoundLoader.classList.add('show-loader');
        initializeRoundButton.disabled = true;
        
        showNotification('Starting new lottery round... Confirm the transaction to proceed', 'warning');
        
        // Call the checkAndDraw function which will start a new round if there are no participants
        const tx = await lotteryContract.checkAndDraw();
        
        showNotification('Transaction sent! Waiting for confirmation...', 'warning');
        
        // Wait for transaction to be mined
        await tx.wait();
        
        showNotification('New lottery round started successfully!', 'success');
        
        // Hide the buttons after successful initialization
        publicDrawContainer.classList.add('hide');
        
        // Refresh UI to show new lottery data
        await refreshUI();
        
    } catch (error) {
        console.error('Error initializing new round:', error);
        
        // Show appropriate error message
        if (error.message && error.message.includes('user rejected')) {
            showNotification('Transaction rejected. You can try again when ready.', 'warning');
        } else if (error.data?.message) {
            showNotification(`Error: ${error.data.message}`, 'error');
        } else if (error.message) {
            showNotification(`Error: ${error.message}`, 'error');
        } else {
            showNotification('Error starting new round. Please try again.', 'error');
        }
        
    } finally {
        initializeRoundLoader.classList.remove('show-loader');
        initializeRoundButton.disabled = false;
    }
}

// Start timers for countdown and automatic drawing
function startTimers() {
    // Clear existing intervals first
    clearInterval(countdownInterval);
    clearInterval(localCountdownInterval);
    
    if (checkDrawInterval) {
        clearInterval(checkDrawInterval);
        checkDrawInterval = null;
    }
    
    // Reset drawing state
    isDrawingInProgress = false;
    lastRemainingTime = null;
    
    // Get lottery end time from contract
    getLotteryEndTime().then(() => {
        // Start local countdown once we have the end time
        localCountdownInterval = setInterval(updateLocalCountdown, 1000);
    });
    
    // Update blockchain data periodically (every 15 seconds)
    countdownInterval = setInterval(refreshLotteryData, 15000);
}

// Get the lottery end time from contract
async function getLotteryEndTime() {
    try {
        // Get end time from contract
        const endTimeBI = await lotteryContract.lotteryEndTime();
        lotteryEndTimeLocal = Number(endTimeBI);
        console.log('Lottery end time:', lotteryEndTimeLocal);
        
        // Update local countdown immediately
        updateLocalCountdown();
    } catch (error) {
        console.error('Error getting lottery end time:', error);
    }
}

function updateLocalCountdown() {
    try {
        // Get current time
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Calculate remaining time
        let remainingTime = lotteryEndTimeLocal - currentTime;
        
        // Ensure it's not negative
        remainingTime = Math.max(0, remainingTime);
        
        // Format the time
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        // Update countdown display
        if (countdownDisplay) {
            if (remainingTime > 0) {
                const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                countdownDisplay.textContent = formattedTime;
                countdownDisplay.classList.remove('drawing');
                countdownDisplay.classList.remove('empty-round');
                
                // Hide action buttons while time remains
                publicDrawContainer.classList.add('hide');
            } else {
                // Handle time-up UI
                handleTimeExpired();
            }
        }
        
    } catch (error) {
        console.error('Error updating local countdown:', error);
        if (countdownDisplay) {
            countdownDisplay.textContent = 'Error';
        }
    }
}

function isInThresholdPeriodLocal() {
    const currentTime = Math.floor(Date.now() / 1000);
    const thresholdStart = lotteryEndTimeLocal - 10; // 10 seconds before end
    
    return currentTime >= thresholdStart && currentTime < lotteryEndTimeLocal;
}

async function handleTimeExpired() {
    try {
        // Check if there are any participants
        const participantsArray = await lotteryContract.getParticipants();
        const hasParticipants = participantsArray.length > 0;
        
        if (hasParticipants) {
            // Show draw winner UI
            countdownDisplay.textContent = 'Time\'s up! Draw needed';
            drawActionMessage.textContent = 'Lottery time has ended! Click to draw the winner:';
            drawActionNote.textContent = 'Note: This will require a small gas fee to process the transaction.';
            
            // Show draw button, hide initialize button
            publicDrawButton.classList.remove('hide');
            initializeRoundButton.classList.add('hide');
        } else {
            // Show initialize new round UI
            countdownDisplay.textContent = 'Empty round! Start new lottery';
            drawActionMessage.textContent = 'This round had no participants. Start a new lottery round:';
            drawActionNote.textContent = 'Note: Starting a new round requires a small gas fee.';
            
            // Show initialize button, hide draw button
            publicDrawButton.classList.add('hide');
            initializeRoundButton.classList.remove('hide');
        }
        
        countdownDisplay.classList.add('empty-round');
        
        // Show the action container
        publicDrawContainer.classList.remove('hide');
        
    } catch (error) {
        console.error('Error handling time expired UI:', error);
    }
}

// Periodically refresh lottery data from the blockchain
async function refreshLotteryData() {
    try {
        // Get fresh data from contract
        await getLotteryEndTime();
        await refreshUI();
        
        // If time is up and we haven't already triggered draw
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= lotteryEndTimeLocal && !isDrawingInProgress) {
            // Update UI for expired time
            handleTimeExpired();
        }
    } catch (error) {
        console.error('Error refreshing lottery data:', error);
    }
}

// Update countdown timer
async function updateCountdown() {
    try {
        // Get remaining time and other lottery data
        const remainingTimeBI = await lotteryContract.getRemainingTime();
        const remainingTime = Number(remainingTimeBI);
        const isLotteryActiveStatus = await lotteryContract.isLotteryActive();
        
        // If time is up, check if there are any participants
        let hasParticipants = false;
        if (remainingTime === 0) {
            const participants = await lotteryContract.getParticipants();
            hasParticipants = participants.length > 0;
        }
        
        // Format the time
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        // Update countdown display
        if (countdownDisplay) {
            if (remainingTime > 0) {
                const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                countdownDisplay.textContent = formattedTime;
                countdownDisplay.classList.remove('drawing');
                
                // Hide action buttons while time remains
                publicDrawContainer.classList.add('hide');
            } else {
                // Time is up
                
                // Show appropriate action based on participant count
                if (hasParticipants) {
                    // Show draw winner UI
                    countdownDisplay.textContent = 'Time\'s up! Draw needed';
                    drawActionMessage.textContent = 'Lottery time has ended! Click to draw the winner:';
                    drawActionNote.textContent = 'Note: This will require a small gas fee to process the transaction.';
                    
                    // Show draw button, hide initialize button
                    publicDrawButton.classList.remove('hide');
                    initializeRoundButton.classList.add('hide');
                } else {
                    // Show initialize new round UI
                    countdownDisplay.textContent = 'Empty round! Start new lottery';
                    drawActionMessage.textContent = 'This round had no participants. Start a new lottery round:';
                    drawActionNote.textContent = 'Note: Starting a new round requires a small gas fee.';
                    
                    // Show initialize button, hide draw button
                    publicDrawButton.classList.add('hide');
                    initializeRoundButton.classList.remove('hide');
                }
                
                countdownDisplay.classList.add('empty-round');
                
                // Show the action container
                publicDrawContainer.classList.remove('hide');
            }
        }
        
        // Update last remaining time
        lastRemainingTime = remainingTimeBI;
        
    } catch (error) {
        console.error('Error updating countdown:', error);
        if (countdownDisplay) {
            countdownDisplay.textContent = 'Error';
        }
    }
}

// Trigger check and draw function
async function triggerCheckAndDraw() {
    try {
        // Only proceed if we're not already processing a draw
        if (isDrawingInProgress) return;
        
        // Get remaining time
        const remainingTimeBI = await lotteryContract.getRemainingTime();
        const remainingTime = Number(remainingTimeBI);
        
        // If remaining time is 0 and was not 0 in the last check, 
        // or if lastRemainingTime is null, proceed
        if (remainingTime === 0 && (lastRemainingTime === null || Number(lastRemainingTime) > 0)) {
            // Set flag to prevent concurrent draws
            isDrawingInProgress = true;
            
            console.log('Time is up, calling checkAndDraw...');
            
            // Call the checkAndDraw function
            const tx = await lotteryContract.checkAndDraw();
            console.log('CheckAndDraw called, waiting for confirmation...');
            
            // Wait for transaction to be mined to prevent multiple calls
            await tx.wait();
            console.log('CheckAndDraw transaction confirmed');
            
            // Reset flag
            isDrawingInProgress = false;
        }
        
        // Update last remaining time
        lastRemainingTime = remainingTimeBI;
        
    } catch (error) {
        // Reset flag in case of error
        isDrawingInProgress = false;
        
        // Most errors here are expected (e.g., lottery not ready to be drawn)
        // So we'll just log them without showing notifications to users
        console.log('CheckAndDraw check resulted in:', error.message);
    }
}

// Refresh the UI with contract data
// Modify the refreshUI function to use local calculations:
async function refreshUI() {
    try {
        // Get lottery data
        const [
            ticketPriceWei, 
            prizePoolWei, 
            ticketsSoldValue,
            lotteryIdValue,
            isInThreshold
        ] = await Promise.all([
            lotteryContract.ticketPrice(),
            lotteryContract.prizePool(),
            lotteryContract.ticketsSold(),
            lotteryContract.lotteryId(),
            lotteryContract.isInThresholdPeriod()
        ]);
        
        // Convert BigInt to number where needed
        const ticketsSoldNum = Number(ticketsSoldValue);
        
        // Calculate remaining time locally
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = Math.max(0, lotteryEndTimeLocal - currentTime);
        
        // Format and display data
        const ticketPriceEth = formatUnits(ticketPriceWei, "ether");
        ticketPrice.textContent = `${ticketPriceEth} ETH`;
        ticketPriceAction.textContent = ticketPriceEth;
        
        prizePool.textContent = `${formatUnits(prizePoolWei, "ether")} ETH`;
        ticketsSold.textContent = ticketsSoldNum.toString();
        
        // Get participants
        const participantsArray = await lotteryContract.getParticipants();
        participantCount.textContent = participantsArray.length;
        
        // Check if current user has already bought a ticket
        let hasTicket = false;
        if (currentAccount) {
            hasTicket = await lotteryContract.participants(currentAccount);
        }
        
        // Check if in threshold period using local calculation
        const isThresholdLocal = isInThresholdPeriodLocal();
        
        // Update buy button based on status
        buyTicketBtn.disabled = remainingTime === 0 || hasTicket || ticketsSoldNum >= 100 || isThresholdLocal;
        
        if (hasTicket) {
            buyTicketBtn.textContent = 'Already Purchased';
        } else if (ticketsSoldNum >= 100) {
            buyTicketBtn.textContent = 'Sold Out';
        } else if (isThresholdLocal) {
            buyTicketBtn.textContent = 'Buying Closed';
        } else if (remainingTime === 0) {
            buyTicketBtn.textContent = 'Lottery Expired';
        } else {
            buyTicketBtn.textContent = 'Buy Ticket';
        }
        
        // Update draw button based on conditions
        drawWinnerBtn.disabled = remainingTime === 0 || ticketsSoldNum === 0 || !isManager;
        
        // Update force close button
        // forceCloseBtn.disabled = !isManager;
        
        // Display participants
        updateParticipantsList(participantsArray);
        
        // Populate lottery history select
        await populateLotteryHistorySelect(lotteryIdValue);
        
    } catch (error) {
        console.error('Error refreshing UI:', error);
        showNotification('Error loading lottery data.', 'error');
    }
}


// Buy a lottery ticket
async function buyTicket() {
    try {
        buyLoader.classList.add('show-loader');
        buyTicketBtn.disabled = true;
        
        // Get ticket price
        const ticketPriceWei = await lotteryContract.ticketPrice();
        
        // Check if user already has a ticket
        const hasTicket = await lotteryContract.participants(currentAccount);
        if (hasTicket) {
            showNotification('You already have a ticket for this round', 'warning');
            return;
        }
        
        // Check if lottery time is expired
        const remainingTime = await lotteryContract.getRemainingTime();
        if (Number(remainingTime) === 0) {
            showNotification('Lottery time has expired', 'error');
            return;
        }
        
        // Send transaction to buy ticket
        const tx = await lotteryContract.buyTicket({ 
            value: ticketPriceWei 
        });
        
        showNotification('Transaction sent! Waiting for confirmation...', 'warning');
        
        // Wait for transaction to be mined
        await tx.wait();
        
        // Transaction confirmed
        showNotification('Ticket purchased successfully!', 'success');
        
        // Refresh the UI
        await refreshUI();
        
    } catch (error) {
        console.error('Error buying ticket:', error);
        
        // Show more detailed error message when possible
        if (error.data?.message) {
            showNotification(`Error: ${error.data.message}`, 'error');
        } else if (error.message) {
            showNotification(`Error: ${error.message}`, 'error');
        } else {
            showNotification('Error buying ticket. Please try again.', 'error');
        }
        
    } finally {
        buyLoader.classList.remove('show-loader');
        buyTicketBtn.disabled = false;
    }
}

// Draw winner (manager only)
async function drawWinner() {
    try {
        drawLoader.classList.add('show-loader');
        drawWinnerBtn.disabled = true;
        
        // Send transaction to draw winner
        const tx = await lotteryContract.drawWinner();
        
        showNotification('Drawing winner! Waiting for confirmation...', 'warning');
        
        // Wait for transaction to be mined
        await tx.wait();
        
        // Transaction confirmed but we handle the result via event listener
        
    } catch (error) {
        console.error('Error drawing winner:', error);
        
        if (error.data?.message) {
            showNotification(`Error: ${error.data.message}`, 'error');
        } else if (error.message) {
            showNotification(`Error: ${error.message}`, 'error');
        } else {
            showNotification('Error drawing winner. Please try again.', 'error');
        }
        
    } finally {
        drawLoader.classList.remove('show-loader');
        drawWinnerBtn.disabled = false;
    }
}

// // Force close the lottery (manager only)
// async function forceClose() {
//     try {
//         closeLoader.classList.add('show-loader');
//         forceCloseBtn.disabled = true;
        
//         // Send transaction to force close
//         const tx = await lotteryContract.forceClose();
        
//         showNotification('Closing lottery! Waiting for confirmation...', 'warning');
        
//         // Wait for transaction to be mined
//         await tx.wait();
        
//         // Transaction confirmed
//         showNotification('Lottery closed successfully!', 'success');
        
//         // Refresh the UI
//         await refreshUI();
        
//     } catch (error) {
//         console.error('Error force closing lottery:', error);
        
//         if (error.data?.message) {
//             showNotification(`Error: ${error.data.message}`, 'error');
//         } else if (error.message) {
//             showNotification(`Error: ${error.message}`, 'error');
//         } else {
//             showNotification('Error closing lottery. Please try again.', 'error');
//         }
        
//     } finally {
//         closeLoader.classList.remove('show-loader');
//         forceCloseBtn.disabled = false;
//     }
// }

// Update participants list
function updateParticipantsList(participants) {
    participantsList.innerHTML = '';
    
    if (participants.length === 0) {
        const noParticipants = document.createElement('div');
        noParticipants.className = 'participant-item';
        noParticipants.textContent = 'No participants yet';
        participantsList.appendChild(noParticipants);
        return;
    }
    
    participants.forEach(address => {
        const participantItem = document.createElement('div');
        participantItem.className = 'participant-item';
        
        // Highlight current user
        if (address.toLowerCase() === currentAccount.toLowerCase()) {
            participantItem.style.backgroundColor = 'rgba(37, 117, 252, 0.2)';
            participantItem.style.border = '1px solid var(--secondary)';
            participantItem.textContent = `${shortenAddress(address)} (You)`;
        } else {
            participantItem.textContent = shortenAddress(address);
        }
        
        participantsList.appendChild(participantItem);
    });
}

// Populate lottery history select dropdown
async function populateLotteryHistorySelect(currentLotteryId) {
    try {
        // Convert BigInt to number
        const lotteryIdNum = Number(currentLotteryId);
        
        // Clear previous options except the default
        while (lotterySelect.options.length > 1) {
            lotterySelect.remove(1);
        }
        
        // Add options for past lotteries
        for (let i = 1; i < lotteryIdNum; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Lottery #${i}`;
            lotterySelect.appendChild(option);
        }
        
    } catch (error) {
        console.error('Error populating lottery history:', error);
    }
}

// Load lottery history for selected ID
async function loadLotteryHistory() {
    try {
        const lotteryId = lotterySelect.value;
        
        if (!lotteryId) {
            lotteryHistory.classList.add('hide');
            return;
        }
        
        // Get lottery history data
        const historyData = await lotteryContract.history(lotteryId);
        const participants = await lotteryContract.getParticipantsByLottery(lotteryId);
        
        // Display history data
        historyWinner.textContent = shortenAddress(historyData.winner);
        historyPrize.textContent = formatUnits(historyData.prize, "ether");
        
        // Format timestamp to readable date
        let timestamp = 0;
        if (historyData.timestamp) {
            if (typeof historyData.timestamp === 'object' && historyData.timestamp.toString) {
                timestamp = Number(historyData.timestamp.toString());
            } else {
                timestamp = Number(historyData.timestamp);
            }
        }
        
        const formattedTime = timestamp ? new Date(timestamp * 1000).toLocaleString() : "No participant";
        historyTime.textContent = formattedTime;
        
        // Display participants
        historyParticipants.innerHTML = '';
        
        participants.forEach(address => {
            const participantItem = document.createElement('div');
            participantItem.className = 'participant-item';
            
            // Highlight winner
            if (address.toLowerCase() === historyData.winner.toLowerCase()) {
                participantItem.style.backgroundColor = 'rgba(56, 176, 0, 0.2)';
                participantItem.style.border = '1px solid var(--success)';
                participantItem.textContent = `${shortenAddress(address)} (Winner)`;
            } 
            // Highlight current user
            else if (address.toLowerCase() === currentAccount.toLowerCase()) {
                participantItem.style.backgroundColor = 'rgba(37, 117, 252, 0.2)';
                participantItem.style.border = '1px solid var(--secondary)';
                participantItem.textContent = `${shortenAddress(address)} (You)`;
            } else {
                participantItem.textContent = shortenAddress(address);
            }
            
            historyParticipants.appendChild(participantItem);
        });
        
        lotteryHistory.classList.remove('hide');
        
    } catch (error) {
        console.error('Error loading lottery history:', error);
        showNotification('Error loading lottery history.', 'error');
        lotteryHistory.classList.add('hide');
    }
}

// Helper function to shorten addresses for display
function shortenAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Show notification
function showNotification(message, type = 'default') {
    notificationMessage.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}