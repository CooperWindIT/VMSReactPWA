import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const AadhaarScanner = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState(null);

  // Capture image from webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    processImage(imageSrc);
  };

  // Process the image using Tesseract.js for OCR
  const processImage = (image) => {
    Tesseract.recognize(
      image,
      "eng",
      {
        logger: (m) => console.log(m), // To log OCR progress
      }
    )
      .then(({ data: { text } }) => {
        // Extract Aadhaar number (Assuming it's a 12-digit number)
        const aadhaarPattern = /\b\d{12}\b/;
        const match = text.match(aadhaarPattern);
        if (match) {
          setAadhaarNumber(match[0]);
        } else {
          alert("Aadhaar number not found in the image.");
        }
      })
      .catch((err) => {
        console.error("OCR Error: ", err);
        alert("Error while processing the image.");
      });
  };

  return (
    <div>
      <h1>Aadhaar Card Scanner</h1>
        <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
                facingMode: { exact: "environment" } // Forces back camera on supported devices
            }}
        />

        <button className="btn btn-primary d-flex m-auto mt-4" onClick={captureImage}>Capture Image</button>

        {imageSrc && <img src={imageSrc} alt="Captured" style={{ marginTop: "10px", width: '80%', height: '300px' }} />}

        {aadhaarNumber && (
            <div>
            <h2>Aadhaar Number: {aadhaarNumber}</h2>
            </div>
        )}
    </div>
  );
};

export default AadhaarScanner;
