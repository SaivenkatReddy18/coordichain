// Component to display an individual task card with details and relevant action buttons
function TaskCard({ task, onClaim, onComplete, onApprove }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1.5rem",
        borderRadius: "10px",
        marginBottom: "1rem",
        backgroundColor: "#111", // Dark background for contrast
      }}
    >
      {/* Display task title */}
      <h2>{task.title}</h2>
      {/* Display task status */}
      <p>
        <strong>Status:</strong> {task.statusText}
      </p>
      {/* Display task description */}
      <p>
        <strong>Description:</strong> {task.description}
      </p>
      {/* Show creator's address */}
      <p>
        <strong>Creator:</strong> {task.creator}
      </p>
      {/* Display metadata CID (e.g., IPFS hash) */}
      <p>
        <strong>CID:</strong> {task.metadataCID}
      </p>{" "}
      {/* ✅ Displaying content identifier */}
      {/* Action buttons depending on current task status */}
      {task.statusText === "Open" && (
        <button onClick={() => onClaim(task.id)} style={btnStyle}>
          Claim Task
        </button>
      )}
      {task.statusText === "Claimed" && (
        <button onClick={() => onComplete(task.id)} style={btnStyle}>
          Complete Task
        </button>
      )}
      {task.statusText === "Completed" && (
        <button onClick={() => onApprove(task.id)} style={btnStyle}>
          Approve Task
        </button>
      )}
    </div>
  );
}

// Styling object for buttons
const btnStyle = {
  padding: "10px 16px",
  backgroundColor: "mediumseagreen",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
};

export default TaskCard;
