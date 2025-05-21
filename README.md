# Quantum Lottery DApp

A decentralized lottery application built on Ethereum that allows users to participate in time-based lottery rounds with improved randomness and transparency.

[Quantum Lottery Interface](photos/lottery4.png)

## Project Overview

The Quantum Lottery is a decentralized application that runs entirely on the Ethereum blockchain. It features a time-based lottery system where users can purchase tickets and automatically participate in drawing rounds. Each lottery round runs for a fixed duration, with automated winner selection and prize distribution when the time expires.

## Contract Address

The smart contract is deployed on Sepolia Testnet at: `0x958F61A81Be266376a4658f5574F41f0c6C36407`

You can view it on [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x958F61A81Be266376a4658f5574F41f0c6C36407)

## Features

- **Time-Based Rounds**: Each lottery round runs for a fixed duration.
- **Threshold Period**: A "final countdown" period where ticket purchases are closed (10 seconds before end).
- **Transparent Winner Selection**: Uses multiple block properties for improved randomness.
- **Prize Distribution**: 95% of the pool goes to the winner, 5% to the protocol manager.
- **Lottery History**: View past lottery results and participants.
- **Auto-Draw Capability**: Anyone can trigger the drawing once the time expires.
- **Responsive UI**: Real-time updates on remaining time and lottery status.
- **Manager Functions**: Special actions available to the lottery manager.

[Active Lottery Round](photos/lottery1.png)

## Technical Innovations

- **Enhanced Randomness**: Uses multiple sources of entropy including block timestamp, prevrandao, and block coinbase.
- **Time-Based State Management**: Eliminates boolean state flags in favor of time-based state determination.
- **Client-Side Time Calculations**: Reduces blockchain calls by calculating time locally once synchronized.
- **Automatic Draw Triggers**: Multiple conditions to ensure lottery progresses (time expiry, max tickets).

## Running the Project Locally

Since this project requires a local development server for proper functionality, GitHub Pages hosting isn't sufficient. Here's how to set up and run the project locally:

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) browser extension

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Andychung1229/comp-bitcoin-real.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:7777](http://localhost:7777) in your browser.

### Accessing the DApp

Once the development server is running:

1. Ensure MetaMask is installed in your browser
2. Connect to the Sepolia testnet in MetaMask
3. Make sure you have some Sepolia ETH (available from faucets)
4. Open the application in your browser and connect your wallet

[Lottery Drawing Phase](photos/lottery3.png)

## Smart Contract Details

The smart contract (`lot2.sol`) is the backbone of this application, handling all lottery logic on the Ethereum blockchain.

### Key Contract Parameters

- **Ticket Price**: 0.001 ETH (reduced for testing purposes)
- **Maximum Tickets**: 100 tickets per lottery round
- **Lottery Duration**: 5 minutes per round (configurable)
- **End Threshold**: 10-second buying threshold before lottery ends

### Contract Functions

| Function | Description | Access |
|----------|-------------|--------|
| `buyTicket()` | Purchase a lottery ticket | Anyone |
| `checkAndDraw()` | Check if lottery is complete and draw winner | Anyone |
| `drawWinner()` | Manually draw a winner | Manager only |
| `forceClose()` | Force close the current lottery round | Manager only |
| `getParticipants()` | View current participants | Anyone |
| `getRemainingTime()` | Check remaining time in lottery | Anyone |

### State Management

The contract uses time-based state management rather than explicit boolean flags. The lottery state is determined by:

1. Current time relative to lottery end time
2. Whether current time is within the threshold period
3. Number of tickets sold relative to maximum

## User Interface

The front-end interface provides a user-friendly way to interact with the smart contract:

### UI Components

- **Connection Panel**: Connect/disconnect MetaMask wallet
- **Countdown Timer**: Visual countdown of time remaining in current lottery
- **Info Dashboard**: Displays ticket price, prize pool, and tickets sold
- **Action Buttons**: Buy tickets, draw winners (based on user permissions)
- **Participants List**: Shows all current lottery participants
- **History Section**: Allows viewing past lottery results

[Lottery History View](photos/lottery5.png)

### Technical Implementation

- **Front-end**: HTML, CSS, JavaScript
- **Blockchain Interaction**: ethers.js v6
- **Wallet Connection**: MetaMask Web3 provider
- **Event Handling**: Contract event listeners for real-time updates
- **Local Time Calculation**: Client-side time computation to reduce blockchain calls

## Project Files Structure

```
quantum-lottery/
├── contracts/
│   └── lot2.sol       # Smart contract source code
├── src/
│   ├── index.html               # Main HTML file
│   ├── lottery.js                      # Application logic
│   └── styles.css               # Styling
├── package.json                 # Project dependencies
├── webpack.config.js            # Webpack configuration
└── README.md                    # Project documentation
```

## Testing Instructions

To thoroughly test the application:

1. **Connect your wallet**: Click the "Connect Wallet" button to link your MetaMask account.

2. **Buy a ticket**: If the lottery is active, purchase a ticket using the "Buy Ticket" button.

3. **Observe the countdown**: Watch the timer count down to the lottery end.

4. **Test threshold period**: Try to buy a ticket in the last 10 seconds (should be disabled).

5. **Draw the winner**: Once time expires, use the "Draw Winner" button that appears.
   [Draw Winner Phase](photos/lottery3.png)

6. **View history**: After a winner is drawn, check the history section for results.
   [History View](photos/lottery5.png)

## Security Considerations

The contract implements several security measures:

- **Time-based controls**: Preventing actions outside of allowed time windows
- **Access control**: Manager-only functions protected with modifiers
- **Balance management**: Direct transfers to winners rather than withdrawal pattern
- **Randomness enhancement**: Multiple sources of entropy to prevent manipulation
- **State reset**: Proper clearing of state between lottery rounds
- **Participant tracking**: Preventing duplicate ticket purchases

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Ethers.js](https://docs.ethers.org/) for Ethereum interactions
- [MetaMask](https://docs.metamask.io/) for wallet connectivity
- [Webpack](https://webpack.js.org/) for bundling
- Sepolia Testnet for providing a testing environment

---

**Note for Course Submission**: This project was developed for COMP4541 Blockchain, Cryptocurrencies and Smart Contracts (Spring 2025). The implementation focuses on demonstrating practical decentralized application development with both smart contract and front-end components.