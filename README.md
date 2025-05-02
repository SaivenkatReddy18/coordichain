# 🌐 CoordiChain - Week 4 Progress Report

CoordiChain is a blockchain-based platform for collaborative task management in decentralized organizations (DAOs). It enables secure creation of task boards, member role assignments, and transparent task lifecycle tracking using Ethereum smart contracts and IPFS for metadata storage.

> **Decentralized Task Coordination Platform for DAOs**  
> Built with Solidity, IPFS, Ethers.js, React, and Hardhat

---
##  Motivation

Most to-do lists are centralized, private, and temporary. CoordiChain was designed to demonstrate how **decentralized task workflows** can be enabled for **DAOs**, ensuring transparency, immutability, and accountability.

---

##  Project Structure

```bash
coordichain/
├── contracts/
│   └── CoordiChain.sol          # Smart contract for task board & role logic
├── scripts/
│   ├── deploy.js                # Hardhat script to deploy contract
│   └── uploadTaskPinata.js      # Upload task metadata to IPFS (Pinata)
├── test/
│   └── CoordiChain.js           # Test cases for smart contract
├── coordichain-frontend/
│   ├── src/
│   │   ├── abi/
│   │   │   └── CoordiChain.json # ABI after each compilation
│   │   ├── components/
│   │   │   └── AddMemberForm.jsx
│   │   │   └── CreateBoard.jsx
│   │   │   └── TaskCard.jsx
│   │   └── App.jsx
│   └── constants.js             # Stores deployed contract address
├── .env
├── .gitignore
├── hardhat.config.js
├── package.json
└── README.md
```

---
##  How to Run This Project

1. **Clone the Repo**

```bash
git clone https://github.com/SaivenkatReddy18/coordichain.git
cd coordichain
```

2. **Install Dependencies**

```bash
npm install
```

3. **Compile the Contract**

```bash
npx hardhat compile
```

4. **Run Tests**

```bash
npx hardhat test
```

5. **Deploy to Localhost**

```bash
npx hardhat node

```

---

##  Setup Instructions

###  1. Compile & Deploy Smart Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

###  2. Update Frontend

After deployment, copy the contract address from the terminal and update it in:

```
coordichain-frontend/src/constants.js
```

Then copy the ABI:

```bash
cp artifacts/contracts/CoordiChain.sol/CoordiChain.json coordichain-frontend/src/abi/CoordiChain.json
```

---

##  Workflow Instructions

###  Create Task Board

- Go to the frontend interface (e.g., http://localhost:3000)
- Connect your wallet
- Click “Create Task Board”
- Copy the board ID displayed

###  Add Members

- Input the **Board ID**, **Wallet Address**, and **Role** (Contributor / Reviewer)
- Click “Add Member”

>  Make sure the connected account is the **board owner** (deployer) before adding members.

---

###  Create Task (in Console)

Switch to your Hardhat console:

```bash
npx hardhat console --network localhost
```

Then execute:

```js
const [owner] = await ethers.getSigners();
const contract = await ethers.getContractAt("CoordiChain", "<contract-address>", owner);
const tx = await contract.createTask(<boardId>, "<metadataCID>");
await tx.wait();
```

> Make sure `metadataCID` is uploaded via Pinata or IPFS.

---

###  Interact with Tasks

1. Switch to Contributor (Account 2) in MetaMask
2. Click “Claim” on open task
3. Click “Complete” (input deliverable CID)
4. Switch to Creator or Reviewer (Account 1)
5. Click “Approve”

---

##  Summary

-  Role-based access tested: Owner, Contributor, Reviewer
-  Tasks fully functional with IPFS integration
-  Frontend dynamically renders based on user role
-  Complete flow validated on local Hardhat network

---

##  Authors

- Seri Sai Venkat Reddy – SAI.VENKAT.REDDY.SERI-1@ou.edu
- Vijay Chirram – VIJAY.CHIRRAM-1@ou.edu

---
