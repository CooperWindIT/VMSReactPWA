import React, { useRef, useState, useEffect } from "react";
import { loadModels, getFaceDescriptor, compareFaces } from "./faceUtils";

export default function Face() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [result, setResult] = useState("");

    const [devices, setDevices] = useState([]);
    const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
    const [facingMode, setFacingMode] = useState("user"); // "user" = front, "environment" = rear


    // List cameras when component mounts
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            setDevices(videoDevices);
        });
    }, []);


    useEffect(() => {
        (async () => {
            await loadModels();
            console.log("✅ Models loaded");
        })();
    }, []);

    const startCamera = async () => {
        if (videoRef.current.srcObject) {
          // Stop any existing tracks before switching
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
      
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
      
        videoRef.current.srcObject = stream;
      };
      
      const switchCamera = async () => {
        const newMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(newMode);
      
        setTimeout(() => {
          startCamera();
        }, 100); // slight delay to allow state update
      };
      


    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL("image/png");
        setImage(imgData);
    };

    const handleRegister = async () => {
        if (!image) {
            alert("Capture an image first");
            return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;

        img.onload = async () => {
            const descriptor = await getFaceDescriptor(img);

            if (descriptor) {
                const stored = localStorage.getItem("faceDescriptors");
                const allDescriptors = stored ? JSON.parse(stored) : [];

                allDescriptors.push(Array.from(descriptor));
                localStorage.setItem("faceDescriptors", JSON.stringify(allDescriptors));

                alert("✅ Face registered!");
            } else {
                alert("❌ No face detected. Try again.");
            }
        };

        img.onerror = () => alert("❌ Failed to load image.");
    };

    const handleVerify = async () => {
        const stored = localStorage.getItem("faceDescriptors");
        if (!stored) return alert("❌ No registered faces found.");

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;

        img.onload = async () => {
            const descriptor = await getFaceDescriptor(img);
            if (!descriptor) {
                alert("❌ No face detected in verification image.");
                return;
            }

            const allDescriptors = JSON.parse(stored);
            const threshold = 80;
            let matched = false;

            for (let storedDesc of allDescriptors) {
                const match = compareFaces(descriptor, new Float32Array(storedDesc));
                if (match >= threshold) {
                    matched = true;
                    setResult(`✅ Face matched with ${match}% similarity`);
                    alert("✅ Face verified!");
                    break;
                }
            }

            if (!matched) {
                setResult("❌ No matching face found.");
                alert("❌ Face not verified.");
            }
        };

        img.onerror = () => alert("❌ Failed to load image for verification.");
    };

    return (
        <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasRightFaceScan"
            aria-labelledby="offcanvasRightLabel"
            style={{ width: "85%" }}
        >
            <style>
                {`
            #offcanvasRightFaceScan {
                width: 80%; /* Default for mobile devices */
            }

            @media (min-width: 768px) {  
                #offcanvasRightFaceScan {
                    width: 50% !important; /* Medium screens and up */
                }
            }

            @media (min-width: 1200px) {  
                #offcanvasRightFaceScan {
                    width: 45% !important; /* Even narrower for large desktops if needed */
                }
            }
        `}
            </style>
            <div className="offcanvas-header d-flex justify-content-between align-items-center">
                <h5 id="offcanvasRightLabel" className="mb-0">
                    Face Scan
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
                style={{ marginTop: "-2rem", maxHeight: "42rem", overflowY: "auto" }}
            >
                <video ref={videoRef} width="400" height="400" autoPlay />
                <canvas ref={canvasRef} style={{ display: "none" }} />

                <div className="d-flex justify-content-center my-3">
                    <button className="btn btn-secondary me-2" onClick={() => startCamera()}>Start Camera</button>
                    <button className="btn btn-warning me-2" onClick={switchCamera}>Switch Camera</button>
                    <button className="btn btn-info" onClick={captureImage}>Capture</button>
                </div>

                {image && <img src={image} alt="Captured" className="rounded" style={{ width: '100%' }} />}

                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-primary me-3" onClick={handleRegister}>Register</button>
                    <button className="btn btn-success" onClick={handleVerify}>Verify</button>
                </div>
                <p>{result}</p>
            </div>
        </div>
    );
}
