function TaskCard({ task, currentUser, onClaim, onComplete, onApprove }) {
  const statusMap = ["Open", "Claimed", "Completed", "Approved"];

  return (
    <div style={cardStyle}>
      <h2>Task #{task.id}</h2>
      <p>
        <strong>Status:</strong> {statusMap[task.status]}
      </p>
      <p>
        <strong>Metadata CID:</strong> {task.metadataCID}
      </p>
      <p>
        <strong>Deliverable CID:</strong> {task.deliverableCID || "—"}
      </p>
      <p>
        <strong>Creator:</strong> {shortenAddress(task.creator)}
      </p>
      <p>
        <strong>Assignee:</strong>{" "}
        {task.assignee === "0x0000000000000000000000000000000000000000"
          ? "—"
          : shortenAddress(task.assignee)}
      </p>

      {task.status === 0 && (
        <button onClick={() => onClaim(task.id)} style={btnStyle}>
          Claim Task
        </button>
      )}

      {task.status === 1 && currentUser === task.assignee && (
        <button onClick={() => onComplete(task.id)} style={btnStyle}>
          Complete Task
        </button>
      )}

      {task.status === 2 && currentUser === task.creator && (
        <button onClick={() => onApprove(task.id)} style={btnStyle}>
          Approve Task
        </button>
      )}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "1.5rem",
  borderRadius: "10px",
  marginBottom: "1rem",
  backgroundColor: "#111",
  color: "#fff",
};

const btnStyle = {
  padding: "10px 16px",
  backgroundColor: "mediumseagreen",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
};

function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "—";
}

export default TaskCard;
