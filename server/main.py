from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import base64
import io
from PIL import Image
import numpy as np
import mediapipe as mp
import cv2

print("✅ main.py loaded")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False)

@app.post("/analyze-frame")
async def analyze_frame(request: Request):
    try:
        data = await request.json()
        base64_image = data.get("image")

        if not base64_image:
            return {"error": "No image provided."}

        image_data = base64.b64decode(base64_image)
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        image_np = np.array(image)
        image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

        results = pose.process(image_bgr)

        if results.pose_landmarks:
            return {"result": "pose_detected"}
        else:
            return {"result": "no_pose_detected"}
    except Exception as e:
        return {"error": f"🔥 Processing error: {str(e)}"}
