const { ethers ,formatUnits} = require("ethers");
const abi = [
    // Constructor and events omitted for brevity
    "function buyTicket() payable",
    "function drawWinner()",
    "function forceClose()",
    "function getParticipants() view returns (address[])",
    "function getParticipantsByLottery(uint256 id) view returns (address[])",
    "function history(uint256) view returns (address winner, uint256 prize, uint256 timestamp)",
    "function isOpen() view returns (bool)",
    "function lotteryId() view returns (uint256)",
    "function manager() view returns (address)",
    "function participants(address) view returns (bool)",
    "function participantList(uint256) view returns (address)",
    "function prizePool() view returns (uint256)",
    "function ticketPrice() view returns (uint256)",
    "function ticketsSold() view returns (uint256)"
  ];
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
                "indexed": true,
                "internalType": "uint256",
                "name": "lotteryId",
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
        "name": "drawWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "forceClose",
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
        "name": "isOpen",
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
const contractAddress = "0x90263a3d2a2ed9C1b4Fc263907863de47a25F6F3";

// Global variables
let lotteryContract;
let currentAccount = null;
let isManager = false;

// DOM Elements
const connectWalletBtn = document.getElementById('connect-wallet');
const accountDisplay = document.getElementById('account-display');
const accountInfo = document.getElementById('account-info');
const appContent = document.getElementById('app-content');
const lotteryStatus = document.getElementById('lottery-status');
const ticketPrice = document.getElementById('ticket-price');
const ticketPriceAction = document.getElementById('ticket-price-action');
const prizePool = document.getElementById('prize-pool');
const ticketsSold = document.getElementById('tickets-sold');
const buyTicketBtn = document.getElementById('buy-ticket');
const drawWinnerBtn = document.getElementById('draw-winner');
const forceCloseBtn = document.getElementById('force-close');
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
        console.log('lets go:', currentAccount);
        // Initialize the contract
        await initializeContract();
        
        // Show the app content
        appContent.classList.remove('hide');
        
        // Load lottery data
        await refreshUI();
        
        showNotification('Connected to MetaMask!', 'success');
    }
}

// Reset UI when disconnected
function resetUI() {
    currentAccount = null;
    isManager = false;
    accountDisplay.classList.add('hide');
    connectWalletBtn.classList.remove('hide');
    appContent.classList.add('hide');
}

// Initialize the contract with ethers.js
async function initializeContract() {
    try {
        // Create a provider with the user's web3 provider
        console.log('Initializing contract...');
        console.log('Script starting...');
        console.log('Ethers available:', typeof ethers !== 'undefined');
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Provider:', provider);
        console.log('Provider type:', typeof provider);
      
        console.log('Provider network:', await provider.getNetwork());
        console.log('Provider accounts:', await provider.listAccounts());
        
        
        // Create a signer
        const signer = await provider.getSigner();
        console.log('Signer:', signer);

        
        // Create contract instance
        lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);


        console.log('Contract instance created:', lotteryContract);
        console.log("Contract address:", lotteryContract.interface);
        console.log('sou')
        console.log('ticketPrice:', await lotteryContract.ticketPrice());
        
               
        
        // Check if current user is the manager
        const managerAddress = await lotteryContract.manager();
        console.log('Manager address:', managerAddress);
        isManager = managerAddress.toLowerCase() === currentAccount.toLowerCase();
        console.log('Manager address:', managerAddress);
        console.log('Current account:', currentAccount);
        console.log('Is manager:', isManager);
        
        // Show/hide manager actions
        managerActions.style.display = isManager ? 'block' : 'none';
        
        // Add event listeners for buttons
        buyTicketBtn.addEventListener('click', buyTicket);
        drawWinnerBtn.addEventListener('click', drawWinner);
        forceCloseBtn.addEventListener('click', forceClose);
        lotterySelect.addEventListener('change', loadLotteryHistory);
        // Add logout button event listener
        logoutButton.addEventListener('click', disconnectWallet);
        
        // Setup contract event listeners
        setupEventListeners();
        
        console.log('Contract initialized successfully!');
    } catch (error) {
        console.error('Error initializing contract:', error);
        showNotification('Error initializing the lottery contract.', 'error');
    }
}

