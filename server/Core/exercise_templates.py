from enum import Enum
from dataclasses import dataclass
from typing import List, Dict, Optional
from .angle_calculator import Point, calculate_angle, is_angle_in_range
from .pose_detection import PoseLandmark

class ExerciseType(Enum):
    ARM = "arm"
    LEG = "leg"
    BACK = "back"
    NECK = "neck"
    CUSTOM = "custom"

class ExerciseStage(Enum):
    START = "start"
    MIDDLE = "middle"
    END = "end"
    REST = "rest"

@dataclass
class JointRange:
    min_angle: float
    max_angle: float
    target_angle: float

@dataclass
class ExerciseJoint:
    name: str
    landmarks: List[int]  # [start_point, joint_point, end_point]
    range: JointRange
    importance: float = 1.0  # 0.0 to 1.0

@dataclass
class ExerciseFeedback:
    message: str
    severity: str  # "info", "warning", "error"
    joint_name: str
    current_angle: float
    target_angle: float

class Exercise:
    def __init__(self, name: str, exercise_type: ExerciseType, description: str,
                 joints: List[ExerciseJoint], target_repetitions: int = 10,
                 rest_time: float = 1.0):
        """
        אתחול תרגיל חדש
        
        Args:
            name: שם התרגיל
            exercise_type: סוג התרגיל
            description: תיאור התרגיל
            joints: רשימת המפרקים המעורבים בתרגיל
            target_repetitions: מספר החזרות המבוקש
            rest_time: זמן מנוחה בין חזרות בשניות
        """
        self.name = name
        self.type = exercise_type
        self.description = description
        self.joints = joints
        self.target_repetitions = target_repetitions
        self.rest_time = rest_time
        
        # מצב התרגיל
        self.current_stage = ExerciseStage.START
        self.repetitions = 0
        self.current_rest_time = 0.0
        
    def check_joint_angles(self, landmarks: Dict[int, PoseLandmark]) -> List[ExerciseFeedback]:
        """
        בדיקת זוויות בכל המפרקים
        
        Args:
            landmarks: מילון של נקודות מפתח
            
        Returns:
            List[ExerciseFeedback]: רשימת משוב על התרגיל
        """
        feedback = []
        
        for joint in self.joints:
            # חישוב זווית המפרק
            points = []
            for idx in joint.landmarks:
                if idx in landmarks:
                    landmark = landmarks[idx]
                    points.append(Point(x=landmark.x, y=landmark.y, z=landmark.z))
                else:
                    break
                    
            if len(points) != 3:
                continue
                
            current_angle = calculate_angle(points[0], points[1], points[2])
            
            # בדיקה אם הזווית בטווח המותר
            if not is_angle_in_range(current_angle, joint.range.min_angle, joint.range.max_angle):
                feedback.append(ExerciseFeedback(
                    message=f"הזווית במפרק {joint.name} מחוץ לטווח המותר",
                    severity="warning",
                    joint_name=joint.name,
                    current_angle=current_angle,
                    target_angle=joint.range.target_angle
                ))
                
        return feedback
        
    def update_stage(self, landmarks: Dict[int, PoseLandmark]) -> None:
        """
        עדכון שלב התרגיל
        
        Args:
            landmarks: מילון של נקודות מפתח
        """
        if self.current_stage == ExerciseStage.START:
            # בדיקה אם כל המפרקים בטווח ההתחלה
            all_in_range = True
            for joint in self.joints:
                points = []
                for idx in joint.landmarks:
                    if idx in landmarks:
                        landmark = landmarks[idx]
                        points.append(Point(x=landmark.x, y=landmark.y, z=landmark.z))
                    else:
                        all_in_range = False
                        break
                        
                if not all_in_range or len(points) != 3:
                    all_in_range = False
                    break
                    
                angle = calculate_angle(points[0], points[1], points[2])
                if not is_angle_in_range(angle, joint.range.min_angle, joint.range.max_angle):
                    all_in_range = False
                    break
                    
            if all_in_range:
                self.current_stage = ExerciseStage.MIDDLE
                
        elif self.current_stage == ExerciseStage.MIDDLE:
            # בדיקה אם כל המפרקים בטווח האמצע
            all_in_range = True
            for joint in self.joints:
                points = []
                for idx in joint.landmarks:
                    if idx in landmarks:
                        landmark = landmarks[idx]
                        points.append(Point(x=landmark.x, y=landmark.y, z=landmark.z))
                    else:
                        all_in_range = False
                        break
                        
                if not all_in_range or len(points) != 3:
                    all_in_range = False
                    break
                    
                angle = calculate_angle(points[0], points[1], points[2])
                if not is_angle_in_range(angle, joint.range.min_angle, joint.range.max_angle):
                    all_in_range = False
                    break
                    
            if all_in_range:
                self.current_stage = ExerciseStage.END
                
        elif self.current_stage == ExerciseStage.END:
            # בדיקה אם כל המפרקים בטווח הסיום
            all_in_range = True
            for joint in self.joints:
                points = []
                for idx in joint.landmarks:
                    if idx in landmarks:
                        landmark = landmarks[idx]
                        points.append(Point(x=landmark.x, y=landmark.y, z=landmark.z))
                    else:
                        all_in_range = False
                        break
                        
                if not all_in_range or len(points) != 3:
                    all_in_range = False
                    break
                    
                angle = calculate_angle(points[0], points[1], points[2])
                if not is_angle_in_range(angle, joint.range.min_angle, joint.range.max_angle):
                    all_in_range = False
                    break
                    
            if all_in_range:
                self.repetitions += 1
                if self.repetitions >= self.target_repetitions:
                    self.current_stage = ExerciseStage.REST
                else:
                    self.current_stage = ExerciseStage.START
                    
        elif self.current_stage == ExerciseStage.REST:
            # עדכון זמן המנוחה
            self.current_rest_time += 1/30  # נניח 30 FPS
            if self.current_rest_time >= self.rest_time:
                self.current_stage = ExerciseStage.START
                self.current_rest_time = 0.0
                
    def get_progress(self) -> float:
        """
        קבלת אחוז ההתקדמות בתרגיל
        
        Returns:
            float: אחוז ההתקדמות (0-100)
        """
        return (self.repetitions / self.target_repetitions) * 100
        
    def is_complete(self) -> bool:
        """
        בדיקה אם התרגיל הושלם
        
        Returns:
            bool: True אם התרגיל הושלם, False אחרת
        """
        return self.repetitions >= self.target_repetitions 