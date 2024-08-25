
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './mockTranscriptApi.ts';

interface Comment {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
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
  const [selectedRange, setSelectedRange] = useState<{start: number, end: number} | null>(null);
  const [showCommentButton, setShowCommentButton] = useState(false);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const commentButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchTranscript();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      setSelectedRange({
        start: range.startOffset,
        end: range.endOffset
      });
      setShowCommentButton(true);
    } else {
      setShowCommentButton(false);
    }
  };

  const handleAddComment = () => {
    if (selectedText && selectedRange) {
      const newComment: Comment = {
        id: uuidv4(),
        text: '',
        startIndex: selectedRange.start,
        endIndex: selectedRange.end,
      };
      setComments([...comments, newComment]);
      setActiveComment(newComment.id);
      setShowCommentButton(false);
    }
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
    setActiveComment(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (activeComment && !((event.target as HTMLElement).closest('.comment'))) {
      setActiveComment(null);
    }
  };

  const highlightText = (startIndex: number, endIndex: number) => {
    const transcriptText = transcript.map(line => line.text).join('\n');
    const beforeText = transcriptText.slice(0, startIndex);
    const highlightedText = transcriptText.slice(startIndex, endIndex);
    const afterText = transcriptText.slice(endIndex);

    return (
      <>
        {beforeText}
        <span className="highlighted-text">{highlightedText}</span>
        {afterText}
      </>
    );
  };

  const handleFileOpen = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  };

  return (
    <div className="transcript-container">
      <div className="transcript-content" ref={transcriptRef}>
        <h3>Transcript</h3>
        <div onMouseUp={handleTextSelection}>
          {activeComment 
            ? highlightText(comments.find(c => c.id === activeComment)?.startIndex || 0, 
                            comments.find(c => c.id === activeComment)?.endIndex || 0)
            : transcript.map((line) => (
                <p key={line.id} data-timestamp={line.timestamp}>
                  {line.text}
                </p>
              ))
          }
        </div>
        {showCommentButton && (
          <button
            ref={commentButtonRef}
            className="add-comment-button"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        )}
      </div>

      <div className="comments-sidebar">
        <h3>Comments</h3>
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className={`comment ${activeComment === comment.id ? 'active' : ''}`}
            onClick={() => setActiveComment(comment.id)}
          >
            <p>{comment.text || <em>Add a comment...</em>}</p>
            {activeComment === comment.id && (
              <div className="comment-actions">
                <textarea
                  value={comment.text}
                  onChange={(e) => handleEditComment(comment.id, e.target.value, comment.fileAttachment)}
                  placeholder="Add a comment..."
                />
                <div className="button-group">
                  <input
                    type="file"
                    id={`file-${comment.id}`}
                    className="file-input"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleEditComment(comment.id, comment.text, e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor={`file-${comment.id}`} className="file-label">Choose File</label>
                  <button className="delete-button" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                </div>
                {comment.fileAttachment && (
                  <p className="attachment-info" onClick={() => handleFileOpen(comment.fileAttachment!)}>
                    Attachment: {comment.fileAttachment.name}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="summary-section">
        <h3>Summary</h3>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default Transcript; 
