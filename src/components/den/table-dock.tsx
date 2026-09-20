import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENTS, AGENT_ORDER } from "@/lib/agents";
import { sendTable } from "@/lib/llm";
import { useDen } from "@/lib/store";
import type { AgentId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

const COLOR: Record<AgentId, string> = {
  rook: "var(--color-rook)",
  nyx: "var(--color-nyx)",
  jinx: "var(--color-jinx)",
  echo: "var(--color-echo)",
};

export function TableDock() {
  const open = useDen((s) => s.tableOpen);
  const table = useDen((s) => s.table);
  const status = useDen((s) => s.status);
  const busy = useDen((s) => s.busy);
  const lastError = useDen((s) => s.lastError);
  const opsOpen = useDen((s) => s.opsOpen);
  const setTableOpen = useDen((s) => s.setTableOpen);
  const clearTable = useDen((s) => s.clearTable);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [table, status]);

  if (!open) return null;

  const thinking = AGENT_ORDER.find((id) => status[id] === "thinking");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    await sendTable(text);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <aside
      className={cn(
        "absolute inset-0 z-30 flex flex-col bg-bg/80 md:inset-y-0 md:left-auto md:right-0 md:w-dock md:bg-transparent",
        opsOpen && "z-50",
      )}
    >
      <div className="flex h-full min-h-0 flex-col border-border bg-surface/90 md:border-l md:backdrop-blur-sm">
        <div className="flex items-start gap-3 border-b border-border px-4 py-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-bg">
            <Users className="size-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xs tracking-widest text-muted">Open floor</p>
            <h2 className="font-display text-xl font-medium leading-tight text-fg">The table</h2>
            <p className="truncate text-xs text-muted">You plus the crew. @ a handle to pull someone in.</p>
          </div>
          <Button variant="quiet" size="icon" onClick={() => clearTable()} aria-label="Clear table">
            <Trash2 className="size-4" />
          </Button>
          <Button variant="quiet" size="sm" onClick={() => setTableOpen(false)}>
            Close
          </Button>
        </div>

        <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {table.length === 0 ? (
            <p className="text-sm text-muted">The table is listening. Speak, or tap a handle to aim it.</p>
          ) : (
            table.map((m) => {
              if (m.speaker === "user") {
                return (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[92%] rounded-md rounded-br-xs bg-surface-2 px-3 py-2 text-sm text-fg">
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              }
              const agent = AGENTS[m.speaker];
              return (
                <div key={m.id} className="flex justify-start">
                  <div
                    className={cn(
                      "max-w-[92%] rounded-md rounded-bl-xs border border-border bg-bg px-3 py-2",
                      m.kind === "wire" && "border-dashed",
                    )}
                    style={{ borderLeftColor: COLOR[m.speaker], borderLeftWidth: 2 }}
                  >
                    <p className="mb-1 font-display text-xs tracking-widest" style={{ color: COLOR[m.speaker] }}>
                      {agent.handle}
                      {m.kind === "wire" ? " · crew line" : ""}
                    </p>
                    <Markdown text={m.content} />
                  </div>
                </div>
              );
            })
          )}
          {thinking ? (
            <p className="shimmer-text text-xs">{AGENTS[thinking].handle} is thinking</p>
          ) : null}
          {lastError ? <p className="text-sm text-danger">{lastError}</p> : null}
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="mb-2 flex flex-wrap gap-1">
            {AGENT_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setDraft((d) => `${d}${d && !d.endsWith(" ") ? " " : ""}@${AGENTS[id].handle} `)}
                className="rounded-full border border-border px-3 py-1 font-display text-xs tracking-widest hover:opacity-80"
                style={{ color: COLOR[id] }}
              >
                @{AGENTS[id].handle}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              rows={2}
              placeholder="Speak to the table…"
              className="min-h-11 flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-border-strong"
            />
            <Button type="submit" size="icon" disabled={busy || !draft.trim()} aria-label="Send to table">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
