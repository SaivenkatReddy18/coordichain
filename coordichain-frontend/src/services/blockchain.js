import { ethers } from "ethers";
import { contractABI } from "../abi/CoordiChainABI";
import { contractAddress } from "../constants";

export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return contract;
}
