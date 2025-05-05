import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/CoordiChain.json";
import { contractAddress } from "../constants";

// Mapping of numeric role values to human-readable role names
const ROLE_MAP = {
  0: "None",
  1: "Creator",
  2: "Contributor",
  3: "Reviewer",
};

// Component to display the list of board members and their roles
function MemberList({ boardId }) {
  // State to hold the list of members with their roles
  const [members, setMembers] = useState([]);

  // useEffect to fetch member data when boardId changes
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Connect to Ethereum provider (e.g., MetaMask)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Create smart contract instance
        const contract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );

        // Fetch all wallet addresses of members in the board
        const addresses = await contract.getBoardMembers(boardId);

        // For each address, fetch the assigned role and map it to readable string
        const memberRoles = await Promise.all(
          addresses.map(async (addr) => {
            const role = await contract.getRole(boardId, addr);
            return { addr, role: ROLE_MAP[role] || "Unknown" };
          })
        );

        // Update state with fetched member-role pairs
        setMembers(memberRoles);
      } catch (err) {
        // Log any error during fetching
        console.error("Error fetching members:", err);
      }
    };

    // Invoke member fetching function
    fetchMembers();
  }, [boardId]); // Rerun effect if boardId changes

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">🧑‍🤝‍🧑 Board Members</h3>

      {/* Display message if no members are found */}
      {members.length === 0 ? (
        <p>No members added yet.</p>
      ) : (
        // Display each member with their role
        <ul className="space-y-1">
          {members.map((m, idx) => (
            <li key={idx} className="text-sm">
              {m.addr} — <span className="italic">{m.role}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MemberList;
