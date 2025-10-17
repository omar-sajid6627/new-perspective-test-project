export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface ChatOptions {
  responseLength: "short" | "medium" | "long";
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "gemini-pro";
  tone: "professional" | "casual" | "friendly" | "technical";
  temperature: number;
  includeOutline: boolean;
  readingLevel: "beginner" | "intermediate" | "advanced";
}

export interface AIResponse {
  content: string;
  style:
    | "summary"
    | "bullets"
    | "steps"
    | "quip"
    | "definition"
    | "qa"
    | "code";
}

export type ResponseLength = "short" | "medium" | "long";
export type ModelChoice = "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "gemini-pro";
export type Tone = "professional" | "casual" | "friendly" | "technical";
export type ReadingLevel = "beginner" | "intermediate" | "advanced";
