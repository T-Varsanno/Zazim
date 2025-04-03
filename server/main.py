from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import base64, io, uuid, os
from PIL import Image
import numpy as np
import mediapipe as mp
import cv2

print("✅ Server running")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pose setup
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Store frame data by session ID
frame_buffer = {}

@app.post("/upload-frame")
async def upload_frame(request: Request):
    data = await request.json()
    session_id = data.get("session_id")
    base64_image = data.get("image")

    if not session_id or not base64_image:
        return {"error": "Missing session_id or image"}

    if session_id not in frame_buffer:
        frame_buffer[session_id] = []

    frame_buffer[session_id].append(base64_image)
    return {"status": "frame received"}

@app.post("/finish-session")
async def finish_session(request: Request):
    data = await request.json()
    session_id = data.get("session_id")

    if not session_id or session_id not in frame_buffer:
        return {"error": "Invalid session"}

    images_base64 = frame_buffer.pop(session_id)
    movement_detected = False
    prev_landmarks = None

    for idx, base64_image in enumerate(images_base64):
        try:
            image_data = base64.b64decode(base64_image)
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            image_np = np.array(image)
            image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

            # Show frame (for debug)
            cv2.imshow("📷 Frame Viewer", image_bgr)
            cv2.waitKey(100)

            # Pose detection
            results = pose.process(image_bgr)

            if results.pose_landmarks:
                if prev_landmarks:
                    diffs = [
                        np.linalg.norm(np.array([lmk.x, lmk.y, lmk.z]) -
                                       np.array([prev.x, prev.y, prev.z]))
                        for lmk, prev in zip(results.pose_landmarks.landmark, prev_landmarks)
                    ]
                    if np.mean(diffs) > 0.01:  # ← tweak this threshold as needed
                        movement_detected = True
                        break
                prev_landmarks = results.pose_landmarks.landmark

        except Exception as e:
            print(f"⚠️ Frame error: {e}")
            continue

    cv2.destroyAllWindows()

    return {"result": "movement_detected" if movement_detected else "no_movement"}
