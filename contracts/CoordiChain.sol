// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CoordiChain {
    enum TaskStatus { Open, Claimed, Completed, Approved }
    enum Role { None, Creator, Contributor, Reviewer }

    struct Task {
        uint id;
        address creator;
        address assignee;
        TaskStatus status;
        string metadataCID;
        string deliverableCID;
        uint boardId;
    }

    struct TaskBoard {
        address owner;
        address[] members;
        uint[] taskIds;
        mapping(address => Role) roles;
    }

    uint public nextTaskId;
    uint public nextBoardId;

    mapping(uint => Task) public tasks;
    mapping(uint => TaskBoard) private taskBoards;

    event TaskBoardCreated(uint id, address owner);
    event MemberAdded(uint boardId, address member);
    event TaskCreated(uint id, address creator, string cid, uint boardId);
    event TaskClaimed(uint id, address assignee);
    event TaskCompleted(uint id, string cid);
    event TaskApproved(uint id);

    //  Public getters for frontend access
    function getBoardOwner(uint boardId) external view returns (address) {
        return taskBoards[boardId].owner;
    }

    function getBoardMembers(uint boardId) external view returns (address[] memory) {
        return taskBoards[boardId].members;
    }

    function getBoardTasks(uint boardId) external view returns (uint[] memory) {
        return taskBoards[boardId].taskIds;
    }

    function getBoardRole(uint boardId, address user) external view returns (Role) {
        return taskBoards[boardId].roles[user];
    }

    //  NEW: Return all member addresses (duplicate for clarity if needed)
    function getMembers(uint boardId) public view returns (address[] memory) {
        return taskBoards[boardId].members;
    }

    //  Task board creation
    function createTaskBoard() external returns (uint) {
        uint boardId = nextBoardId++;
        TaskBoard storage board = taskBoards[boardId];
        board.owner = msg.sender;
        board.members.push(msg.sender);
        board.roles[msg.sender] = Role.Creator;
        emit TaskBoardCreated(boardId, msg.sender);
        return boardId;
    }

    //  Add member with role
    function addMember(uint boardId, address member, Role role) external {
        TaskBoard storage board = taskBoards[boardId];
        require(msg.sender == board.owner, "Only owner can add members");
        board.members.push(member);
        board.roles[member] = role;
        emit MemberAdded(boardId, member);
    }

    function isMember(uint boardId, address user) public view returns (bool) {
        TaskBoard storage board = taskBoards[boardId];
        for (uint i = 0; i < board.members.length; i++) {
            if (board.members[i] == user) return true;
        }
        return false;
    }

    //  Create a task
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

    //  Claim, Complete, Approve
    function claimTask(uint taskId) external {
        Task storage task = tasks[taskId];
        TaskBoard storage board = taskBoards[task.boardId];
        require(board.roles[msg.sender] == Role.Contributor, "Only contributors can claim");
        require(task.status == TaskStatus.Open, "Task not open");
        task.assignee = msg.sender;
        task.status = TaskStatus.Claimed;
        emit TaskClaimed(taskId, msg.sender);
    }

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
