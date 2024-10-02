import { memo, useRef } from 'react';
import Webcam from 'react-webcam';
import './RoboflowModel.css';

const PUBLISHABLE_KEY = process.env.REACT_APP_ROBOFLOW_PUBLISHABLE_KEY;
const MODEL_NAME = 'rock-paper-scissors-sxsw';
const MODEL_VERSION = 11;

// memoize component to avoid loading and instantiating model multiple times
const RoboflowModel = memo(function RoboflowModel({ onModelLoad, onDetection }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let model;

  // keep video and canvas size synched
  window.addEventListener('resize', resizeCanvas);

  function resizeCanvas() {
    const video = webcamRef.current?.video;
    if (!video) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  // load roboflow model
  window.roboflow
    .auth({ publishable_key: PUBLISHABLE_KEY })
    .load({ model: MODEL_NAME, version: MODEL_VERSION })
    .then((m) => {
      model = m;
      model.configure({ max_objects: 1 });

      // sync canvas size before starting detection
      resizeCanvas();

      // call model loaded handler
      onModelLoad();
    });

  // start detection loop
  requestAnimationFrame(detectFrame);

  function detectFrame() {
    if (!model) return requestAnimationFrame(detectFrame);

    const video = webcamRef.current?.video;
    if (video?.readyState !== 4) return requestAnimationFrame(detectFrame);

    model
      .detect(video)
      .then((detections) => {
        const detection = detections?.[0];

        // render detection on canvas
        renderDetection(detection);

        // call detection handler
        onDetection(detection?.class);

        requestAnimationFrame(detectFrame);
      })
      .catch((e) => {
        console.error(e);
        requestAnimationFrame(detectFrame);
      });
  }

  function renderDetection(detection) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!detection) return;

    const x = detection.bbox.x;
    const y = detection.bbox.y;
    const width = detection.bbox.width;
    const height = detection.bbox.height;

    // bounding box
    ctx.strokeStyle = detection.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(x - width / 2, y - height / 2, width, height);

    // label background
    ctx.fillStyle = detection.color;
    const textWidth = ctx.measureText(detection.class).width;
    const textHeight = 16;
    ctx.fillRect(x - width / 2, y - height / 2, textWidth + 8, textHeight + 4);

    // label text
    ctx.font = '16px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#000000';
    ctx.fillText(detection.class, x - width / 2 + 4, y - height / 2 + 1);
  }

  return (
    <div className="roboflow-model">
      <Webcam ref={webcamRef} muted={true} />
      <canvas ref={canvasRef} />
    </div>
  );
});

export default RoboflowModel;
