import cv2
import numpy as np
from typing import List, Tuple, Dict, Optional
from dataclasses import dataclass
from .pose_detection import PoseDetector, PoseLandmark

@dataclass
class Frame:
    """
    מחלקה המייצגת פריים בודד עם המידע שלו
    """
    image: np.ndarray
    timestamp: float
    landmarks: Optional[Dict[int, PoseLandmark]] = None

class FrameProcessor:
    def __init__(self, frames: List[Frame]):
        """
        אתחול מעבד הפריימים
        
        Args:
            frames: רשימה של פריימים עם הזמנים שלהם
        """
        self.frames = sorted(frames, key=lambda x: x.timestamp)
        self.pose_detector = PoseDetector(mode=True)
        
    def process_all_frames(self) -> List[Frame]:
        """
        עיבוד כל הפריימים וזיהוי נקודות מפתח
        
        Returns:
            List[Frame]: רשימת הפריימים המעובדים
        """
        for frame in self.frames:
            if frame.landmarks is None:
                landmarks, _ = self.pose_detector.process_frame(frame.image)
                frame.landmarks = landmarks
        return self.frames
    
    def get_frame_at_time(self, time_seconds: float) -> Optional[Frame]:
        """
        קבלת פריים בזמן ספציפי
        
        Args:
            time_seconds: זמן בשניות
            
        Returns:
            Optional[Frame]: הפריים בזמן המבוקש או None אם לא נמצא
        """
        for frame in self.frames:
            if abs(frame.timestamp - time_seconds) < 0.001:  # טווח של מילישנייה
                return frame
        return None
    
    def get_frames_in_range(self, start_time: float, end_time: float) -> List[Frame]:
        """
        קבלת כל הפריימים בטווח זמן מסוים
        
        Args:
            start_time: זמן התחלה בשניות
            end_time: זמן סיום בשניות
            
        Returns:
            List[Frame]: רשימת הפריימים בטווח הזמן
        """
        return [frame for frame in self.frames if start_time <= frame.timestamp <= end_time]
    
    def get_frame_count(self) -> int:
        """
        קבלת מספר הפריימים
        
        Returns:
            int: מספר הפריימים
        """
        return len(self.frames)
    
    def get_time_range(self) -> Tuple[float, float]:
        """
        קבלת טווח הזמנים של הפריימים
        
        Returns:
            Tuple[float, float]: זמן התחלה וסיום בשניות
        """
        if not self.frames:
            return (0.0, 0.0)
        return (self.frames[0].timestamp, self.frames[-1].timestamp) 