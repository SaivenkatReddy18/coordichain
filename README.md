
# CoordiChain

CoordiChain is a decentralized task coordination platform built for DAOs. It uses Ethereum smart contracts to manage task lifecycles in a trustless, transparent way. All task-related data (description, deliverables, status) is either on-chain or referenced via IPFS for scalability and immutability.

## Project Goals

- Enable decentralized teams or DAOs to assign, claim, complete, and approve tasks
- Use Ethereum smart contracts to securely track task states and ownership
- Leverage IPFS to store task metadata and deliverables off-chain

## Week 1 Progress

- Created CoordiChain smart contract (CoordiChain.sol)
- Implemented task lifecycle: createTask, claimTask, completeTask, approveTask
- Enforced access control (only creators and assignees can perform specific actions)
- Added events for task tracking: TaskCreated, TaskClaimed, TaskCompleted, TaskApproved
- Wrote test cases using Mocha and Chai (test/CoordiChain.js)
- Verified deployment via scripts/deploy.js using Hardhat
- Resolved all local and remote GitHub conflicts and committed clean history

## Week 2 Progress

- Integrated Pinata to upload task metadata to IPFS
- Stored returned CID in the smart contract using createTask
- Verified storage and retrieval by calling tasks(0) in Hardhat console
- IPFS CID used: QmcxHbafZVXEJRLegJEa3bg8MjBGUxd1d3UeKgTQmfiJiA
- Used dotenv to manage API keys securely

Example retrieved task data from smart contract:

[
  0n,
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x0000000000000000000000000000000000000000',
  0n,
  'QmcxHbafZVXEJRLegJEa3bg8MjBGUxd1d3UeKgTQmfiJiA',
  ''
]

## Tech Stack

- Smart Contracts: Solidity
- Framework: Hardhat
- Testing: Mocha and Chai
- Deployment: Hardhat (local, Sepolia-ready)
- Storage: IPFS via Pinata
- Frontend integration coming in Week 3

## How to Use

1. Clone the Repo

git clone https://github.com/SaivenkatReddy18/coordichain.git
cd coordichain

2. Install Dependencies

npm install

3. Compile Contract

npx hardhat compile

4. Run Tests

npx hardhat test

5. Deploy to Local Network

npx hardhat run scripts/deploy.js

## Project Structure

coordichain/
├── contracts/
│   └── CoordiChain.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── CoordiChain.js
├── hardhat.config.js
├── package.json
├── README.md

## Authors

- Seri Sai Venkat Reddy – SAI.VENKAT.REDDY.SERI-1@ou.edu
- Vijay Chirram – VIJAY.CHIRRAM-1@ou.edu

## License

MIT License. Feel free to fork and build upon for DAO tools and decentralized coordination platforms.
