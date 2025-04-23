const hre = require("hardhat");

async function main() {
  const CoordiChain = await hre.ethers.getContractFactory("CoordiChain");
  const contract = await CoordiChain.deploy();
  await contract.waitForDeployment(); // ✅ Modern Hardhat uses this

  console.log("CoordiChain deployed to:", contract.target); // use `target` for address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
