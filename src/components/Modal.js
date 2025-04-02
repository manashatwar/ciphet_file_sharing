import React, { useEffect, useState } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const [accessList, setAccessList] = useState([]);

  const sharing = async () => {
    const addressInput = document.querySelector(".address");
    const address = addressInput.value.trim();
    
    if (!address) {
      alert("Please enter a valid address");
      return;
    }

    try {
      // Call the contract method first
      await contract.allow(address);

      // Fetch the updated list after Metamask confirmation
      fetchAccessList();

      // Clear the input field
      addressInput.value = "";
    } catch (error) {
      console.error("Error sharing access:", error);
    }
  };

  const fetchAccessList = async () => {
    if (contract) {
      const addresses = await contract.shareAccess();
      setAccessList(addresses);
    }
  };

  const revokeAccess = async (address) => {
    try {
      // Call disallow method
      await contract.disallow(address);

      // Fetch updated list after Metamask confirmation
      fetchAccessList();
    } catch (error) {
      console.error("Error revoking access:", error);
    }
  };

  useEffect(() => {
    fetchAccessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share Access</div>
          
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            />
          </div>

          {/* People with Access Section */}
          <div className="peopleWithAccess">
            <div className="peopleWithAccessTitle">People with Access</div>
            <div className="accessList">
              {accessList.length === 0 ? (
                <div className="noAccess">No addresses have access yet</div>
              ) : (
                accessList
                  .filter(access => access.access) // Only show users with current access
                  .map((access, index) => (
                    <div key={index} className="accessItem">
                      <span>{access.user}</span>
                      <button 
                        className="revokeBtn" 
                        onClick={() => revokeAccess(access.user)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={sharing}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;