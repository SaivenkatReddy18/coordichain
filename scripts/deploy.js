const hre = require("hardhat");

async function main() {
  const [account1, account2] = await hre.ethers.getSigners(); // Get both accounts

  const CoordiChain = await hre.ethers.getContractFactory("CoordiChain", account1); // deploy using Account 1
  const contract = await CoordiChain.deploy();
  await contract.waitForDeployment();

  console.log("✅ Deployed at:", await contract.getAddress());
  console.log("👤 Deployed by (owner):", await account1.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
