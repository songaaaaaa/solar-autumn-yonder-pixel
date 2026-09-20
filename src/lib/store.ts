import { create } from "zustand";
import { AGENTS, AGENT_ORDER } from "./agents";
import { normalizeTicket } from "./tickets";
import { uid } from "./utils";
import type { AgentId, AgentStatus, ChatMessage, JobTicket, Settings, SpeakerId, TableMessage, TicketKind, TicketStatus } from "./types";

const STORAGE_KEY = "nightwire-den-v1";

export const DEFAULT_SETTINGS: Settings = {
  provider: "auto",
  ollamaUrl: "http://127.0.0.1:11434",
  sharedModel: "qwen2.5:14b",
  perAgentModels: false,
  agentModels: { rook: "", nyx: "", jinx: "", echo: "" },
  anythingllmUrl: "http://127.0.0.1:3001",
  anythingllmKey: "",
  anythingllmSlug: "my-workspace",
  agentBackends: {
    rook: "ollama",
    jinx: "ollama",
    nyx: "anythingllm",
    echo: "anythingllm",
  },
};

function emptyThreads(): Record<AgentId, ChatMessage[]> {
  const threads = {} as Record<AgentId, ChatMessage[]>;
  for (const id of AGENT_ORDER) {
    const agent = AGENTS[id];
    threads[id] = [
      {
        id: `greet_${id}`,
        role: "assistant",
        content: agent.greeting,
        createdAt: 0,
        kind: "chat",
      },
    ];
  }
  return threads;
}

function emptyStatus(): Record<AgentId, AgentStatus> {
  return { rook: "idle", nyx: "idle", jinx: "idle", echo: "idle" };
}

export interface DenState {
  booted: boolean;
  hydrated: boolean;
  selected: AgentId | null;
  settingsOpen: boolean;
  opsOpen: boolean;
  tableOpen: boolean;
  objectivesOpen: boolean;
  panelTab: "talk" | "job";
  status: Record<AgentId, AgentStatus>;
  threads: Record<AgentId, ChatMessage[]>;
  table: TableMessage[];
  jobs: JobTicket[];
  settings: Settings;
  uplink: "unknown" | "ollama" | "grok" | "anythingllm" | "offline";
  uplinkDetail: string;
  busy: boolean;
  lastError: string | null;
  boot: () => void;
  select: (id: AgentId | null) => void;
  setPanelTab: (tab: "talk" | "job") => void;
  setSettingsOpen: (open: boolean) => void;
  setOpsOpen: (open: boolean) => void;
  setTableOpen: (open: boolean) => void;
  setObjectivesOpen: (open: boolean) => void;
  setStatus: (id: AgentId, status: AgentStatus) => void;
  pushMessage: (id: AgentId, message: ChatMessage) => void;
  pushTable: (message: TableMessage) => void;
  clearThread: (id: AgentId) => void;
  clearTable: () => void;
  upsertJob: (job: JobTicket) => void;
  addTicket: (input: {
    kind: TicketKind;
    agentId: AgentId | null;
    parentId?: string;
    type?: JobTicket["type"];
    title: string;
    brief: string;
    status?: TicketStatus;
  }) => JobTicket;
  assignTicket: (id: string, agentId: AgentId | null) => void;
  clearTicket: (id: string) => void;
  addNote: (ticketId: string, author: SpeakerId, content: string) => void;
  patchSettings: (patch: Partial<Settings>) => void;
  setUplink: (uplink: DenState["uplink"], detail: string) => void;
  setBusy: (busy: boolean) => void;
  setLastError: (error: string | null) => void;
}

let persistReady = false;

