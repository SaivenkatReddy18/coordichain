require("dotenv").config();
const pinataSDK = require("@pinata/sdk");

// ✅ Use API key + secret
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

const task = {
  title: "Implement smart contract voting",
  description: "Solidity contract to allow DAO proposal votes",
  createdAt: new Date().toISOString(),
  deadline: "2025-05-10"
};

async function uploadJSON() {
  try {
    const result = await pinata.pinJSONToIPFS(task);
    console.log("✅ Uploaded to IPFS via Pinata:");
    console.log("CID:", result.IpfsHash);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

uploadJSON();
