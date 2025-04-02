import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", hide: false });

  const showPopup = (message) => {
    // Reset any existing popup state
    setPopup({ show: false, message: "", hide: false });
    
    // Small delay to ensure state reset
    setTimeout(() => {
      setPopup({ show: true, message, hide: false });
    }, 10);
    
    // Start hiding animation after 2.7 seconds
    setTimeout(() => {
      setPopup(prev => ({ ...prev, hide: true }));
    }, 2700);
    
    // Actually remove popup after animation completes
    setTimeout(() => {
      setPopup({ show: false, message: "", hide: false });
    }, 3000);
  };

  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (error) {
      showPopup("You don't have access");
      return;
    }

    if (dataArray && dataArray.length > 0) {
      // Limit to 20 images to match 4x5 grid
      const limitedImages = dataArray.slice(0, 20);
      
      const images = limitedImages.map((item, i) => (
        <div 
          key={`div-${i}`} 
          className="grid-item"
          style={{ 
            '--i': i % 5  // Creates a repeating stagger effect
          }}
        >
          <a href={item} target="_blank" rel="noopener noreferrer">
            <img src={item} alt={`Image ${i + 1}`} className="grid-image" />
          </a>
        </div>
      ));
      setData(images);
    } else {
      showPopup("No image to display");
    }
  };

  return (
    <>
      <div className="wrapper">{data}</div>
      <input type="text" placeholder="Enter Address" className="address" />
      <button className="neon-button" onClick={getdata}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Get Data
      </button>
      
      {/* Toast Notification */}
      {popup.show && (
        <div className={`popup-overlay ${popup.hide ? 'hide' : ''}`}>
          <div className="popup-content">
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Display;