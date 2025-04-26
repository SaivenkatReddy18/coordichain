import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi/CoordiChain.json";
import axios from "axios";
import TaskCard from "./components/TaskCard";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  const statusLabels = ["Open", "Claimed", "Completed", "Approved"];

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        await fetchTasks(provider);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function fetchTasks(provider) {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);

      const loadedTasks = [];
      const nextId = await contract.nextTaskId();
      for (let i = 0; i < nextId; i++) {
        const task = await contract.tasks(i);
        if (task.metadataCID && task.metadataCID !== "") {
          const metadataResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${task.metadataCID}`);
          const metadata = metadataResponse.data;
          loadedTasks.push({
            id: i,
            creator: task.creator,
            status: Number(task.status),
            statusText: statusLabels[Number(task.status)],
            title: metadata.title,
            description: metadata.description,
            metadataCID: task.metadataCID,
          });
        }
      }

      setTasks(loadedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  async function claimTask(id) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      const tx = await contract.claimTask(id);
      await tx.wait();
      window.location.reload();
    } catch (err) {
      console.error("Failed to claim task:", err);
    }
  }

  async function completeTask(id) {
    try {
      const deliverableCID = prompt("Enter Deliverable CID (uploaded file CID)");
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

  const filteredTasks = tasks.filter(task => {
    if (filter === "All") return true;
    return task.statusText === filter;
  });

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h1>CoordiChain Dashboard</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Connected Wallet:</strong> {account}</p>

          <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
            {["All", "Open", "Claimed", "Completed", "Approved"].map((status) => (
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
            ))}
          </div>

          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClaim={claimTask}
                onComplete={completeTask}
                onApprove={approveTask}
              >
                <p><strong>CID:</strong> {task.metadataCID}</p>
              </TaskCard>
            ))
          ) : (
            <p>No tasks to display.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
