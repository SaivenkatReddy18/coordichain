const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const CoordiChain = await hre.ethers.getContractFactory("CoordiChain");
  const contract = await CoordiChain.deploy();
  await contract.waitForDeployment();

  console.log("✅ CoordiChain deployed to:", contract.target);

  // Automatically create a default task board
  const tx = await contract.createTaskBoard("Core DAO Team");
  await tx.wait();
  console.log("✅ Default task board 'Core DAO Team' created");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
