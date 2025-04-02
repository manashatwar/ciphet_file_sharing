// src/App.js
import Upload from "./artifacts/contracts/Upload.sol/Upload.json"; 
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Pixel from "./Pixel"; 
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("accountsChanged", () => window.location.reload());
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  return (
    <>
      <div className="App">
        <div className="top-navigation">
          <h1 className="title">🅸🅽🆃🅴🆁🅳🆁🅸🆅🅴</h1>
          
          {!modalOpen && (
            <button className="share" onClick={() => setModalOpen(true)}>
              Share
            </button>
          )}
          
          <p>
            {account ? (
              <span className="account-address">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            ) : "Not connected"}
          </p>
        </div>
       
        {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}
        
        <Pixel />
        <FileUpload 
          account={account} 
          provider={provider} 
          contract={contract} 
          className="choose" 
        />
        <Display contract={contract} account={account} />
      </div>
    </>
  );
}

export default App;