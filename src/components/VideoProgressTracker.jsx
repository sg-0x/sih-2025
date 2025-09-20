import React, { useState, useRef, useEffect } from 'react';
import PointsService from '../services/PointsService';

function VideoProgressTracker({ videoId, videoType, videoTitle, onProgressUpdate }) {
  const [progress, setProgress] = useState(0);
  const [awardedPoints, setAwardedPoints] = useState([]);
  const videoRef = useRef(null);

  const checkProgress = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      if (duration > 0) {
        const percentage = Math.round((currentTime / duration) * 100);
        setProgress(percentage);
        
        // Check if we've reached a milestone
        checkMilestone(percentage);
        
        if (onProgressUpdate) {
          onProgressUpdate(percentage);
        }
      }
    }
  };

  const checkMilestone = async (percentage) => {
    const milestones = [25, 50, 75, 100];
    const reachedMilestone = milestones.find(milestone => 
      percentage >= milestone && !awardedPoints.includes(milestone)
    );

    if (reachedMilestone) {
      try {
        const userId = PointsService.getCurrentUserId();
        const response = await PointsService.awardPoints(
          userId, 
          videoId, 
          videoType, 
          reachedMilestone
        );
        
        setAwardedPoints(prev => [...prev, reachedMilestone]);
        
        console.log(`🎉 ${reachedMilestone}% milestone reached! Awarded ${response.awardedPoints} points`);
        
        // Show notification (you can customize this)
        if (response.awardedPoints > 0) {
          // You can add a toast notification here
          console.log(`+${response.awardedPoints} points for ${videoTitle}`);
        }
      } catch (error) {
        console.error('Failed to award milestone points:', error);
      }
    }
  };

  const handleTimeUpdate = () => {
    checkProgress();
  };

  const handleLoadedMetadata = () => {
    checkProgress();
  };

  return {
    videoRef,
    progress,
    handleTimeUpdate,
    handleLoadedMetadata,
    awardedPoints
  };
}

export default VideoProgressTracker;
