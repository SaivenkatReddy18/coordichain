
# CoordiChain

CoordiChain is a decentralized task coordination platform built for DAOs. It empowers decentralized teams to assign, claim, complete, and approve tasks using Ethereum smart contracts and IPFS.

---

##  Motivation

Most to-do lists are centralized, private, and temporary. CoordiChain was designed to demonstrate how **decentralized task workflows** can be enabled for **DAOs**, ensuring transparency, immutability, and accountability.

---

##  Tech Stack

- **Smart Contracts:** Solidity
- **Blockchain Dev Framework:** Hardhat
- **Storage:** IPFS via Pinata
- **Testing:** Mocha, Chai
- **Language:** JavaScript (Node.js)
- **Network:** Hardhat local network

---

##  Project Structure

```
coordichain/
├── contracts/
│   └── CoordiChain.sol
├── scripts/
│   └── deploy.js
│   └── uploadTaskPinata.js
├── test/
│   └── CoordiChain.js
├── .env
├── .gitignore
├── hardhat.config.js
├── package.json
├── README.md
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
npx hardhat run scripts/deploy.js --network localhost
```

---

##  Week 1 Progress

- Designed and implemented CoordiChain smart contract
- Task lifecycle: `createTask`, `claimTask`, `completeTask`, `approveTask`
- Access control (creator, assignee restrictions)
- Event emitters for tracking task status
- Unit tests written and passing (Mocha + Chai)
- Local deployment tested via Hardhat

---

##  Week 2 Progress

- Integrated Pinata SDK to upload task metadata to IPFS
- CID retrieved and stored on-chain via `createTask(cid)`
- Used dotenv to secure API keys
- Verified on-chain task retrieval using `tasks(0)`

```js
[
  0n,
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x0000000000000000000000000000000000000000',
  0n,
  'QmcxHbafZVXEJRLegJEa3bg8MjBGUxd1d3UeKgTQmfiJiA',
  ''
]
```

You can view the task metadata here:  
https://gateway.pinata.cloud/ipfs/QmcxHbafZVXEJRLegJEa3bg8MjBGUxd1d3UeKgTQmfiJiA

---

##  Authors

- Seri Sai Venkat Reddy – SAI.VENKAT.REDDY.SERI-1@ou.edu
- Vijay Chirram – VIJAY.CHIRRAM-1@ou.edu

---

##  License

This project is licensed under the MIT License. You are free to fork, remix, and build on CoordiChain.
