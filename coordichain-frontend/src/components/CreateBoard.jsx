import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/CoordiChain.json";
import { contractAddress } from "../constants";

function CreateBoard({ onBoardCreated }) {
  const [boardId, setBoardId] = useState(null);
  const [loading, setLoading] = useState(false);

  const createBoard = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      const tx = await contract.createTaskBoard();
      const receipt = await tx.wait();
      const newBoardId = Number(receipt.logs[0].args[0]);

      setBoardId(newBoardId);
      onBoardCreated && onBoardCreated(newBoardId);
    } catch (err) {
      console.error("Failed to create board:", err);
      alert("❌ Error creating board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem", backgroundColor: "#222", padding: "1rem", borderRadius: "8px" }}>
      <h2>Create New Task Board</h2>
      <button onClick={createBoard} disabled={loading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? "Creating..." : "Create Task Board"}
      </button>
      {boardId !== null && (
        <p style={{ marginTop: "1rem", color: "#4ade80" }}>
          ✅ Board created successfully! ID: <strong>{boardId}</strong>
        </p>
      )}
    </div>
  );
}

export default CreateBoard;
