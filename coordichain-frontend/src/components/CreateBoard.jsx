import React from "react";
import { ethers } from "ethers";
import contractABI from "../abi/CoordiChain.json";
import { contractAddress } from "../constants";

// Component to create a new task board on the blockchain
function CreateBoard({ onBoardCreated }) {
  // Function to initiate board creation via smart contract
  const createBoard = async () => {
    try {
      // Connect to the user's Ethereum wallet (e.g., MetaMask)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create an instance of the smart contract using signer
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      // Call the createTaskBoard() method from the contract
      const tx = await contract.createTaskBoard();
      const receipt = await tx.wait(); // Wait for transaction confirmation

      // Extract board ID from the emitted event log
      const boardId = Number(receipt.logs[0].args[0]);

      // Display the new board ID to the user
      alert(`✅ Board created with ID: ${boardId}`);

      // Notify the parent component with the new board ID (if handler exists)
      if (onBoardCreated) {
        onBoardCreated(boardId);
      }
    } catch (err) {
      // Catch and display any errors during the board creation process
      console.error("❌ Failed to create board:", err);
      alert("Failed to create board. Check console for details.");
    }
  };

  return (
    <div className="mb-4">
      {/* Button to trigger board creation */}
      <button
        onClick={createBoard}
        className="px-4 py-2 bg-green-600 text-white rounded shadow"
      >
        Create Task Board
      </button>
    </div>
  );
}

export default CreateBoard;
