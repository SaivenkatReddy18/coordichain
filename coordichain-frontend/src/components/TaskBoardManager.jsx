import { useState, useEffect } from "react";
import {
  createTaskBoard,
  addMember,
  getBoardMembers,
  createTask,
} from "../services/blockchain";

export default function TaskBoardManager() {
  // --- existing state
  const [boardName, setBoardName] = useState("");
  const [boardId, setBoardId] = useState(0);
  const [memberAddress, setMemberAddress] = useState("");
  const [members, setMembers] = useState([]);

  // --- new state for real task creation
  const [taskBoardId, setTaskBoardId] = useState(0);
  const [taskCID, setTaskCID] = useState("");

  // Fetch members whenever `boardId` changes
  useEffect(() => {
    fetchMembers();
  }, [boardId]);

  async function fetchMembers() {
    try {
      const result = await getBoardMembers(boardId);
      setMembers(result);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  }

  async function handleCreateBoard() {
    try {
      await createTaskBoard(boardName);
      alert("Board created! (ID = 0 initially)");
      setBoardName("");
      // optionally you could increment boardId here
    } catch (err) {
      console.error(err);
      alert("Error creating board");
    }
  }

  async function handleAddMember() {
    try {
      await addMember(boardId, memberAddress);
      alert("Member added!");
      setMemberAddress("");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Error adding member");
    }
  }

  async function handleCreateTask() {
    try {
      await createTask(taskBoardId, taskCID);
      alert("Task created!");
      setTaskCID("");
      // if you also want to reload your TaskBoardView,
      // you can emit an event or lift state up.
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    }
  }

  return (
    <div style={containerStyle}>
      <h2>🧱 Task Board Manager</h2>

      {/* --- Create Board */}
      <input
        type="text"
        placeholder="Board Name"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleCreateBoard} style={btnStyle}>
        Create Board
      </button>

      <hr />

      {/* --- Add Member */}
      <input
        type="number"
        placeholder="Board ID"
        value={boardId}
        onChange={(e) => setBoardId(Number(e.target.value))}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Member Address"
        value={memberAddress}
        onChange={(e) => setMemberAddress(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleAddMember} style={btnStyle}>
        Add Member
      </button>

      <h3>Members of Board #{boardId}</h3>
      <ul style={{ paddingLeft: "1rem" }}>
        {members.map((addr, idx) => (
          <li key={idx}>{addr}</li>
        ))}
      </ul>

      <hr />

      {/* --- Create Task */}
      <h3>➕ Create New Task</h3>
      <input
        type="number"
        placeholder="Board ID"
        value={taskBoardId}
        onChange={(e) => setTaskBoardId(Number(e.target.value))}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Metadata CID or Description"
        value={taskCID}
        onChange={(e) => setTaskCID(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleCreateTask} style={btnStyle}>
        Create Task
      </button>
    </div>
  );
}

const containerStyle = {
  padding: "1.5rem",
  backgroundColor: "#1e1e1e",
  borderRadius: "10px",
  color: "#fff",
  marginBottom: "2rem",
};

const inputStyle = {
  display: "block",
  padding: "10px",
  margin: "10px 0",
  width: "100%",
  maxWidth: "400px",
  borderRadius: "5px",
  border: "1px solid #aaa",
};

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "deepskyblue",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "1rem",
};
