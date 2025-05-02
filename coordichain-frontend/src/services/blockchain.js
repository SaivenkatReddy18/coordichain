import { ethers } from "ethers";
import { contractABI } from "../abi/CoordiChainABI";
import { contractAddress } from "../constants";

export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
}

// Task Board Functions

export async function createTaskBoard(name) {
  const contract = await getContract();
  const tx = await contract.createTaskBoard(name);
  await tx.wait();
}

export async function addMember(boardId, memberAddress) {
  const contract = await getContract();
  const tx = await contract.addMember(boardId, memberAddress);
  await tx.wait();
}

export async function getBoardTasks(boardId) {
  const contract = await getContract();
  return await contract.getBoardTasks(boardId);
}

export async function getBoardMembers(boardId) {
  const contract = await getContract();
  return await contract.getBoardMembers(boardId);
}

// Task Functions

export async function createTask(boardId, metadataCID) {
  const contract = await getContract();
  const tx = await contract.createTask(boardId, metadataCID);
  await tx.wait();
}

export async function claimTask(taskId) {
  const contract = await getContract();
  const tx = await contract.claimTask(taskId);
  await tx.wait();
}

export async function completeTask(taskId, deliverableCID) {
  const contract = await getContract();
  const tx = await contract.completeTask(taskId, deliverableCID);
  await tx.wait();
}

export async function approveTask(taskId) {
  const contract = await getContract();
  const tx = await contract.approveTask(taskId);
  await tx.wait();
}

export async function getTask(taskId) {
  const contract = await getContract();
  return await contract.tasks(taskId);
}
