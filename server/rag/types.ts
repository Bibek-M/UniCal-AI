export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface RagChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface EventSourceCitation {
  id?: number | string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  department?: string;
  branch?: string[];
  semester?: number[];
  isImportant?: boolean;
}

export interface RagChatResponse {
  success: boolean;
  reply: string;
  sources?: EventSourceCitation[];
  modelUsed?: string;
  timestamp: string;
}

