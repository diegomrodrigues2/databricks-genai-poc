
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
}

export interface AppState {
  conversations: Conversation[];
  currentChatId: string | null;
  activeFeature: string;
}

export enum FeatureType {
  FILES = 'FILES',
  AUTOMATIONS = 'AUTOMATIONS',
  RUNS = 'RUNS',
  SETTINGS = 'SETTINGS'
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean; // For UI expansion state
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: number;
}

export interface Run {
  id: string;
  automationId: string;
  status: 'success' | 'failed' | 'running';
  startTime: number;
  duration: string;
}
