import React from "react";
import { ethers } from "ethers";
import contractABI from "../abi/CoordiChain.json";
import { contractAddress } from "../constants";

function CreateBoard({ onBoardCreated }) {
  const createBoard = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      const tx = await contract.createTaskBoard();
      const receipt = await tx.wait();

      const boardId = Number(receipt.logs[0].args[0]);
      alert(`✅ Board created with ID: ${boardId}`);

      if (onBoardCreated) {
        onBoardCreated(boardId); // 🔁 Pass board ID to parent
      }
    } catch (err) {
      console.error("❌ Failed to create board:", err);
      alert("Failed to create board. Check console for details.");
    }
  };

  return (
    <div className="mb-4">
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
