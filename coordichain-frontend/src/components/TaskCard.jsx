function TaskCard({ task, onClaim, onComplete, onApprove }) {
    return (
      <div style={{
        border: '1px solid #ccc',
        padding: '1.5rem',
        borderRadius: '10px',
        marginBottom: '1rem',
        backgroundColor: '#111'
      }}>
        <h2>{task.title}</h2>
        <p><strong>Status:</strong> {task.statusText}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Creator:</strong> {task.creator}</p>
        <p><strong>CID:</strong> {task.metadataCID}</p> {/* ✅ Added here */}
  
        {task.statusText === "Open" && (
          <button onClick={() => onClaim(task.id)} style={btnStyle}>Claim Task</button>
        )}
        {task.statusText === "Claimed" && (
          <button onClick={() => onComplete(task.id)} style={btnStyle}>Complete Task</button>
        )}
        {task.statusText === "Completed" && (
          <button onClick={() => onApprove(task.id)} style={btnStyle}>Approve Task</button>
        )}
      </div>
    );
  }
  
  const btnStyle = {
    padding: "10px 16px",
    backgroundColor: "mediumseagreen",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  };
  
  export default TaskCard;
  