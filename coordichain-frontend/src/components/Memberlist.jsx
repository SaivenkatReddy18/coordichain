import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/CoordiChain.json";
import { contractAddress } from "../constants";

const ROLE_MAP = {
  0: "None",
  1: "Creator",
  2: "Contributor",
  3: "Reviewer",
};

function MemberList({ boardId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

        const addresses = await contract.getBoardMembers(boardId);
        const memberRoles = await Promise.all(
          addresses.map(async (addr) => {
            const role = await contract.getRole(boardId, addr);
            return { addr, role: ROLE_MAP[role] || "Unknown" };
          })
        );
        setMembers(memberRoles);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, [boardId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">🧑‍🤝‍🧑 Board Members</h3>
      {members.length === 0 ? (
        <p>No members added yet.</p>
      ) : (
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
