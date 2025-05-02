const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoordiChain DAO Task System", function () {
  let CoordiChain, contract, owner, addr1, addr2;

  beforeEach(async () => {
    CoordiChain = await ethers.getContractFactory("CoordiChain");
    [owner, addr1, addr2] = await ethers.getSigners();
    contract = await CoordiChain.deploy();
    await contract.waitForDeployment();
  });

  it("should create a task board", async () => {
    const tx = await contract.connect(owner).createTaskBoard("Core Team");
    await tx.wait();
    const board = await contract.taskBoards(0);
    expect(board.name).to.equal("Core Team");
    expect(board.owner).to.equal(owner.address);
  });

  it("should add a member to a task board", async () => {
    await contract.connect(owner).createTaskBoard("Core Team");
    const tx = await contract.connect(owner).addMember(0, addr1.address);
    await tx.wait();
    const members = await contract.getBoardMembers(0);
    expect(members).to.include(addr1.address);
  });

  it("should allow board member to create a task", async () => {
    await contract.connect(owner).createTaskBoard("Core Team");
    await contract.connect(owner).addMember(0, addr1.address);

    const tx = await contract.connect(addr1).createTask(0, "ipfs://taskCID");
    await tx.wait();

    const task = await contract.tasks(0);
    expect(task.creator).to.equal(addr1.address);
    expect(task.metadataCID).to.equal("ipfs://taskCID");
    expect(task.status).to.equal(0); // Open
  });

  it("should allow assignee to claim and complete a task", async () => {
    await contract.connect(owner).createTaskBoard("Core Team");
    await contract.connect(owner).addMember(0, addr1.address);

    await contract.connect(addr1).createTask(0, "ipfs://taskCID");
    await contract.connect(addr2).claimTask(0);
    await contract.connect(addr2).completeTask(0, "ipfs://proofCID");

    const task = await contract.tasks(0);
    expect(task.assignee).to.equal(addr2.address);
    expect(task.deliverableCID).to.equal("ipfs://proofCID");
    expect(task.status).to.equal(2); // Completed
  });

  it("should allow creator to approve the task", async () => {
    await contract.connect(owner).createTaskBoard("Core Team");
    await contract.connect(owner).addMember(0, addr1.address);

    await contract.connect(addr1).createTask(0, "ipfs://taskCID");
    await contract.connect(addr2).claimTask(0);
    await contract.connect(addr2).completeTask(0, "ipfs://proofCID");
    await contract.connect(addr1).approveTask(0);

    const task = await contract.tasks(0);
    expect(task.status).to.equal(3); // Approved
  });

  it("should reject task creation by non-board member", async () => {
    await contract.connect(owner).createTaskBoard("Core Team");

    await expect(
      contract.connect(addr1).createTask(0, "ipfs://failCID")
    ).to.be.revertedWith("Not a board member");
  });

  it("should reject task approval by non-creator", async () => {
    await contract.connect(owner).createTaskBoard("Core Team");
    await contract.connect(owner).addMember(0, addr1.address);

    await contract.connect(addr1).createTask(0, "ipfs://taskCID");
    await contract.connect(addr2).claimTask(0);
    await contract.connect(addr2).completeTask(0, "ipfs://proofCID");

    await expect(contract.connect(addr2).approveTask(0)).to.be.revertedWith(
      "Only creator can approve"
    );
  });
});
