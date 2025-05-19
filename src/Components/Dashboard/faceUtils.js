import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
};

export const getFaceDescriptor = async (imageElement) => {
  try {
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.warn('⚠️ No face detected');
      return null;
    }

    return detection.descriptor;
  } catch (err) {
    console.error('Face detection error:', err);
    return null;
  }
};

export const compareFaces = (desc1, desc2) => {
  if (!desc1 || !desc2) return 0;
  const distance = faceapi.euclideanDistance(desc1, desc2);
  return ((1 - distance) * 100).toFixed(2);
};
