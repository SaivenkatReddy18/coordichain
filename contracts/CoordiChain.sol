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

    uint public nextTaskId;
    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, address creator, string cid);
    event TaskClaimed(uint id, address assignee);
    event TaskCompleted(uint id, string cid);
    event TaskApproved(uint id);

    function createTask(string memory metadataCID) external {
        tasks[nextTaskId] = Task({
            id: nextTaskId,
            creator: msg.sender,
            assignee: address(0),
            status: TaskStatus.Open,
            metadataCID: metadataCID,
            deliverableCID: ""
        });

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
}
