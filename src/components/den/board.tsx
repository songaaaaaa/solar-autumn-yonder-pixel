import { AGENTS, AGENT_ORDER } from "@/lib/agents";
import { useDen } from "@/lib/store";
import { inboxTickets, liveTickets, traySummary } from "@/lib/tickets";
import type { AgentId } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLOR: Record<AgentId, string> = {
  rook: "var(--color-rook)",
  nyx: "var(--color-nyx)",
  jinx: "var(--color-jinx)",
  echo: "var(--color-echo)",
};

export function Board({
  compact,
  tint,
  onOpen,
}: {
  compact?: boolean;
  tint?: string;
  onOpen?: () => void;
}) {
  const jobs = useDen((s) => s.jobs);
  const live = liveTickets(jobs);
  const inbox = inboxTickets(jobs);
  const trays = traySummary(jobs);
  const pulse = inbox.length > 0;

  return (
    <button
      type="button"
      className={cn("board", compact && "board-compact", pulse && "board-pulse")}
      style={{ ["--board-tint" as string]: tint ?? "var(--color-accent)" }}
      data-slot="table-board"
      aria-label="Open ops board"
      onClick={onOpen}
    >
      <div className="board-glow" />
      <div className="board-column" />
      <div className="board-orbit" />
      <div className="board-orbit board-orbit-slow" />
      <div className="board-screen">
        {live.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center">
            <p className="font-display text-xs tracking-widest text-accent/80">Standby</p>
            <p className="text-xs text-muted">The board is clear</p>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-1 overflow-hidden p-2 text-left">
            {pulse ? (
              <p className="font-display text-xs tracking-widest text-accent">
                Inbox · {inbox.length}
              </p>
            ) : (
              <p className="font-display text-xs tracking-widest text-muted">Live</p>
            )}
            <ul className="min-h-0 flex-1 space-y-1 overflow-hidden">
              {AGENT_ORDER.map((id) => {
                const row = trays[id];
                if (row.count === 0) return null;
                return (
                  <li key={id} className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-xs tracking-widest" style={{ color: COLOR[id] }}>
                      {AGENTS[id].handle}
                    </span>
                    <span className="truncate text-xs text-muted">
                      {row.count} · {row.top}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </button>
  );
}
