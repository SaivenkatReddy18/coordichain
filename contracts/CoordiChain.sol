// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// CoordiChain is a decentralized task management system with role-based access
contract CoordiChain {
    // Enum to represent different stages of a task
    enum TaskStatus { Open, Claimed, Completed, Approved }

    // Enum to represent user roles within a task board
    enum Role { None, Creator, Contributor, Reviewer }

    // Structure representing a task
    struct Task {
        uint id;                   // Unique task ID
        address creator;          // Address of the task creator
        address assignee;         // Address of the contributor assigned to the task
        TaskStatus status;        // Current status of the task
        string metadataCID;       // CID for task metadata stored on IPFS
        string deliverableCID;    // CID for completed task deliverables on IPFS
        uint boardId;             // ID of the board this task belongs to
    }

    // Structure representing a task board
    struct TaskBoard {
        address owner;                 // Board owner address
        address[] members;            // List of member addresses
        uint[] taskIds;               // List of task IDs in the board
        mapping(address => Role) roles; // Mapping of address to its role
    }

    // Task and board ID counters
    uint public nextTaskId;
    uint public nextBoardId;

    // Mappings for task and board data
    mapping(uint => Task) public tasks;
    mapping(uint => TaskBoard) private taskBoards;

    // Event declarations
    event TaskBoardCreated(uint id, address owner);
    event MemberAdded(uint boardId, address member);
    event TaskCreated(uint id, address creator, string cid, uint boardId);
    event TaskClaimed(uint id, address assignee);
    event TaskCompleted(uint id, string cid);
    event TaskApproved(uint id);

    // === Public View Functions ===

    // Returns the owner of a board
    function getBoardOwner(uint boardId) external view returns (address) {
        return taskBoards[boardId].owner;
    }

    // Returns all members of a board
    function getBoardMembers(uint boardId) external view returns (address[] memory) {
        return taskBoards[boardId].members;
    }

    // Returns all task IDs belonging to a board
    function getBoardTasks(uint boardId) external view returns (uint[] memory) {
        return taskBoards[boardId].taskIds;
    }

    // Returns the role of a user in a board
    function getBoardRole(uint boardId, address user) external view returns (Role) {
        return taskBoards[boardId].roles[user];
    }

    // Alternative member getter for external access (duplicate for clarity)
    function getMembers(uint boardId) public view returns (address[] memory) {
        return taskBoards[boardId].members;
    }

    // === Task Board Management ===

    // Create a new task board and assign the sender as Creator
    function createTaskBoard() external returns (uint) {
        uint boardId = nextBoardId++;
        TaskBoard storage board = taskBoards[boardId];
        board.owner = msg.sender;
        board.members.push(msg.sender);
        board.roles[msg.sender] = Role.Creator;
        emit TaskBoardCreated(boardId, msg.sender);
        return boardId;
    }

    // Add a new member with a specific role to a task board (only owner can do this)
    function addMember(uint boardId, address member, Role role) external {
        TaskBoard storage board = taskBoards[boardId];
        require(msg.sender == board.owner, "Only owner can add members");
        board.members.push(member);
        board.roles[member] = role;
        emit MemberAdded(boardId, member);
    }

    // Check if a user is a member of the specified board
    function isMember(uint boardId, address user) public view returns (bool) {
        TaskBoard storage board = taskBoards[boardId];
        for (uint i = 0; i < board.members.length; i++) {
            if (board.members[i] == user) return true;
        }
        return false;
    }

    // === Task Management ===

    // Create a new task on the board (only Creator or Contributor can do this)
    function createTask(uint boardId, string memory metadataCID) external {
        TaskBoard storage board = taskBoards[boardId];
        require(
            board.roles[msg.sender] == Role.Creator || board.roles[msg.sender] == Role.Contributor,
            "Not authorized to create tasks"
        );

        uint taskId = nextTaskId++;
        tasks[taskId] = Task({
            id: taskId,
            creator: msg.sender,
            assignee: address(0),
            status: TaskStatus.Open,
            metadataCID: metadataCID,
            deliverableCID: "",
            boardId: boardId
        });

        board.taskIds.push(taskId);
        emit TaskCreated(taskId, msg.sender, metadataCID, boardId);
    }

    // Claim an open task (only Contributors can claim)
    function claimTask(uint taskId) external {
        Task storage task = tasks[taskId];
        TaskBoard storage board = taskBoards[task.boardId];
        require(board.roles[msg.sender] == Role.Contributor, "Only contributors can claim");
        require(task.status == TaskStatus.Open, "Task not open");
        task.assignee = msg.sender;
        task.status = TaskStatus.Claimed;
        emit TaskClaimed(taskId, msg.sender);
    }

    // Complete a claimed task with deliverable CID (only assignee can complete)
    function completeTask(uint taskId, string memory deliverableCID) external {
        Task storage task = tasks[taskId];
        TaskBoard storage board = taskBoards[task.boardId];
        require(board.roles[msg.sender] == Role.Contributor, "Only contributors can complete");
        require(task.assignee == msg.sender, "Only assignee can complete");
        require(task.status == TaskStatus.Claimed, "Task not claimed");
        task.deliverableCID = deliverableCID;
        task.status = TaskStatus.Completed;
        emit TaskCompleted(taskId, deliverableCID);
    }

    // Approve a completed task (only reviewers or the original creator can approve)
    function approveTask(uint taskId) external {
        Task storage task = tasks[taskId];
        TaskBoard storage board = taskBoards[task.boardId];
        require(
            board.roles[msg.sender] == Role.Reviewer || msg.sender == task.creator,
            "Only reviewers or creator can approve"
        );
        require(task.status == TaskStatus.Completed, "Task not completed");
        task.status = TaskStatus.Approved;
        emit TaskApproved(taskId);
    }
}