// Setup event listeners for the contract
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
        const formattedPrize = formatUnits(prize,"ether");
        const message = winner.toLowerCase() === currentAccount.toLowerCase() 
            ? `Congratulations! You won ${formattedPrize} ETH!` 
            : `Winner selected! ${shortenAddress(winner)} won ${formattedPrize} ETH`;
        showNotification(message, 'success');
        await refreshUI();
    });
    
    // Listen for lottery starts
    lotteryContract.on('LotteryStarted', async (lotteryId) => {
        showNotification(`New lottery round #${lotteryId} started!`, 'success');
        await refreshUI();
    });
}

// Refresh the UI with contract data
async function refreshUI() {
    try {
        // Get lottery data
        const [
            isOpenStatus, 
            ticketPriceWei, 
            prizePoolWei, 
            ticketsSoldValue,
            lotteryIdValue
        ] = await Promise.all([
            lotteryContract.isOpen(),
            lotteryContract.ticketPrice(),
            lotteryContract.prizePool(),
            lotteryContract.ticketsSold(),
            lotteryContract.lotteryId()
        ]);
        
        // Format and display data
        lotteryStatus.textContent = isOpenStatus ? 'Open' : 'Closed';
        lotteryStatus.style.color = isOpenStatus ? 'var(--success)' : 'var(--danger)';
        
        const ticketPriceEth = formatUnits(ticketPriceWei,"ether");
        ticketPrice.textContent = `${ticketPriceEth} ETH`;
        ticketPriceAction.textContent = ticketPriceEth;
        
        prizePool.textContent = `${formatUnits(prizePoolWei,"ether")} ETH`;
        ticketsSold.textContent = ticketsSoldValue.toString();
        
        // Get participants
        const participantsArray = await lotteryContract.getParticipants();
        participantCount.textContent = participantsArray.length;
        
        // Check if current user has already bought a ticket
        let hasTicket = false;
        if (currentAccount) {
            hasTicket = await lotteryContract.participants(currentAccount);
        }
        
        // Update buy button based on ticket status
        buyTicketBtn.disabled = !isOpenStatus || hasTicket || ticketsSoldValue >= 100;
        if (hasTicket) {
            buyTicketBtn.textContent = 'Already Purchased';
        } else if (ticketsSoldValue >= 100) {
            buyTicketBtn.textContent = 'Sold Out';
        } else {
            buyTicketBtn.textContent = 'Buy Ticket';
        }
        
        // Update draw button based on conditions
        drawWinnerBtn.disabled = !isOpenStatus || ticketsSoldValue === 0 || !isManager;
        
        // Update force close button
        forceCloseBtn.disabled = !isOpenStatus || !isManager;
        
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

// Force close the lottery (manager only)
async function forceClose() {
    try {
        closeLoader.classList.add('show-loader');
        forceCloseBtn.disabled = true;
        
        // Send transaction to force close
        const tx = await lotteryContract.forceClose();
        
        showNotification('Closing lottery! Waiting for confirmation...', 'warning');
        
        // Wait for transaction to be mined
        await tx.wait();
        
        // Transaction confirmed
        showNotification('Lottery closed successfully!', 'success');
        
        // Refresh the UI
        await refreshUI();
        
    } catch (error) {
        console.error('Error force closing lottery:', error);
        
        if (error.data?.message) {
            showNotification(`Error: ${error.data.message}`, 'error');
        } else if (error.message) {
            showNotification(`Error: ${error.message}`, 'error');
        } else {
            showNotification('Error closing lottery. Please try again.', 'error');
        }
        
    } finally {
        closeLoader.classList.remove('show-loader');
        forceCloseBtn.disabled = false;
    }
}

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
        // Clear previous options except the default
        while (lotterySelect.options.length > 1) {
            lotterySelect.remove(1);
        }
        
        // Add options for past lotteries
        for (let i = 1; i < currentLotteryId; i++) {
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
        historyPrize.textContent = formatUnits(historyData.prize,"ether") + ' ETH';
        
        // Format timestamp to readable date
        const timestamp = historyData.timestamp ? 
        (typeof historyData.timestamp === 'object' ? 
            (historyData.timestamp.toString ? Number(historyData.timestamp.toString()) : 0) 
            : Number(historyData.timestamp)) 
        : 0;
        
        const formattedTime = timestamp ? new Date(timestamp * 1000).toLocaleString() : "Unknown";
        historyTime.textContent = formattedTime;

        // const date = new Date(historyData.timestamp.toNumber() * 1000);
        // historyTime.textContent = date.toLocaleString();
        
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
