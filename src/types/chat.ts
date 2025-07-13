export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  paperReference: {
    title: string;
    authors: string[];
    year: number;
    url: string;
  };
}

export interface ChatSession {
  id: string;
  concept: Concept;
  messages: Message[];
  startedAt: Date;
} 