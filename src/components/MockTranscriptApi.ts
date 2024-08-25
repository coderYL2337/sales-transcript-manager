// mockTranscriptApi.ts

import { v4 as uuidv4 } from 'uuid';

export interface TranscriptLine {
  id: string;
  text: string;
  timestamp: number;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
  fileAttachment?: File;
}

const mockTranscript: TranscriptLine[] = [
  { id: uuidv4(), text: "Sales Rep: Good morning! How can I help you today?", timestamp: 0 },
  { id: uuidv4(), text: "Customer: Hi, I'm interested in your software solution.", timestamp: 3 },
  { id: uuidv4(), text: "Sales Rep: Great! Can you tell me more about your needs?", timestamp: 6 },
  { id: uuidv4(), text: "Customer: We're looking for a CRM system to manage our customer interactions.", timestamp: 10 },
  { id: uuidv4(), text: "Sales Rep: Perfect, our CRM solution might be just what you need. Let me tell you about its features...", timestamp: 15 },
];

let mockComments: Comment[] = [];

// Mock fetch function
const mockFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

  if (url === '/api/transcript') {
    return {
      json: async () => mockTranscript,
    } as Response;
  }

  if (url === '/api/summarize') {
    const { transcript, comments } = JSON.parse(options?.body as string);
    const summary = `This is a mock summary. The transcript has ${transcript.length} lines and there are ${comments.length} comments.`;
    return {
      json: async () => ({ summary }),
    } as Response;
  }

  throw new Error(`Unhandled request: ${url}`);
};

// Replace the global fetch with our mock version
(global as any).fetch = mockFetch;

export const addComment = (text: string, timestamp: number, file?: File): Comment => {
  const newComment: Comment = {
    id: uuidv4(),
    text,
    timestamp,
    fileAttachment: file,
  };
  mockComments.push(newComment);
  return newComment;
};

export const editComment = (id: string, text: string, file?: File): Comment | undefined => {
  const commentIndex = mockComments.findIndex(comment => comment.id === id);
  if (commentIndex !== -1) {
    mockComments[commentIndex] = { ...mockComments[commentIndex], text, fileAttachment: file };
    return mockComments[commentIndex];
  }
  return undefined;
};

export const deleteComment = (id: string): void => {
  mockComments = mockComments.filter(comment => comment.id !== id);
};