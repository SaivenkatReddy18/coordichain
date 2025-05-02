// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CoordiChain {
    enum TaskStatus { Open, Claimed, Completed, Approved }

    struct Task {
        uint id;
        address creator;
        address assignee;
        TaskStatus status;
        string metadataCID;
        string deliverableCID;
    }

    struct TaskBoard {
        uint id;
        string name;
        address owner;
        address[] members;
        uint[] taskIds;
    }

    uint public nextTaskId;
    uint public nextBoardId;

    mapping(uint => Task) public tasks;
    mapping(uint => TaskBoard) public taskBoards;
    mapping(uint => mapping(address => bool)) public isBoardMember;

    event TaskCreated(uint id, address creator, string cid);
    event TaskClaimed(uint id, address assignee);
    event TaskCompleted(uint id, string cid);
    event TaskApproved(uint id);

    event TaskBoardCreated(uint boardId, string name, address owner);
    event MemberAdded(uint boardId, address member);

    modifier onlyBoardOwner(uint boardId) {
        require(taskBoards[boardId].owner == msg.sender, "Not board owner");
        _;
    }

    modifier onlyBoardMember(uint boardId) {
        require(isBoardMember[boardId][msg.sender], "Not a board member");
        _;
    }

    function createTaskBoard(string memory name) external {
        TaskBoard storage board = taskBoards[nextBoardId];
        board.id = nextBoardId;
        board.name = name;
        board.owner = msg.sender;
        board.members.push(msg.sender);
        isBoardMember[nextBoardId][msg.sender] = true;

        emit TaskBoardCreated(nextBoardId, name, msg.sender);
        nextBoardId++;
    }

    function addMember(uint boardId, address member) external onlyBoardOwner(boardId) {
        require(!isBoardMember[boardId][member], "Already a member");
        taskBoards[boardId].members.push(member);
        isBoardMember[boardId][member] = true;

        emit MemberAdded(boardId, member);
    }

    function createTask(uint boardId, string memory metadataCID) external onlyBoardMember(boardId) {
        tasks[nextTaskId] = Task({
            id: nextTaskId,
            creator: msg.sender,
            assignee: address(0),
            status: TaskStatus.Open,
            metadataCID: metadataCID,
            deliverableCID: ""
        });

        taskBoards[boardId].taskIds.push(nextTaskId);
        emit TaskCreated(nextTaskId, msg.sender, metadataCID);
        nextTaskId++;
    } 
    

    function claimTask(uint taskId) external {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Open, "Task not open");
        task.assignee = msg.sender;
        task.status = TaskStatus.Claimed;
        emit TaskClaimed(taskId, msg.sender);
    }

    function completeTask(uint taskId, string memory deliverableCID) external {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Claimed, "Task not claimed");
        require(task.assignee == msg.sender, "Only assignee can complete");
        task.deliverableCID = deliverableCID;
        task.status = TaskStatus.Completed;
        emit TaskCompleted(taskId, deliverableCID);
    }

    function approveTask(uint taskId) external {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Completed, "Task not completed");
        require(task.creator == msg.sender, "Only creator can approve");
        task.status = TaskStatus.Approved;
        emit TaskApproved(taskId);
    }

    function getBoardTasks(uint boardId) external view returns (uint[] memory) {
        return taskBoards[boardId].taskIds;
    }

    function getBoardMembers(uint boardId) external view returns (address[] memory) {
        return taskBoards[boardId].members;
    }
}