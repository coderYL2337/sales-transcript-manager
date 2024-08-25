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
  { id: uuidv4(), text: "Sales Person: Good afternoon! I'm Alex from W Company Window Installation Services. We're offering free assessments for energy-efficient window upgrades. Do you have a moment to chat?", timestamp: 0 },
  { id: uuidv4(), text: "Customer: Actually, I've been thinking about replacing some windows. Please, come in.", timestamp: 5 },
  { id: uuidv4(), text: "Sales Person: These single-pane windows aren't very energy-efficient. We specialize in modern, energy-efficient windows that can reduce your heating and cooling costs. Would you like to hear about our options?", timestamp: 15 },
  { id: uuidv4(), text: "Customer: Yes, what kinds of windows do you offer?", timestamp: 25 },
  { id: uuidv4(), text: "Sales Person: We have double-hung, casement, sliding, and bay windows. All come with double-pane, low-E glass for energy efficiency. Based on your home, I'd recommend our double-hung windows with argon gas filling for better insulation.", timestamp: 30 },
  { id: uuidv4(), text: "Customer: How much would it cost to replace 10 windows?", timestamp: 45 },
  { id: uuidv4(), text: "Sales Person: For 10 standard-sized windows, including installation, it's about $7,000 to $9,000. We have a 15% discount promotion running, which would bring it down to $5,950 to $7,650. Installation usually takes 1-2 days.", timestamp: 50 },
  { id: uuidv4(), text: "Customer: What kind of warranty do you offer?", timestamp: 65 },
  { id: uuidv4(), text: "Sales Person: Lifetime warranty on parts and 5-year warranty on labor. Would you like me to measure and provide an accurate quote?", timestamp: 70 },
  { id: uuidv4(), text: "Customer: Sure, go ahead.", timestamp: 80 },
  { id: uuidv4(), text: "Sales Person: The precise quote is $7,200, or $6,120 with the discount. This includes removal, installation, and clean-up.", timestamp: 100 },
  { id: uuidv4(), text: "Customer: I'll need to discuss this with my spouse before deciding.", timestamp: 110 },
  { id: uuidv4(), text: "Sales Person: Of course. Here's my card with the details. May I follow up next week?", timestamp: 115 },
  { id: uuidv4(), text: "Customer: Yes, that's fine.", timestamp: 120 },
  { id: uuidv4(), text: "Sales Person: Thank you for your time. I look forward to potentially helping you improve your home's energy efficiency.", timestamp: 125 },
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