export const useDen = create<DenState>((set) => ({
  booted: false,
  hydrated: false,
  selected: null,
  settingsOpen: false,
  opsOpen: false,
  tableOpen: false,
  objectivesOpen: false,
  panelTab: "talk",
  status: emptyStatus(),
  threads: emptyThreads(),
  table: [],
  jobs: [],
  settings: DEFAULT_SETTINGS,
  uplink: "unknown",
  uplinkDetail: "Auto · local first when you talk",
  busy: false,
  lastError: null,
  boot: () => set({ booted: true }),
  select: (id) =>
    set((s) => ({
      selected: id,
      tableOpen: id ? false : s.tableOpen,
      panelTab: "talk",
      lastError: null,
    })),
  setPanelTab: (panelTab) => set({ panelTab }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setOpsOpen: (opsOpen) => set({ opsOpen }),
  setTableOpen: (tableOpen) =>
    set((s) => ({
      tableOpen,
      selected: tableOpen ? null : s.selected,
    })),
  setObjectivesOpen: (objectivesOpen) => set({ objectivesOpen }),
  setStatus: (id, status) =>
    set((s) => ({ status: { ...s.status, [id]: status } })),
  pushMessage: (id, message) =>
    set((s) => ({
      threads: { ...s.threads, [id]: [...s.threads[id], message] },
    })),
  pushTable: (message) => set((s) => ({ table: [...s.table, message] })),
  clearThread: (id) =>
    set((s) => ({
      threads: {
        ...s.threads,
        [id]: [
          {
            id: `greet_${id}_${Date.now()}`,
            role: "assistant",
            content: AGENTS[id].greeting,
            createdAt: Date.now(),
            kind: "chat",
          },
        ],
      },
    })),
  clearTable: () => set({ table: [] }),
  upsertJob: (job) =>
    set((s) => {
      const idx = s.jobs.findIndex((j) => j.id === job.id);
      if (idx === -1) return { jobs: [job, ...s.jobs] };
      const next = s.jobs.slice();
      next[idx] = job;
      return { jobs: next };
    }),
  addTicket: (input) => {
    const ticket: JobTicket = {
      id: uid(input.kind === "objective" ? "obj" : "job"),
      kind: input.kind,
      agentId: input.agentId,
      parentId: input.parentId,
      type: input.type,
      title: input.title.trim() || (input.kind === "objective" ? "Untitled objective" : "Untitled job"),
      brief: input.brief.trim(),
      status: input.status ?? (input.kind === "objective" ? "open" : "queued"),
      notes: [],
      createdAt: Date.now(),
    };
    set((s) => ({ jobs: [ticket, ...s.jobs] }));
    return ticket;
  },
  assignTicket: (id, agentId) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, agentId } : j)),
    })),
  clearTicket: (id) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, clearedAt: Date.now() } : j)),
    })),
  addNote: (ticketId, author, content) => {
    const text = content.trim();
    if (!text) return;
    set((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === ticketId
          ? {
              ...j,
              notes: [
                ...(j.notes ?? []),
                { id: uid("note"), author, content: text, createdAt: Date.now() },
              ],
            }
          : j,
      ),
    }));
  },
  patchSettings: (patch) =>
    set((s) => ({
      settings: {
        ...s.settings,
        ...patch,
        agentBackends: patch.agentBackends
          ? { ...s.settings.agentBackends, ...patch.agentBackends }
          : s.settings.agentBackends,
        agentModels: patch.agentModels
          ? { ...s.settings.agentModels, ...patch.agentModels }
          : s.settings.agentModels,
      },
    })),
  setUplink: (uplink, uplinkDetail) => set({ uplink, uplinkDetail }),
  setBusy: (busy) => set({ busy }),
  setLastError: (lastError) => set({ lastError }),
}));

export function hydrateDen() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<{
        threads: Record<AgentId, ChatMessage[]>;
        table: TableMessage[];
        jobs: JobTicket[];
        settings: Settings;
      }>;
      const jobs = (parsed.jobs ?? []).map((j) =>
        normalizeTicket({
          ...j,
          id: j.id,
          title: j.title,
          brief: j.brief ?? "",
          createdAt: j.createdAt ?? Date.now(),
        }),
      );
      useDen.setState({
        threads: parsed.threads ?? emptyThreads(),
        table: parsed.table ?? [],
        jobs,
        settings: {
          ...DEFAULT_SETTINGS,
          ...parsed.settings,
          agentBackends: {
            ...DEFAULT_SETTINGS.agentBackends,
            ...(parsed.settings?.agentBackends ?? {}),
          },
          agentModels: {
            ...DEFAULT_SETTINGS.agentModels,
            ...(parsed.settings?.agentModels ?? {}),
          },
        },
        hydrated: true,
      });
    } else {
      useDen.setState({ hydrated: true });
    }
  } catch {
    useDen.setState({ hydrated: true });
  }
  persistReady = true;
}

if (typeof window !== "undefined") {
  useDen.subscribe((state) => {
    if (!persistReady) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          threads: state.threads,
          table: state.table,
          jobs: state.jobs,
          settings: state.settings,
        }),
      );
    } catch {
      /* quota */
    }
  });
}
