import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceScanner = () => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(true);

  const loadModels = async () => {
    const MODEL_URL = '/models'; // Correct path to models
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      console.log('Tiny Face Detector Model Loaded');
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      console.log('Face Landmark Model Loaded');
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      console.log('Face Recognition Model Loaded');
      setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };
  

  useEffect(() => {
    loadModels(); // Automatically load models on component mount
  }, []);

  const startCamera = async () => {
    if (!modelsLoaded) {
      console.log("Models not loaded yet.");
      return; // Prevent camera from starting if models aren't loaded
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const handleVideoPlay = () => {
    if (!modelsLoaded) return;
  
    videoRef.current.addEventListener('play', () => {
      const interval = setInterval(async () => {
        if (!videoRef.current) return;
  
        // Detect all faces in the video
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks() // Add face landmarks detection
          .withFaceDescriptors(); // Add face descriptors (for recognition)
  
        console.clear();
        console.log("Detected faces:", detections);
  
        // Example: Iterate over each detected face
        detections.forEach(detection => {
          // Bounding box
          const { x, y, width, height } = detection.detection.box;
          console.log(`Face Box: x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
  
          // Landmarks (68 points for face landmarks)
          if (detection.landmarks) {
            console.log("Face Landmarks:", detection.landmarks.positions); // Array of 68 positions (x, y)
          }
  
          // Descriptor (if needed for recognition)
          if (detection.descriptor) {
            console.log("Face Descriptor:", detection.descriptor); // A vector of features for face recognition
          }
        });
      }, 1000);
  
      // Optional: clear the interval when video ends
      videoRef.current.addEventListener('pause', () => clearInterval(interval));
    });
  };
  

  return (
    <div>
      <button onClick={startCamera} disabled={!modelsLoaded}>
        {modelsLoaded ? 'Start Face Scan' : 'Loading Models...'}
      </button>
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="720"
          height="560"
          onPlay={handleVideoPlay}
          style={{ border: "1px solid black", marginTop: "20px" }}
        />
      </div>
    </div>
  );
};

export default FaceScanner;
