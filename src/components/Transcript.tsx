import React, { useState } from 'react';

interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

const Transcript: React.FC = () => {
  const [transcript, setTranscript] = useState<string>(''); // Example transcript text
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddComment = (text: string, timestamp: number) => {
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      timestamp,
    };
    setComments([...comments, newComment]);
  };

  return (
    <div>
      <h2>Transcript</h2>
      <p>{transcript}</p>

      <div>
        <h3>Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>Timestamp: {comment.timestamp}s</strong>
              <br />
              {comment.text}
            </p>
          </div>
        ))}
      </div>

      <div>
        <textarea
          placeholder="Add a comment"
          onBlur={(e) => handleAddComment(e.target.value, 0)} // Example timestamp
        />
      </div>
    </div>
  );
};

export default Transcript;
