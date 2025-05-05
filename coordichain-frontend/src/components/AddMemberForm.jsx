import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/CoordiChain.json";
import { contractAddress } from "../constants";

// Component to add a new member (Contributor or Reviewer) to a specific task board
function AddMemberForm({ defaultBoardId = 0, onMemberAdded = () => {} }) {
  // State to track the current board ID
  const [boardId, setBoardId] = useState(defaultBoardId);

  // State to track wallet address input by the user
  const [walletAddress, setWalletAddress] = useState("");

  // State to track selected role (2 = Contributor, 3 = Reviewer)
  const [role, setRole] = useState("2");

  // Sync board ID with defaultBoardId from parent component (if it changes)
  useEffect(() => {
    setBoardId(defaultBoardId);
  }, [defaultBoardId]);

  // Function to add a new member to the smart contract
  const addMember = async () => {
    try {
      const rawAddress = walletAddress.trim();

      // Check for empty wallet address
      if (!rawAddress) {
        alert("⚠️ Please enter a wallet address.");
        return;
      }

      // Validate Ethereum address format
      if (!ethers.isAddress(rawAddress)) {
        alert("❌ Invalid Ethereum address format.");
        return;
      }

      // Connect to wallet provider (e.g., MetaMask)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Initialize contract instance
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      // Normalize address to checksum format
      const checksummedAddress = ethers.getAddress(rawAddress);

      // Call smart contract method to add the member
      const tx = await contract.addMember(
        Number(boardId),
        checksummedAddress,
        Number(role)
      );
      await tx.wait(); // Wait for transaction confirmation

      alert("✅ Member added successfully!");
      setWalletAddress(""); // Reset wallet address field
      onMemberAdded(); // Notify parent component to update member list
    } catch (err) {
      console.error("❌ Error adding member:", err);
      alert("Failed to add member. Check console.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form refresh
    await addMember(); // Call member addition logic
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow rounded space-y-4"
    >
      <h2 className="text-xl font-bold">Add Member to Board</h2>

      {/* Input field for board ID */}
      <input
        type="number"
        placeholder="Board ID"
        value={boardId}
        onChange={(e) => setBoardId(Number(e.target.value))}
        className="w-full p-2 border rounded text-black"
      />

      {/* Input field for wallet address */}
      <input
        type="text"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full p-2 border rounded text-black"
      />

      {/* Dropdown to select role */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded text-black"
      >
        <option value="2">Contributor</option>
        <option value="3">Reviewer</option>
      </select>

      {/* Submit button */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Member
      </button>
    </form>
  );
}

export default AddMemberForm;
