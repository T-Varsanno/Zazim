from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dataclasses import dataclass
from typing import Optional, Dict, List
import base64
import io
from PIL import Image
import numpy as np
import cv2

from .exercise_pipeline import evaluate_exercise_from_frames

print("✅ Server running")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frame dataclass for storing incoming frames
@dataclass
class Frame:
    image: np.ndarray  # BGR image for processing
    timestamp: float
    landmarks: Optional[Dict] = None

# In-memory buffer for sessions
frame_buffer: Dict[str, List[Frame]] = {}

@app.post("/upload-frame")
async def upload_frame(request: Request):
    data = await request.json()
    session_id = data.get("session_id")
    base64_image = data.get("image")
    timestamp = data.get("timestamp")

    if not session_id or not base64_image:
        return {"error": "Missing session_id or image"}

    if session_id not in frame_buffer:
        frame_buffer[session_id] = []

    try:
        # Decode base64 to image
        image_data = base64.b64decode(base64_image)
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        image_np = np.array(image)
        image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

        frame = Frame(
            image=image_bgr,
            timestamp=float(timestamp) if timestamp else 0.0,
            landmarks=None
        )

        frame_buffer[session_id].append(frame)
        return {"status": "frame received"}

    except Exception as e:
        return {"error": f"Error decoding or processing image: {str(e)}"}

@app.post("/finish-session")
async def finish_session(request: Request):
    data = await request.json()
    session_id = data.get("session_id")

    if not session_id or session_id not in frame_buffer:
        return {"error": "Invalid session"}

    frames = frame_buffer.pop(session_id)
    images = [frame.image for frame in frames]

    try:
        print(f"📦 Evaluating {len(images)} frames from session {session_id}...")
        result = evaluate_exercise_from_frames(images)
        
        return {
            "result": "movement_detected" if result["repetition_count"] > 0 else "no_movement",
            **result
        }

    except Exception as e:
        print(f"❌ Evaluation error: {e}")
        return {"error": f"Evaluation failed: {str(e)}"}
