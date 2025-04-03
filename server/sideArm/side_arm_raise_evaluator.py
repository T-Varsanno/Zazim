import cv2
import numpy as np
import sys
import os
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass

from ..Core.pose_detection import PoseDetector
from ..Core.exercise_templates import Exercise, ExerciseType, ExerciseJoint, JointRange, ExerciseStage
from ..Core.angle_calculator import Point, calculate_angle, is_angle_in_range, calculate_angle_range
from ..Core.video_processor import Frame, FrameProcessor


@dataclass
class ExerciseScore:
    """
    Class representing exercise score
    """
    overall_score: float  # Overall score (0-100)
    joint_scores: Dict[str, float]  # Scores for each joint
    feedback: List[str]  # Feedback about the exercise
    repetition_count: int  # Number of repetitions performed
    completion_percentage: float  # Completion percentage of the exercise

class SideArmRaiseEvaluator:
    def __init__(self):
        """
        Initialize Side Arm Raise evaluator
        """
        self.exercise = Exercise(
            name="Side Arm Raise",
            exercise_type=ExerciseType.ARM,
            description="הרמת זרוע לצד עם טופס נכון",
            joints=[
                ExerciseJoint(
                    name="Left Shoulder-Hip",
                    landmarks=[24, 12, 14],  # Left hip, shoulder, elbow
                    range=JointRange(min_angle=10, max_angle=100, target_angle=90)
                ),
                ExerciseJoint(
                    name="Left Elbow",
                    landmarks=[16, 14, 12],  # Left wrist, elbow, shoulder
                    range=JointRange(min_angle=155, max_angle=180, target_angle=180)
                )
            ],
            target_repetitions=5,  # Number of repetitions requested
            rest_time=1.0  # Rest time between repetitions in seconds
        )
        self.detector = PoseDetector()
        self.frame_processor = None
        self.processed_frames = []
        self.joint_angles_history = {
            "Left Shoulder-Hip": [],
            "Left Elbow": []
        }
        self.repetition_frames = []  # List of frames that start a new repetition
        
    def process_frames(self, frames: List[np.ndarray]) -> None:
        """
        Process a list of frames
        
        Args:
            frames: List of frames (images)
        """
        # Create a list of frame objects with timestamps
        frame_objects = []
        for i, frame in enumerate(frames):
            frame_objects.append(Frame(image=frame, timestamp=i/30.0))  # Assuming 30 FPS
            
        # Create a frame processor
        self.frame_processor = FrameProcessor(frame_objects)
        
        # Process all frames
        self.processed_frames = self.frame_processor.process_all_frames()
        
        # Extract joint angles from each frame
        for frame in self.processed_frames:
            if frame.landmarks:
                # Calculate joint angles
                for joint in self.exercise.joints:
                    points = []
                    for idx in joint.landmarks:
                        if idx in frame.landmarks:
                            landmark = frame.landmarks[idx]
                            points.append(Point(x=landmark.x, y=landmark.y, z=landmark.z))
                        else:
                            break
                            
                    if len(points) == 3:
                        angle = calculate_angle(points[0], points[1], points[2])
                        self.joint_angles_history[joint.name].append(angle)
                    else:
                        self.joint_angles_history[joint.name].append(None)
            else:
                # If no key points, add None for all joints
                for joint in self.exercise.joints:
                    self.joint_angles_history[joint.name].append(None)
                    
        # Detect repetitions in the exercise
        self._detect_repetitions()
        
    def _detect_repetitions(self) -> None:
        """
        Detect repetitions in the exercise
        """
        # Reset exercise state
        self.exercise.current_stage = ExerciseStage.START
        self.exercise.repetitions = 0
        self.exercise.current_rest_time = 0.0
        
        # Iterate through all frames and update exercise state
        for i, frame in enumerate(self.processed_frames):
            if frame.landmarks:
                # Check if all joints are within allowed range
                all_in_range = True
                for joint in self.exercise.joints:
                    if i < len(self.joint_angles_history[joint.name]) and self.joint_angles_history[joint.name][i] is not None:
                        angle = self.joint_angles_history[joint.name][i]
                        if not is_angle_in_range(angle, joint.range.min_angle, joint.range.max_angle):
                            all_in_range = False
                            break
                    else:
                        all_in_range = False
                        break
                
                # Update exercise state
                if self.exercise.current_stage == ExerciseStage.START and all_in_range:
                    self.exercise.current_stage = ExerciseStage.MIDDLE
                    self.repetition_frames.append(i)
                elif self.exercise.current_stage == ExerciseStage.MIDDLE and not all_in_range:
                    self.exercise.current_stage = ExerciseStage.END
                elif self.exercise.current_stage == ExerciseStage.END and all_in_range:
                    self.exercise.repetitions += 1
                    if self.exercise.repetitions >= self.exercise.target_repetitions:
                        self.exercise.current_stage = ExerciseStage.REST
                    else:
                        self.exercise.current_stage = ExerciseStage.START
                elif self.exercise.current_stage == ExerciseStage.REST:
                    self.exercise.current_rest_time += 1/30  # Assuming 30 FPS
                    if self.exercise.current_rest_time >= self.exercise.rest_time:
                        self.exercise.current_stage = ExerciseStage.START
                        self.exercise.current_rest_time = 0.0
    
    def calculate_score(self) -> ExerciseScore:
        """
        Calculate exercise score
        
        Returns:
            ExerciseScore: Exercise score
        """
        if not self.processed_frames:
            return ExerciseScore(
                overall_score=0,
                joint_scores={},
                feedback=["No frames were detected for processing"],
                repetition_count=0,
                completion_percentage=0
            )
            
        # Calculate scores for each joint
        joint_scores = {}
        feedback = []
        
        for joint in self.exercise.joints:
            # Filter valid values
            valid_angles = [angle for angle in self.joint_angles_history[joint.name] if angle is not None]
            
            if not valid_angles:
                joint_scores[joint.name] = 0
                feedback.append(f"No valid angles detected for joint {joint.name}")
                continue
                
            # Calculate percentage of angles within allowed range
            in_range_count = sum(1 for angle in valid_angles 
                                if is_angle_in_range(angle, joint.range.min_angle, joint.range.max_angle))
            joint_scores[joint.name] = (in_range_count / len(valid_angles)) * 100
            
            # Add feedback
            if joint_scores[joint.name] < 70:
                feedback.append(f"Joint {joint.name} was not within the allowed range most of the time")
                
        # Calculate overall score
        if joint_scores:
            overall_score = sum(joint_scores.values()) / len(joint_scores)
        else:
            overall_score = 0
            
        # Add feedback about repetitions
        if self.exercise.repetitions < self.exercise.target_repetitions:
            feedback.append(f"Only {self.exercise.repetitions} repetitions were completed out of {self.exercise.target_repetitions} requested")
        else:
            feedback.append(f"All {self.exercise.target_repetitions} requested repetitions were completed")
            
        # Calculate completion percentage
        completion_percentage = (self.exercise.repetitions / self.exercise.target_repetitions) * 100
        
        return ExerciseScore(
            overall_score=overall_score,
            joint_scores=joint_scores,
            feedback=feedback,
            repetition_count=self.exercise.repetitions,
            completion_percentage=completion_percentage
        )
        
    def evaluate_exercise(self, frames: List[np.ndarray]) -> ExerciseScore:
        """
        Evaluate Side Arm Raise
        
        Args:
            frames: List of frames (images)
            
        Returns:
            ExerciseScore: Exercise score
        """
        # Process frames
        self.process_frames(frames)
        
        # Calculate score
        return self.calculate_score()
        
    def get_visualization(self, frame_index: int = None) -> np.ndarray:
        """
        Get visualization of the exercise
        
        Args:
            frame_index: Frame index to display (if None, last frame is displayed)
            
        Returns:
            np.ndarray: Frames with visualization
        """
        if not self.processed_frames:
            return np.zeros((480, 640, 3), dtype=np.uint8)
            
        if frame_index is None:
            frame_index = len(self.processed_frames) - 1
            
        if frame_index < 0 or frame_index >= len(self.processed_frames):
            return np.zeros((480, 640, 3), dtype=np.uint8)
            
        # Get frames
        frame = self.processed_frames[frame_index].image.copy()
        
        # Add information about angles
        if self.processed_frames[frame_index].landmarks:
            for joint in self.exercise.joints:
                if frame_index < len(self.joint_angles_history[joint.name]) and self.joint_angles_history[joint.name][frame_index] is not None:
                    angle = self.joint_angles_history[joint.name][frame_index]
                    
                    # Add text with the angle
                    cv2.putText(frame, f"{joint.name}: {angle:.1f}°", 
                               (10, 30 + self.exercise.joints.index(joint) * 30), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                    
                    # Add indicator if the angle is within allowed range
                    if is_angle_in_range(angle, joint.range.min_angle, joint.range.max_angle):
                        cv2.putText(frame, "✓", 
                                   (200, 30 + self.exercise.joints.index(joint) * 30), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                    else:
                        cv2.putText(frame, "✗", 
                                   (200, 30 + self.exercise.joints.index(joint) * 30), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                        
        # Add information about repetitions
        cv2.putText(frame, f"Repetitions: {self.exercise.repetitions}/{self.exercise.target_repetitions}", 
                   (10, frame.shape[0] - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                   
        return frame

def main(frames: List[np.ndarray]) -> Tuple[ExerciseScore, np.ndarray]:
    """
    Main function for evaluating Side Arm Raise
    
    Args:
        frames: List of frames (images) for evaluation
        
    Returns:
        Tuple[ExerciseScore, np.ndarray]: Exercise score and last frame with visualization
    """
    # Create exercise evaluator
    evaluator = SideArmRaiseEvaluator()
    
    # Evaluate exercise
    score = evaluator.evaluate_exercise(frames)
    
    # Get visualization of last frame
    visualization = evaluator.get_visualization()
    
    return score, visualization

if __name__ == "__main__":
    print("Please use main function with a list of frames")
    print("For example: score, visualization = main(frames)") 