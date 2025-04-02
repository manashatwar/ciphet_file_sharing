import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); 
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000); 
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `4d02b06bab864c5cadaa`,
            pinata_secret_api_key: `e2d4171e21ace712bfded597526db8c8d4dd41453ed16396557ac1239f72f5ba`,
            "Content-Type": "multipart/form-data",
          },
        });
       
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        
        // This will trigger MetaMask popup 
        await contract.add(account, ImgHash);
        
        // Show success popup instead of alert
        setPopupType("success");
        setPopupMessage("Successfully Image Uploaded");
        setShowPopup(true);
        
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        // Show error popup instead of alert
        setPopupType("error");
        setPopupMessage("Unable to upload image to Pinata");
        setShowPopup(true);
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0]; 
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div className="file-upload-container">
      {/* Popup Notification */}
      {showPopup && (
        <div className={`popup-notification ${popupType}`}>
          <div className="popup-content">
            <div className="popup-icon">
              {popupType === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <p className="popup-message">{popupMessage}</p>
          </div>
        </div>
      )}
      
      <div className="upload-wrapper">
        {/* Choose Image Button */}
        <label className="choose-image-label">
          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
            className="hidden-input"
          />
          <div className="upload-circle-container">
            <div className="upload-circle-background"></div>
            <div className="upload-circle-main">
              <div className="upload-circle-ring"></div>
              <div className="upload-circle-content">
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="upload-title">Choose image</h2>
              </div>
            </div>
          </div>
        </label>

        {/* File Name Display */}
        <div className="file-name-display">
          <span className="file-name-text">{fileName}</span>
        </div>

        {/* Upload Button */}
        <button 
          type="submit" 
          onClick={handleSubmit}
          disabled={!file}
          className="upload-button"
        >
          <div className="upload-button-background"></div>
          <div className="upload-button-content">
            <div className="upload-button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="upload-button-text">Upload</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FileUpload;