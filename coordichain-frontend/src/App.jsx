import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi/CoordiChain.json";
import axios from "axios";
import TaskCard from "./components/TaskCard";
import { contractAddress } from "./constants";
import AddMemberForm from "./components/AddMemberForm";
import CreateBoard from "./components/CreateBoard";

function App() {
  // Wallet address of the connected user
  const [account, setAccount] = useState(null);

  // List of tasks fetched from the contract
  const [tasks, setTasks] = useState([]);

  // Filter state to control task visibility
  const [filter, setFilter] = useState("All");

  // Board ID for currently active task board
  const [currentBoardId, setCurrentBoardId] = useState(null);

  // Member list of the current board
  const [members, setMembers] = useState([]);

  // Mapping task statuses to readable labels
  const statusLabels = ["Open", "Claimed", "Completed", "Approved"];

  // Function to connect user's wallet using MetaMask
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        await fetchTasks(provider); // Fetch tasks once connected
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  // Fetch all tasks and their metadata from IPFS
  async function fetchTasks(provider) {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      const loadedTasks = [];
      const nextId = await contract.nextTaskId();

      // Iterate through all tasks up to nextTaskId
      for (let i = 0; i < nextId; i++) {
        const task = await contract.tasks(i);
        if (task.metadataCID && task.metadataCID !== "") {
          try {
            // Retrieve IPFS metadata using CID
            const metadataResponse = await axios.get(
              `https://gateway.pinata.cloud/ipfs/${task.metadataCID}`
            );
            const metadata = metadataResponse.data;

            // Store the structured task with its metadata
            loadedTasks.push({
              id: i,
              creator: task.creator,
              status: Number(task.status),
              statusText: statusLabels[Number(task.status)],
              title: metadata.title,
              description: metadata.description,
              metadataCID: task.metadataCID,
            });
          } catch (err) {
            console.warn(`Failed to load metadata for task ${i}:`, err);
          }
        }
      }

      setTasks(loadedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  // Fetch all members and their roles for a given board
  async function fetchMembers(boardId) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      const memberAddresses = await contract.getBoardMembers(boardId);

      // Get each member's role and label it
      const memberData = await Promise.all(
        memberAddresses.map(async (addr) => {
          const role = await contract.getBoardRole(boardId, addr);
          let roleLabel = "Unknown";
          if (role === 1n) roleLabel = "Creator";
          else if (role === 2n) roleLabel = "Contributor";
          else if (role === 3n) roleLabel = "Reviewer";
          return { address: addr, role: roleLabel };
        })
      );

      setMembers(memberData);
    } catch (err) {
      console.error("Failed to fetch members with roles:", err);
    }
  }

  // Fetch tasks again when wallet connects
  useEffect(() => {
    if (window.ethereum && account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      fetchTasks(provider);
    }
  }, [account]);

  // Fetch members whenever a new board is selected
  useEffect(() => {
    if (currentBoardId !== null) {
      fetchMembers(currentBoardId);
    }
  }, [currentBoardId]);

  // Called after a new member is added to refresh the member list
  const handleMemberAdded = () => {
    if (currentBoardId !== null) {
      fetchMembers(currentBoardId);
    }
  };

  // Claim a task (for contributors)
  async function claimTask(id) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      const tx = await contract.claimTask(id);
      await tx.wait();
      window.location.reload(); // Refresh UI after claiming
    } catch (err) {
      console.error("Failed to claim task:", err);
    }
  }

  // Complete a task (prompt for deliverable CID)
  async function completeTask(id) {
    try {
      const deliverableCID = prompt(
        "Enter Deliverable CID (uploaded file CID)"
      );
      if (!deliverableCID) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      const tx = await contract.completeTask(id, deliverableCID);
      await tx.wait();
      window.location.reload();
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  }

  // Approve a task (for reviewer or creator)
  async function approveTask(id) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      const tx = await contract.approveTask(id);
      await tx.wait();
      window.location.reload();
    } catch (err) {
      console.error("Failed to approve task:", err);
    }
  }

  // Apply filter to show only matching tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.statusText === filter;
  });

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>CoordiChain Dashboard</h1>

      {/* Wallet not connected */}
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          {/* Connected wallet address */}
          <p>
            <strong>Connected Wallet:</strong> {account}
          </p>

          {/* Task status filter buttons */}
          <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
            {["All", "Open", "Claimed", "Completed", "Approved"].map(
              (status) => (
                <button
                  key={status}
                  style={{
                    marginRight: "10px",
                    padding: "8px 12px",
                    border: "1px solid white",
                    backgroundColor: filter === status ? "#555" : "transparent",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* Render filtered tasks */}
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClaim={claimTask}
                onComplete={completeTask}
                onApprove={approveTask}
              />
            ))
          ) : (
            <p>No tasks to display.</p>
          )}

          {/* Create board section */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "#1e1e1e",
              borderRadius: "8px",
            }}
          >
            <CreateBoard onBoardCreated={setCurrentBoardId} />
          </div>

          {/* Add member to board */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "#222",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>👥 Add Member to Board</h2>
            <AddMemberForm
              defaultBoardId={currentBoardId}
              onMemberAdded={handleMemberAdded}
            />
          </div>

          {/* Display members of the board */}
          {members.length > 0 && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                backgroundColor: "#111",
                border: "1px solid #444",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>
                🧑‍🤝‍🧑 Members in Board ID {currentBoardId}
              </h3>
              <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                {members.map((m, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontFamily: "monospace",
                      color: "#ccc",
                      marginBottom: "4px",
                    }}
                  >
                    {m.address} — <strong>{m.role}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
