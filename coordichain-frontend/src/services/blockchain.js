import { ethers } from "ethers";
import { contractABI } from "../abi/CoordiChainABI";
import { contractAddress } from "../constants";

// Utility function to get an instance of the deployed CoordiChain smart contract
export async function getContract() {
  // Check if MetaMask (or another Ethereum provider) is available in the browser
  if (!window.ethereum) throw new Error("MetaMask not found");

  // Create a provider using the browser's Ethereum provider (e.g., MetaMask)
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Get the currently connected wallet's signer (to sign transactions)
  const signer = await provider.getSigner();

  // Create and return a contract instance connected with the signer
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return contract;
}
