import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { VMS_URL_CONTRACTOR, VMS_AADHAR_CHECKIN } from "../Config/Config";
import axios from 'axios';


export default function AadhaarScanner({ conObj }) {

  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState(null);
  const [facingMode, setFacingMode] = useState("environment"); // or "user"
  const [statusMessage, setStatusMessage] = useState("");
  const [sessionUserData, setSessionUserData] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessLoading, setIsProcessLoading] = useState(false);
  const [checkinInCLs, setCheckInCLs] = useState(null);

  useEffect(() => {
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setSessionUserData(userData);
    } else {
      console.log("User data not found in sessionStorage");
    }
  }, []);

  const fetchCasualLabours = async () => {
    try {
      const response = await axios.get(`${VMS_URL_CONTRACTOR}getCLSCountByContractorId`, {
        params: {
          ContractorId: conObj?.Id
          // OrgId: sessionUserData.OrgId
        }
      });
      // console.log('Casual Labours:', response.data.ResultData[0].CheckInsCLCount);
      setCheckInCLs(response.data.ResultData[0].CheckInsCLCount);
    } catch (error) {
      console.error('Error fetching casual labours:', error);
    }
  };

  useEffect(() => {
    if (checkinInCLs >= conObj.CLCount) {
      setStatusMessage("All casual labours have been checked in. You can now proceed with checkouts only.");
    }
  }, [checkinInCLs, conObj.CLCount]);

  useEffect(() => {
    if (conObj?.Id) {
      fetchCasualLabours();
    }
  }, [conObj?.Id]);

  useEffect(() => {
    const offcanvasEl = document.getElementById("offcanvasRightChekOutCLScan");

    const handleShow = () => setIsCameraActive(true);
    const handleHide = () => {
      setIsCameraActive(false);
      setImageSrc(null);
      setAadhaarNumber(null);
      setStatusMessage("");
    };

    offcanvasEl?.addEventListener("shown.bs.offcanvas", handleShow);
    offcanvasEl?.addEventListener("hidden.bs.offcanvas", handleHide);

    return () => {
      offcanvasEl?.removeEventListener("shown.bs.offcanvas", handleShow);
      offcanvasEl?.removeEventListener("hidden.bs.offcanvas", handleHide);
    };
  }, []);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };


  // Capture image from webcam
  const captureImage = () => {
    setImageSrc(null);
    setAadhaarNumber(null);

    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      alert("Failed to capture image. Please try again or check camera access.");
      return;
    }

    setImageSrc(imageSrc); // optional: for preview

    // Convert base64 to Blob, then File
    const blob = dataURLtoBlob(imageSrc);
    const file = new File([blob], "captured.jpg", { type: "image/jpeg" });

    processImage(file);
  };

  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const processImage = async (image) => {
    setStatusMessage("Processing image...");
    setIsProcessLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        `${VMS_AADHAR_CHECKIN}extract_aadhaar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = response.data;
      console.log(data, 'response');

      if (data?.aadhaar_numbers?.length) {
        setIsProcessLoading(false);
        const aadhaarNumber = data.aadhaar_numbers[0];
        checkInWithAadhaar(aadhaarNumber);
        console.log("Extracted Aadhaar Number:", aadhaarNumber);
        setStatusMessage(`Aadhaar Number: ${aadhaarNumber}`);
      } else {
        setIsProcessLoading(false);
        setStatusMessage("No Aadhaar number found in the image.");
      }
    } catch (err) {
      setIsProcessLoading(false);
      console.error("OCR Error:", err);
      setStatusMessage("Error while processing the image.");
    }
    setIsProcessLoading(false);
  };

  const checkInWithAadhaar = async (aadhaarNo) => {
    setStatusMessage("Verifying Aadhaar with server...");
    setIsProcessLoading(true);
    try {
      const response = await fetch(`${VMS_URL_CONTRACTOR}AadharCheckIns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgid: sessionUserData?.OrgId,
          userid: sessionUserData?.Id || 1,
          ContractorId: conObj?.Id,
          AadharNo: aadhaarNo,
        }),
      });

      const result = await response.json();
      console.log(result[0].ResponseMessage);

      if (response.ok) {
        setIsProcessLoading(false);
        setStatusMessage(result[0].ResponseMessage);
        Swal.fire({
          title: "Successful!",
          text: result[0].ResponseMessage,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
      } else {
        setIsProcessLoading(false);
        Swal.fire({
          title: "Check-in Failed",
          text: result?.Message || "Could not verify Aadhaar.",
          icon: "error",
        });
        setStatusMessage("Server responded with error.");
      }
    } catch (err) {
      setIsProcessLoading(false);
      console.error("API Error:", err);
      Swal.fire("Error", "Something went wrong while checking in.", "error");
      setStatusMessage("Network error while contacting the server.");
    }
  };

  const handleSubmitAadhar = async () => {
    setIsProcessLoading(true);
    try {
      const response = await fetch(`${VMS_URL_CONTRACTOR}AadharCheckIns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgid: sessionUserData?.OrgId,
          userid: sessionUserData?.Id || 1,
          ContractorId: conObj?.Id,
          AadharNo: aadhaarNumber,
        }),
      });
      console.log(aadhaarNumber)

      const result = await response.json();
      console.log(result[0].ResponseMessage);

      if (response.ok) {
        setStatusMessage(result[0].ResponseMessage);
        setIsProcessLoading(false);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: result[0].ResponseMessage,
        }).then(() => {
          window.location.reload();
        });
      } else {
        setIsProcessLoading(false);
        Swal.fire({
          icon: "error",
          title: "Check-In Failed",
          text: result.message || "Could not complete the check-in.",
        });
      }
    } catch (error) {
      setIsProcessLoading(false);
      console.error("AadharCheckIns Error:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: error.message || "Something went wrong while connecting to the server.",
      });
    }
  };


  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasRightChekOutCLScan"
      aria-labelledby="offcanvasRightLabel"
      style={{ width: '90%' }}
    >
      <style>
        {`
          @media (min-width: 768px) { /* Medium devices and up (md) */
              #offcanvasRightChekOutCLScan {
                  width: 40% !important;
              }import AadhaarScanner from './adar';

          }
        `}
      </style>

      <form>
        <div className="offcanvas-header d-flex justify-content-between align-items-center mb-2">
          <h5 id="offcanvasRightLabel" className="mb-0">
            Checkin/out Casual Labours
          </h5>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div
          className="offcanvas-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '2rem',
            maxHeight: 'calc(100vh - 100px)',
            marginTop: '-2rem'
          }}
        >
          <div>
            <h1>Aadhaar Card Scanner</h1>
            <div className="card p-3 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Contractor Details</h5>
                <hr />
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Name</label>
                    <div className="bg-light p-2 rounded text-dark fw-medium">
                      {conObj?.ContractorName || "N/A"}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Mobile No</label>
                    <div className="bg-light p-2 rounded text-dark fw-medium">
                      {conObj?.PhoneNumber || "N/A"}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="bg-light p-2 rounded text-dark fw-medium">
                      {conObj?.Email || "N/A"}
                    </div>
                  </div>
                  {/* <div className="col-md-6">
                    <label className="form-label fw-semibold">CL's Count</label>
                    <div className="bg-light p-2 rounded text-dark fw-medium">
                      {conObj?.CLCount || "N/A"}
                    </div>
                  </div> */}
                </div>
                <div className="row mt-2 d-flex">
                  <div className="col-10">
                    <label className="form-label">Aadhar No:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Aadhar number"
                      value={aadhaarNumber?.replace(/(.{4})/g, "$1 ").trim()} // Format for display
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, ""); // Remove non-digits
                        if (raw.length > 12) raw = raw.slice(0, 12);
                        setAadhaarNumber(raw); // Store unformatted
                      }}
                      onWheel={(e) => e.target.blur()}
                      maxLength={14} // 12 digits + 2 spaces
                      disabled={isProcessLoading}
                    />
                    {/* <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Aadhar number"
                      value={aadhaarNumber}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, "");
                        if (raw.length > 12) raw = raw.slice(0, 12);
                        const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
                        setAadhaarNumber(e.target.value);
                      }}
                      onWheel={(e) => e.target.blur()}
                      maxLength={14}
                      disabled={isProcessLoading}
                    /> */}
                  </div>
                  <div className="col-2 d-flex align-items-end">
                    <button
                      className="btn btn-success "
                      onClick={handleSubmitAadhar}
                      type="button"
                      disabled={isProcessLoading}
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {isCameraActive && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode }}
                style={{ width: "100%" }}
              />
            )}

            <button
              type="button"
              onClick={toggleCamera}
              className="btn btn-secondary d-flex m-auto mt-2"
              disabled={isProcessLoading}
            >
              Switch to {facingMode === "user" ? "Back" : "Front"} Camera
            </button>


            <button type="button" className="btn btn-primary d-flex m-auto mt-4"
              disabled={isProcessLoading}
              onClick={captureImage}>Capture Image</button>

            {/* {statusMessage ? <p className="fw-semibold mt-3 text-center text-info fs-3">{statusMessage}</p> : ''} */}

            {/* {aadhaarNumber && (
              <div className="text-center">
                <h2 className="text-success">Aadhaar Number: {aadhaarNumber}</h2>
              </div>
            )} */}
            {imageSrc && <img src={imageSrc} alt="Captured" style={{ marginTop: "10px", width: '100%', height: '300px' }} />}

          </div>
        </div>
      </form>
    </div>
  );
};


AadhaarScanner.propTypes = {
  conObj: PropTypes.object.isRequired
};