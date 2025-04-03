from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import base64, io
from PIL import Image
import numpy as np
import mediapipe as mp
import cv2

print("✅ Server started")

app = FastAPI()

# Allow cross-origin for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pose model
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Session-based frame storage
frame_buffer = {}

@app.post("/upload-frame")
async def upload_frame(request: Request):
    try:
        data = await request.json()
        session_id = data.get("session_id")
        base64_image = data.get("image")

        if not session_id or not base64_image:
            return {"error": "Missing session_id or image"}

        if session_id not in frame_buffer:
            frame_buffer[session_id] = []

        frame_buffer[session_id].append(base64_image)
        return {"status": "frame received"}

    except Exception as e:
        return {"error": f"Upload error: {str(e)}"}

@app.post("/finish-session")
async def finish_session(request: Request):
    try:
        data = await request.json()
        session_id = data.get("session_id")

        if not session_id or session_id not in frame_buffer:
            return {"error": "Invalid or missing session_id"}

        base64_frames = frame_buffer.pop(session_id)
        frame_array = []

        # Convert base64 to np.ndarray
        for idx, base64_image in enumerate(base64_frames):
            try:
                image_data = base64.b64decode(base64_image)
                image = Image.open(io.BytesIO(image_data)).convert("RGB")
                image_np = np.array(image)
                image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

                # === Preprocessing (customize this if needed) ===
                image_bgr = preprocess_frame(image_bgr)

                frame_array.append(image_bgr)

                # Optional: Show each frame
                cv2.imshow("📷 Frame Viewer", image_bgr)
                cv2.waitKey(100)

            except Exception as e:
                print(f"⚠️ Frame {idx} error: {e}")

        cv2.destroyAllWindows()

        # === Movement Detection with MediaPipe (placeholder) ===
        movement_detected = detect_movement_with_mediapipe(frame_array)

        return {
            "result": "movement_detected" if movement_detected else "no_movement"
        }

    except Exception as e:
        return {"error": f"Finish session error: {str(e)}"}


# 🔧 Frame preprocessing (resize, normalize, etc.)
def preprocess_frame(frame):
    # Resize if needed
    resized = cv2.resize(frame, (480, 360))  # Optional
    # Normalize brightness/contrast
    normalized = cv2.normalize(resized, None, 0, 255, cv2.NORM_MINMAX)
    return normalized  # Must return RGB or BGR


# 🧠 Placeholder: Movement detection using MediaPipe
def detect_movement_with_mediapipe(frames):
    prev_landmarks = None

    for frame in frames:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)

        if results.pose_landmarks:
            if prev_landmarks:
                diffs = [
                    np.linalg.norm(np.array([lmk.x, lmk.y, lmk.z]) -
                                   np.array([prev.x, prev.y, prev.z]))
                    for lmk, prev in zip(results.pose_landmarks.landmark, prev_landmarks)
                ]
                if np.mean(diffs) > 0.01:  # ← adjust threshold as needed
                    return True
            prev_landmarks = results.pose_landmarks.landmark

    return False
