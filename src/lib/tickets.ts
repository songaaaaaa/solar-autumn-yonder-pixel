import { AGENTS, AGENT_ORDER } from "./agents";
import type { AgentId, JobTicket } from "./types";

export function isLive(ticket: JobTicket): boolean {
  return !ticket.clearedAt;
}

export function liveTickets(jobs: JobTicket[]): JobTicket[] {
  return jobs.filter(isLive);
}

export function liveObjectives(jobs: JobTicket[]): JobTicket[] {
  return liveTickets(jobs).filter((j) => j.kind === "objective");
}

export function inboxTickets(jobs: JobTicket[]): JobTicket[] {
  return liveTickets(jobs).filter((j) => j.agentId === null);
}

export function trayTickets(jobs: JobTicket[], agentId: AgentId): JobTicket[] {
  return liveTickets(jobs).filter((j) => j.agentId === agentId);
}

export function childJobs(jobs: JobTicket[], parentId: string): JobTicket[] {
  return liveTickets(jobs).filter((j) => j.parentId === parentId);
}

export function traySummary(jobs: JobTicket[]): Record<AgentId, { count: number; top: string | null }> {
  const out = {} as Record<AgentId, { count: number; top: string | null }>;
  for (const id of AGENT_ORDER) {
    const list = trayTickets(jobs, id);
    out[id] = { count: list.length, top: list[0]?.title ?? null };
  }
  return out;
}

export function wallContext(jobs: JobTicket[]): string {
  const objs = liveObjectives(jobs).slice(0, 6);
  if (objs.length === 0) {
    return "SHARED OBJECTIVE WALL: empty. The crew cannot see a current goal until one is pinned.";
  }
  const lines = objs.map((o) => {
    const kids = childJobs(jobs, o.id);
    const notes = (o.notes ?? []).slice(-6);
    const noteLines = notes.length
      ? notes
          .map((n) => {
            const who = n.author === "user" ? "Operator" : AGENTS[n.author].handle;
            return `    - ${who}: ${n.content}`;
          })
          .join("\n")
      : "    (no notes yet)";
    const jobLine = kids.length ? kids.map((k) => k.title).join("; ") : "none";
    return `• ${o.title}\n  ${o.brief || "(no brief)"}\n  jobs: ${jobLine}\n  notes:\n${noteLines}`;
  });
  return `SHARED OBJECTIVE WALL (the whole crew can see this; treat it as the group's current goals):\n${lines.join("\n")}`;
}

export function normalizeTicket(raw: Partial<JobTicket> & Pick<JobTicket, "id" | "title" | "brief" | "createdAt">): JobTicket {
  return {
    id: raw.id,
    kind: raw.kind ?? "job",
    agentId: raw.agentId === undefined ? null : raw.agentId,
    parentId: raw.parentId,
    type: raw.type,
    title: raw.title,
    brief: raw.brief,
    status: raw.status ?? (raw.kind === "objective" ? "open" : "queued"),
    result: raw.result,
    error: raw.error,
    notes: raw.notes ?? [],
    createdAt: raw.createdAt,
    finishedAt: raw.finishedAt,
    clearedAt: raw.clearedAt,
  };
}