#  CoordiChain - Decentralized Task Coordination Platform for DAOs #

CoordiChain is a blockchain-based platform for collaborative task management in decentralized organizations (DAOs). It enables secure creation of task boards, member role assignments, and transparent task lifecycle tracking using Ethereum smart contracts and IPFS for metadata storage.

> **Decentralized Task Coordination Platform for DAOs**  
> Built with Solidity, IPFS, Ethers.js, React, and Hardhat

---
##  Motivation

Most to-do lists are centralized, private, and temporary. CoordiChain was designed to demonstrate how **decentralized task workflows** can be enabled for **DAOs**, ensuring transparency, immutability, and accountability.

---
##  Project Demo Video
 [Watch Demo Video on Google Drive](https://drive.google.com/file/d/1lTbM9A7jjbUJ4Iatk0vm91Xx4SNQEKpR/view?usp=sharing)



##  Project Structure

```bash
coordichain/
├── contracts/
│   └── CoordiChain.sol          # Smart contract for task board & role logic
├── scripts/
│   ├── deploy.js                # Hardhat script to deploy contract
│   └── uploadTaskPinata.js      # Upload task metadata to IPFS (Pinata)
│   └── testPinataAuth.js
├── test/
│   └── CoordiChain.js           # Test cases for smart contract
├── coordichain-frontend/
│   ├── public
│   │   ├── vite.svg
│   ├── src/
│   │   ├── abi/
│   │   │   └── CoordiChain.json # ABI after each compilation
│   │   │   └── CoordiChainABI.js
│   │   ├── components/
│   │   │   └── AddMemberForm.jsx
│   │   │   └── CreateBoard.jsx
│   │   │   └── Memberlist.jsx
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



4. **Deploy to Localhost**

```bash
npx hardhat node

```

---
##  MetaMask Setup for Local Development

To interact with the smart contract via your frontend and Hardhat local blockchain, follow these steps to connect MetaMask properly:

---

###  Add Localhost Network to MetaMask

1. Open **MetaMask**
2. Click on the  **"Networks" dropdown** at the top
3. Select  **"Add Network"**
4. Fill in the following details:

```
Network Name: Localhost 8545
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

5. Click **Save** to add the network.

---

###  Import Hardhat Test Accounts (Optional)

To simulate multiple user roles (e.g., Owner, Contributor, Reviewer):

- Run `npx hardhat node`
- Copy any private key shown in the terminal
- In MetaMask, go to **Account → Import Account**
- Paste the private key

>  This allows you to interact as different blockchain users in the task workflow.

---

###  Important Notes

- Make sure MetaMask is **always connected** to the correct account (e.g., Owner for board creation).
- Stay connected to the `Localhost 8545` network (`Chain ID 31337`).
- Refresh the browser after switching accounts to reflect the latest UI state.


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
> **Note:** For the best visual experience, ensure you use **dark mode** in your browser settings.


##  Workflow Instructions

###  Create Task Board

Follow these steps to create a new task board on the CoordiChain frontend:

---

### 🔹  Go to the Frontend Interface

Navigate to your frontend project directory:

```bash
cd coordichain-frontend

```
###   Run the Frontend
```bash
npm run dev
```
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
