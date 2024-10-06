// components/Body.tsx

import React from 'react';

interface BodyProps {
  feedback: string;
  audioUrl?: string;
  jobRole?: string;
  jobLevel?: string;
  id: string;
}

const Body: React.FC<BodyProps> = ({ feedback, audioUrl, jobRole, jobLevel, id }) => {
  return (
    <div>
      <h1>{jobRole} Feedback</h1>
      <h2>Job Level: {jobLevel}</h2>
      <p>{feedback}</p>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default Body;
