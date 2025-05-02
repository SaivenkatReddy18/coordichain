import { useState } from "react";
import { ethers } from "ethers";
import TaskBoardManager from "./components/TaskBoardManager";
import TaskBoardView from "./components/TaskBoardView";

function App() {
  const [account, setAccount] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(0);

  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      // 1) ask for accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // 2) switch to hardhat chain
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x7A69" }], // Hardhat’s chain ID
        });
      } catch (switchError) {
        // this error code means the chain is not added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7A69",
                chainName: "Hardhat Localhost",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: ["http://127.0.0.1:8545"],
                blockExplorerUrls: [],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      // 3) now read the account
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0].address);
    } catch (err) {
      console.error(err);
      alert("Could not connect wallet");
    }
  }

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>CoordiChain DAO Task Manager</h1>

      {!account ? (
        <button onClick={connectWallet} style={buttonStyle}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>
            <strong>Connected Wallet:</strong> {account}
          </p>

          <TaskBoardManager />

          <div style={{ marginTop: "2rem" }}>
            <label>Select Board ID: </label>
            <input
              type="number"
              value={selectedBoardId}
              onChange={(e) => setSelectedBoardId(Number(e.target.value))}
              style={{ marginLeft: "10px", padding: "6px", width: "80px" }}
            />
          </div>

          <TaskBoardView boardId={selectedBoardId} currentUser={account} />
        </>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "deepskyblue",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default App;
