import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/CoordiChain.json";
import { contractAddress } from "../constants";

function AddMemberForm({ defaultBoardId = 0 }) {
  const [boardId, setBoardId] = useState(defaultBoardId);
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState("2");

  const addMember = async () => {
    try {
      const rawAddress = walletAddress.trim();

      if (!rawAddress) {
        alert("⚠️ Please enter a wallet address.");
        return;
      }

      if (!ethers.isAddress(rawAddress)) {
        alert("❌ Invalid Ethereum address format.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      const checksummedAddress = ethers.getAddress(rawAddress); // auto-checksum
      const tx = await contract.addMember(Number(boardId), checksummedAddress, Number(role));
      await tx.wait();

      alert("✅ Member added successfully!");
      setWalletAddress(""); // Clear input after success
    } catch (err) {
      console.error("❌ Error adding member:", err);
      alert("Failed to add member. Check console.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMember();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Add Member to Board</h2>

      <input
        type="number"
        placeholder="Board ID"
        value={boardId}
        onChange={(e) => setBoardId(Number(e.target.value))}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="2">Contributor</option>
        <option value="3">Reviewer</option>
      </select>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Add Member
      </button>
    </form>
  );
}

export default AddMemberForm;
