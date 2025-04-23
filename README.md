# CoordiChain

CoordiChain is a decentralized task coordination platform built for DAOs. It uses Ethereum smart contracts to handle task lifecycle logic (create, claim, complete, approve), while IPFS is used to store task metadata and deliverables off-chain.

##  Week 1 Progress

-  Smart contract created using Solidity and Hardhat
-  Defined full task lifecycle (Open → Claimed → Completed → Approved)
-  Access control enforced via `msg.sender` checks
-  Event emitters added for frontend tracking
-  Unit tests written using Mocha & Chai (all passing)
-  Local deployment script added and verified

##  Tech Stack

- **Smart Contracts**: Solidity
- **Development**: Hardhat, Ethers.js
- **Testing**: Mocha + Chai
- **Storage**: IPFS (coming in Week 2)

##  How to Use

1. **Install dependencies**
```bash
npm install
