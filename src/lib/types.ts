export type AgentId = "rook" | "nyx" | "jinx" | "echo";

export type AgentStatus = "idle" | "thinking" | "working" | "done";

export type JobType = "research" | "code" | "write" | "review" | "build" | "brief";

export type TicketKind = "job" | "objective";

export type TicketStatus = "open" | "queued" | "running" | "done" | "error";

export type Provider = "auto" | "ollama" | "grok";

export type AgentBackend = "ollama" | "anythingllm" | "auto";

export type ChatRole = "user" | "assistant";

export type SpeakerId = "user" | AgentId;

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  kind: "chat" | "job";
  jobId?: string;
}

export interface TableMessage {
  id: string;
  speaker: SpeakerId;
  content: string;
  createdAt: number;
  /** table = open floor. wire = agent-to-agent on the crew line. */
  kind: "table" | "wire";
}

export interface TicketNote {
  id: string;
  author: SpeakerId;
  content: string;
  createdAt: number;
}

export interface JobTicket {
  id: string;
  kind: TicketKind;
  /** null = empty-chair inbox, not yet assigned */
  agentId: AgentId | null;
  parentId?: string;
  type?: JobType;
  title: string;
  brief: string;
  status: TicketStatus;
  result?: string;
  error?: string;
  notes: TicketNote[];
  createdAt: number;
  finishedAt?: number;
  /** Set when the user clears it off the board. */
  clearedAt?: number;
}

export interface Settings {
  provider: Provider;
  ollamaUrl: string;
  sharedModel: string;
  perAgentModels: boolean;
  agentModels: Record<AgentId, string>;
  anythingllmUrl: string;
  anythingllmKey: string;
  anythingllmSlug: string;
  agentBackends: Record<AgentId, AgentBackend>;
}

export interface LlmOk {
  ok: true;
  text: string;
  source: "ollama" | "grok" | "anythingllm";
  model: string;
}

export interface LlmErr {
  ok: false;
  error: string;
}

export type LlmResult = LlmOk | LlmErr;
