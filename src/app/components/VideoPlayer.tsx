// components/VideoPlayer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  caption?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, caption }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This ensures the component is only rendered on the client
    setIsMounted(true);
  }, []);

  if (!isMounted || !url) {
    return null; // Optionally, you can render a placeholder or skeleton loader here
  }

  return (
    <div className="video-container mt-2">
      <ReactPlayer url={url} width="100%" />
      {caption && (
        <p className="video-caption text-gray-700 mt-2">
          <em>{caption}</em>
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
