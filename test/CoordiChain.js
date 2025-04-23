const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoordiChain", function () {
  let CoordiChain, contract, owner, addr1, addr2;

  beforeEach(async () => {
    CoordiChain = await ethers.getContractFactory("CoordiChain");
    [owner, addr1, addr2] = await ethers.getSigners();
    contract = await CoordiChain.deploy();
    await contract.waitForDeployment(); // ✅ Use this in latest Hardhat
  });

  it("should create a task", async () => {
    const tx = await contract.connect(owner).createTask("ipfs://taskCID");
    await tx.wait();
    const task = await contract.tasks(0);
    expect(task.creator).to.equal(owner.address);
    expect(task.metadataCID).to.equal("ipfs://taskCID");
    expect(task.status).to.equal(0); // Open
  });

  it("should allow someone to claim a task", async () => {
    await contract.connect(owner).createTask("ipfs://taskCID");
    const tx = await contract.connect(addr1).claimTask(0);
    await tx.wait();
    const task = await contract.tasks(0);
    expect(task.assignee).to.equal(addr1.address);
    expect(task.status).to.equal(1); // Claimed
  });

  it("should allow only assignee to complete the task", async () => {
    await contract.connect(owner).createTask("ipfs://taskCID");
    await contract.connect(addr1).claimTask(0);
    const tx = await contract.connect(addr1).completeTask(0, "ipfs://proofCID");
    await tx.wait();
    const task = await contract.tasks(0);
    expect(task.deliverableCID).to.equal("ipfs://proofCID");
    expect(task.status).to.equal(2); // Completed
  });

  it("should allow only creator to approve the task", async () => {
    await contract.connect(owner).createTask("ipfs://taskCID");
    await contract.connect(addr1).claimTask(0);
    await contract.connect(addr1).completeTask(0, "ipfs://proofCID");
    const tx = await contract.connect(owner).approveTask(0);
    await tx.wait();
    const task = await contract.tasks(0);
    expect(task.status).to.equal(3); // Approved
  });

  it("should prevent others from approving", async () => {
    await contract.connect(owner).createTask("ipfs://taskCID");
    await contract.connect(addr1).claimTask(0);
    await contract.connect(addr1).completeTask(0, "ipfs://proofCID");
    await expect(contract.connect(addr1).approveTask(0)).to.be.revertedWith("Only creator can approve");
  });
});
