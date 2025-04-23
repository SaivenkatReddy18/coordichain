# CoordiChain

CoordiChain is a decentralized task coordination platform built for DAOs. It uses Ethereum smart contracts to manage task lifecycles in a trustless, transparent way. All task-related data (description, deliverables, status) is either on-chain or referenced via IPFS for scalability and immutability.

---

##  Project Goals

- Enable decentralized teams or DAOs to assign, claim, complete, and approve tasks
- Use Ethereum smart contracts to securely track task states and ownership
- Leverage IPFS to store task metadata and deliverables off-chain

---

##  Week 1 Progress

- Created CoordiChain smart contract (`CoordiChain.sol`)
- Implemented task lifecycle: `createTask`, `claimTask`, `completeTask`, `approveTask`
- Enforced access control (only creators and assignees can perform specific actions)
- Added events for task tracking: `TaskCreated`, `TaskClaimed`, `TaskCompleted`, `TaskApproved`
- Wrote test cases using Mocha + Chai (`test/CoordiChain.js`)
- Verified deployment via `scripts/deploy.js` using Hardhat
- Resolved all local and remote GitHub conflicts and committed clean history

---

##  Tech Stack

- **Smart Contracts**: Solidity
- **Framework**: Hardhat
- **Testing**: Mocha + Chai
- **Deployment**: Hardhat (local, Sepolia-ready)
- **Frontend & IPFS integration** – coming in Week 2!

---

## 🛠️ How to Use

### 1. Clone the Repo

```bash
git clone https://github.com/SaivenkatReddy18/coordichain.git
cd coordichain
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contract

```bash
npx hardhat compile
```

### 4. Run Tests

```bash
npx hardhat test
```

### 5. Deploy to Local Network

```bash
npx hardhat run scripts/deploy.js
```

---

##  Project Structure

```
coordichain/
├── contracts/           # Solidity contract
│   └── CoordiChain.sol
├── scripts/             # Deployment scripts
│   └── deploy.js
├── test/                # Unit tests
│   └── CoordiChain.js
├── hardhat.config.js    # Hardhat config
├── package.json         # Dependencies
├── README.md            # You're reading it
```

---

##  Authors

- Seri Sai Venkat Reddy – [SAI.VENKAT.REDDY.SERI-1@ou.edu](mailto:SAI.VENKAT.REDDY.SERI-1@ou.edu)
- Vijay Chirram – [VIJAY.CHIRRAM-1@ou.edu](mailto:VIJAY.CHIRRAM-1@ou.edu)

---

##  License

MIT License. Feel free to fork and build upon for DAO tools and decentralized coordination platforms.
