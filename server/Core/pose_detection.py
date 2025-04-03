import mediapipe as mp
import cv2
import numpy as np
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple, Union
from .angle_calculator import Point, calculate_angle
from mediapipe.python.solutions.pose import PoseLandmark as MPPoseLandmark
from mediapipe.python.solutions.pose import Pose

@dataclass
class PoseLandmark:
    x: float
    y: float
    z: float
    visibility: float

class PoseDetector:
    def __init__(self, mode=True, model_complexity=1, smooth_landmarks=True,
                 enable_segmentation=False, smooth_segmentation=True,
                 min_detection_confidence=0.5, min_tracking_confidence=0.5):
        """
        אתחול מזהה התנוחות
        
        Args:
            mode: האם במצב סטטי (True) או בזמן אמת (False)
            model_complexity: מורכבות המודל (0, 1, או 2)
            smooth_landmarks: האם להחליק את נקודות המפתח
            enable_segmentation: האם להפעיל סגמנטציה
            smooth_segmentation: האם להחליק את הסגמנטציה
            min_detection_confidence: סף מינימום לזיהוי
            min_tracking_confidence: סף מינימום למעקב
        """
        self.pose = Pose(
            static_image_mode=mode,
            model_complexity=model_complexity,
            smooth_landmarks=smooth_landmarks,
            enable_segmentation=enable_segmentation,
            smooth_segmentation=smooth_segmentation,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        self.mp_draw = mp.solutions.drawing_utils
        
    @staticmethod
    def landmark_to_point(landmark) -> Point:
        """
        המרת נקודת מפתח לנקודה
        
        Args:
            landmark: נקודת מפתח של MediaPipe
            
        Returns:
            Point: נקודה במערכת הקואורדינטות שלנו
        """
        return Point(x=float(landmark.x), y=float(landmark.y), z=float(landmark.z))

    def process_frame(self, frame: np.ndarray, draw: bool = True) -> Tuple[Dict[int, PoseLandmark], np.ndarray]:
        """
        עיבוד פריים בודד לזיהוי נקודות מפתח
        
        Args:
            frame: פריים מהסרטון
            draw: האם לצייר את הנקודות על הפריים
            
        Returns:
            Tuple[Dict[int, PoseLandmark], np.ndarray]: נקודות המפתח והפריים המעובד
        """
        # המרה ל-RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # זיהוי נקודות מפתח
        results = self.pose.process(rgb_frame)
        
        # מילון של נקודות מפתח
        landmarks = {}
        
        if results.pose_landmarks:
            # ציור נקודות המפתח על הפריים
            if draw:
                self.mp_draw.draw_landmarks(
                    frame, 
                    results.pose_landmarks,
                    mp.solutions.pose.POSE_CONNECTIONS
                )
            
            # שמירת נקודות המפתח
            for idx, landmark in enumerate(results.pose_landmarks.landmark):
                landmarks[idx] = PoseLandmark(
                    x=landmark.x,
                    y=landmark.y,
                    z=landmark.z,
                    visibility=landmark.visibility
                )
                
        return landmarks, frame
        
    def get_landmark_coordinates(self, landmarks: Dict[int, PoseLandmark], 
                               landmark_indices: List[int]) -> List[Point]:
        """
        קבלת קואורדינטות עבור רשימת אינדקסים של נקודות מפתח
        
        Args:
            landmarks: מילון של נקודות מפתח
            landmark_indices: רשימת אינדקסים של נקודות מפתח
            
        Returns:
            List[Point]: רשימת קואורדינטות של נקודות המפתח
        """
        points = []
        for idx in landmark_indices:
            if idx in landmarks:
                landmark = landmarks[idx]
                points.append(Point(x=landmark.x, y=landmark.y, z=landmark.z))
        return points
        
    def calculate_joint_angle(self, landmarks: Dict[int, PoseLandmark],
                            joint_indices: List[int]) -> Optional[float]:
        """
        חישוב הזווית במפרק ספציפי
        
        Args:
            landmarks: מילון של נקודות מפתח
            joint_indices: רשימת אינדקסים של נקודות המפרק [נקודת התחלה, נקודת מרכז, נקודת סיום]
            
        Returns:
            Optional[float]: הזווית במעלות או None אם לא ניתן לחשב
        """
        points = []
        for idx in joint_indices:
            if idx in landmarks:
                landmark = landmarks[idx]
                points.append(Point(x=landmark.x, y=landmark.y, z=landmark.z))
            else:
                return None
        
        if len(points) != 3:
            return None
            
        return calculate_angle(points[0], points[1], points[2])
        
    def get_arm_angles(self, landmarks: Dict[int, PoseLandmark]) -> Dict[str, float]:
        """
        חישוב זוויות בזרועות
        
        Args:
            landmarks: מילון של נקודות מפתח
            
        Returns:
            Dict[str, float]: מילון של זוויות הזרועות
        """
        angles = {}
        
        # זוויות זרוע ימין
        right_shoulder = self.calculate_joint_angle(landmarks, [12, 14, 16])
        right_elbow = self.calculate_joint_angle(landmarks, [14, 16, 20])
        if right_shoulder is not None:
            angles['right_shoulder'] = right_shoulder
        if right_elbow is not None:
            angles['right_elbow'] = right_elbow
            
        # זוויות זרוע שמאל
        left_shoulder = self.calculate_joint_angle(landmarks, [11, 13, 15])
        left_elbow = self.calculate_joint_angle(landmarks, [13, 15, 19])
        if left_shoulder is not None:
            angles['left_shoulder'] = left_shoulder
        if left_elbow is not None:
            angles['left_elbow'] = left_elbow
            
        return angles
        
    def get_leg_angles(self, landmarks: Dict[int, PoseLandmark]) -> Dict[str, float]:
        """
        חישוב זוויות ברגליים
        
        Args:
            landmarks: מילון של נקודות מפתח
            
        Returns:
            Dict[str, float]: מילון של זוויות הרגליים
        """
        angles = {}
        
        # זוויות רגל ימין
        right_hip = self.calculate_joint_angle(landmarks, [24, 26, 28])
        right_knee = self.calculate_joint_angle(landmarks, [26, 28, 32])
        if right_hip is not None:
            angles['right_hip'] = right_hip
        if right_knee is not None:
            angles['right_knee'] = right_knee
            
        # זוויות רגל שמאל
        left_hip = self.calculate_joint_angle(landmarks, [23, 25, 27])
        left_knee = self.calculate_joint_angle(landmarks, [25, 27, 31])
        if left_hip is not None:
            angles['left_hip'] = left_hip
        if left_knee is not None:
            angles['left_knee'] = left_knee
            
        return angles

    def calculate_movement_speed(self, landmarks1: Dict[int, PoseLandmark],
                               landmarks2: Dict[int, PoseLandmark],
                               time_diff: float) -> Dict[str, float]:
        """
        חישוב מהירות התנועה בין שני פריימים
        
        Args:
            landmarks1: נקודות מפתח בפריים הראשון
            landmarks2: נקודות מפתח בפריים השני
            time_diff: הפרש הזמן בין הפריימים בשניות
            
        Returns:
            Dict[str, float]: מילון של מהירויות התנועה
        """
        speeds = {}
        
        # חישוב מהירויות לכל נקודת מפתח
        for idx in landmarks1.keys():
            if idx in landmarks2:
                p1 = Point(x=landmarks1[idx].x, y=landmarks1[idx].y, z=landmarks1[idx].z)
                p2 = Point(x=landmarks2[idx].x, y=landmarks2[idx].y, z=landmarks2[idx].z)
                
                # חישוב המרחק האוקלידי
                distance = np.sqrt(
                    (p2.x - p1.x)**2 +
                    (p2.y - p1.y)**2 +
                    (p2.z - p1.z)**2
                )
                
                # חישוב המהירות
                speed = distance / time_diff if time_diff > 0 else 0
                speeds[idx] = speed
                
        return speeds

    def detect_movement_start(self, landmarks_list: List[Dict[int, PoseLandmark]],
                            threshold: float = 0.1) -> List[int]:
        """
        זיהוי תחילת תנועה ברצף של פריימים
        
        Args:
            landmarks_list: רשימה של נקודות מפתח לכל פריים
            threshold: סף לזיהוי תנועה
            
        Returns:
            List[int]: רשימת אינדקסים של תחילת תנועה
        """
        movement_starts = []
        
        for i in range(1, len(landmarks_list)):
            speeds = self.calculate_movement_speed(
                landmarks_list[i-1],
                landmarks_list[i],
                1.0  # נניח הפרש זמן של שנייה בין פריימים
            )
            
            # בדיקה אם יש תנועה משמעותית
            if any(speed > threshold for speed in speeds.values()):
                movement_starts.append(i)
                
        return movement_starts