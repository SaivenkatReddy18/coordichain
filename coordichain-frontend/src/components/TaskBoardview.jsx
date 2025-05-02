import { useEffect, useState } from "react";
import {
  getBoardTasks,
  getTask,
  claimTask,
  completeTask,
  approveTask,
} from "../services/blockchain";
import TaskCard from "./TaskCard";

function TaskBoardView({ boardId, currentUser }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const taskIds = await getBoardTasks(boardId);
      const taskDetails = await Promise.all(taskIds.map((id) => getTask(id)));
      setTasks(taskDetails);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const handleClaim = async (taskId) => {
    await claimTask(taskId);
    await loadTasks();
  };

  const handleComplete = async (taskId) => {
    const deliverableCID = prompt("Enter deliverable CID:");
    if (deliverableCID) {
      await completeTask(taskId, deliverableCID);
      await loadTasks();
    }
  };

  const handleApprove = async (taskId) => {
    await approveTask(taskId);
    await loadTasks();
  };

  useEffect(() => {
    if (boardId >= 0) {
      loadTasks();
    }
  }, [boardId]);

  return (
    <div style={containerStyle}>
      <h2>📋 Task Board View (Board #{boardId})</h2>
      {tasks.length === 0 && <p>No tasks found.</p>}
      {tasks.map((task, idx) => (
        <TaskCard
          key={idx}
          task={task}
          currentUser={currentUser}
          onClaim={handleClaim}
          onComplete={handleComplete}
          onApprove={handleApprove}
        />
      ))}
    </div>
  );
}

const containerStyle = {
  padding: "1.5rem",
  backgroundColor: "#222",
  borderRadius: "10px",
  color: "#fff",
};

export default TaskBoardView;
