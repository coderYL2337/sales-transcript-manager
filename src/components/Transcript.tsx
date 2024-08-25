import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './MockTranscriptApi';
interface Comment {
  id: string;
  text: string;
  timestamp: number;
  fileAttachment?: File;
}

interface TranscriptLine {
  id: string;
  text: string;
  timestamp: number;
}

const Transcript: React.FC = () => {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);

  useEffect(() => {
    fetchTranscript();
  }, []);

  useEffect(() => {
    updateSummary();
  }, [transcript, comments]);

  const fetchTranscript = async () => {
    try {
      const response = await fetch('/api/transcript');
      const data = await response.json();
      setTranscript(data);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

  const updateSummary = async () => {
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript, comments }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error updating summary:', error);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer.parentElement;
      if (startNode) {
        const timestamp = Number(startNode.getAttribute('data-timestamp'));
        setSelectedTimestamp(timestamp);
      }
    }
  };

  const handleAddComment = (text: string, timestamp: number, file?: File) => {
    const newComment: Comment = {
      id: uuidv4(),
      text,
      timestamp,
      fileAttachment: file,
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (id: string, text: string, file?: File) => {
    const updatedComments = comments.map(comment => 
      comment.id === id ? { ...comment, text, fileAttachment: file } : comment
    );
    setComments(updatedComments);
  };

  const handleDeleteComment = (id: string) => {
    const updatedComments = comments.filter(comment => comment.id !== id);
    setComments(updatedComments);
  };

  return (
    <div>
      <h2>Transcript</h2>
      <div onMouseUp={handleTextSelection}>
        {transcript.map((line) => (
          <p key={line.id} data-timestamp={line.timestamp}>
            {line.text}
          </p>
        ))}
      </div>

      <div>
        <h3>Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>Timestamp: {comment.timestamp}s</strong>
              <br />
              {comment.text}
            </p>
            {comment.fileAttachment && (
              <p>Attachment: {comment.fileAttachment.name}</p>
            )}
            <button onClick={() => handleEditComment(comment.id, prompt('Edit comment:', comment.text) || '')}>
              Edit
            </button>
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <textarea
          placeholder="Add a comment"
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleAddComment(selectedText, selectedTimestamp || 0, e.target.files[0]);
            }
          }}
        />
        <button
          onClick={() => {
            if (selectedText && selectedTimestamp !== null) {
              handleAddComment(selectedText, selectedTimestamp);
              setSelectedText('');
              setSelectedTimestamp(null);
            }
          }}
        >
          Add Comment
        </button>
      </div>

      <div>
        <h3>Summary</h3>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default Transcript;
