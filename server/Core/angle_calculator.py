from dataclasses import dataclass
from typing import Union, List, Tuple
import numpy as np

@dataclass
class Point:
    """
    מחלקה המייצגת נקודה במרחב תלת-ממדי
    """
    x: float
    y: float
    z: float = 0.0

def calculate_angle(pt1: Point, pt2: Point, pt3: Point) -> float:
    """
    חישוב זווית בין שלוש נקודות במישור דו-ממדי
    
    Args:
        pt1: נקודת התחלה
        pt2: נקודת מרכז (קודקוד הזווית)
        pt3: נקודת סיום
        
    Returns:
        float: הזווית במעלות
    """
    # חישוב וקטורים במישור דו-ממדי
    v1 = np.array([pt1.x - pt2.x, pt1.y - pt2.y])
    v2 = np.array([pt3.x - pt2.x, pt3.y - pt2.y])
    
    # חישוב זוויות באמצעות arctan2
    angle1 = np.arctan2(v1[1], v1[0])
    angle2 = np.arctan2(v2[1], v2[0])
    
    # חישוב ההפרש בין הזוויות
    angle_diff = np.abs(angle2 - angle1)
    
    # המרה למעלות
    angle_degrees = np.degrees(angle_diff)
    
    # נרמול הזווית להיות בין 0 ל-180
    if angle_degrees > 180:
        angle_degrees = 360 - angle_degrees
        
    return angle_degrees

def calculate_angle_range(current_angle: float, min_angle: float, max_angle: float) -> float:
    """
    חישוב אחוז התקדמות בטווח זווית מסוים
    
    Args:
        current_angle: הזווית הנוכחית
        min_angle: הזווית המינימלית בטווח
        max_angle: הזווית המקסימלית בטווח
        
    Returns:
        float: אחוז ההתקדמות (0-100)
    """
    # אם הטווח הפוך, החלף בין מינימום למקסימום
    if min_angle > max_angle:
        min_angle, max_angle = max_angle, min_angle
        
    # חישוב הטווח הכולל והטווח הנוכחי
    total_range = max_angle - min_angle
    current_range = current_angle - min_angle
    
    # חישוב האחוז
    percentage = (current_range / total_range) * 100
    
    # נרמול ל-0-100
    return max(0, min(100, percentage))

def is_angle_in_range(angle: float, min_angle: float, max_angle: float) -> bool:
    """
    בדיקה אם זווית נמצאת בטווח מסוים
    
    Args:
        angle: הזווית לבדיקה
        min_angle: הזווית המינימלית בטווח
        max_angle: הזווית המקסימלית בטווח
        
    Returns:
        bool: True אם הזווית בטווח, False אחרת
    """
    # אם הטווח הפוך, החלף בין מינימום למקסימום
    if min_angle > max_angle:
        min_angle, max_angle = max_angle, min_angle
        
    return min_angle <= angle <= max_angle

def calculate_movement_speed(pt1: Point, pt2: Point, time_diff: float) -> float:
    """
    חישוב מהירות תנועה בין שתי נקודות
    
    Args:
        pt1: נקודת התחלה
        pt2: נקודת סיום
        time_diff: הפרש הזמן בשניות
        
    Returns:
        float: המהירות ביחידות לשנייה
    """
    if time_diff <= 0:
        return 0
        
    # חישוב מרחק אוקלידי
    distance = np.sqrt(
        (pt2.x - pt1.x)**2 + 
        (pt2.y - pt1.y)**2 + 
        (pt2.z - pt1.z)**2
    )
    
    # חישוב המהירות
    return distance / time_diff 