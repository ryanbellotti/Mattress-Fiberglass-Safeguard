export interface MattressBrand {
  id: string;
  brand_name: string;
  model_name?: string;
  contains_fiberglass: boolean;
  fiberglass_history: string;
  year_info?: string;
  risk_level: 'high' | 'medium' | 'low' | 'none';
  citations?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  sources?: { title?: string; uri?: string }[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface CleanupStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}
