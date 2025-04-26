require("dotenv").config();
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

pinata.testAuthentication().then((result) => {
  console.log("✅ Auth success:", result);
}).catch((err) => {
  console.error("❌ Auth failed:", err);
});
