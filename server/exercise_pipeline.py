from typing import List
import numpy as np
from .sideArm.side_arm_raise_evaluator import SideArmRaiseEvaluator

class ExercisePipeline:
    def __init__(self):
        """
        אתחול הצינור (pipeline) עם המעריך המתאים
        """
        self.evaluator = SideArmRaiseEvaluator()

    def process_frames(self, frames: List[np.ndarray]) -> dict:
        """
        מעבד את הפריימים ומחזיר את תוצאות ההערכה
        
        Args:
            frames: רשימה של פריימים (תמונות) מהאפליקציה
            
        Returns:
            dict: מילון עם תוצאות ההערכה בפורמט JSON
        """
        # הערכת התרגיל
        score = self.evaluator.evaluate_exercise(frames)
        
        # המרת התוצאות לפורמט JSON
        results = {
            "overall_score": float(score.overall_score),
            "joint_scores": {k: float(v) for k, v in score.joint_scores.items()},
            "repetition_count": score.repetition_count,
            "completion_percentage": float(score.completion_percentage),
            "feedback": score.feedback
        }
        
        return results

def evaluate_exercise_from_frames(frames: List[np.ndarray]) -> dict:
    """
    פונקציה נוחה לשימוש שמקבלת פריימים ומחזירה תוצאות
    
    Args:
        frames: רשימה של פריימים מהאפליקציה
        
    Returns:
        dict: תוצאות ההערכה בפורמט JSON
    """
    pipeline = ExercisePipeline()
    return pipeline.process_frames(frames) 