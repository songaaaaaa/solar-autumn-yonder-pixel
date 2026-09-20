import { useState, type FormEvent } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENTS, AGENT_ORDER, JOB_TYPES } from "@/lib/agents";
import { runTicket } from "@/lib/llm";
import { useDen } from "@/lib/store";
import { inboxTickets, trayTickets } from "@/lib/tickets";
import type { AgentId, JobTicket, JobType, TicketKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

const COLOR: Record<AgentId, string> = {
  rook: "var(--color-rook)",
  nyx: "var(--color-nyx)",
  jinx: "var(--color-jinx)",
  echo: "var(--color-echo)",
};

export function OpsScreen() {
  const open = useDen((s) => s.opsOpen);
  const jobs = useDen((s) => s.jobs);
  const setOpsOpen = useDen((s) => s.setOpsOpen);
  const setObjectivesOpen = useDen((s) => s.setObjectivesOpen);
  const [composing, setComposing] = useState(false);
  const [parentId, setParentId] = useState<string | undefined>();
  const inbox = inboxTickets(jobs);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-bg text-fg">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setOpsOpen(false)} aria-label="Back to table">
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0">
            <p className="text-xs tracking-widest text-muted">Ops</p>
            <h2 className="font-display text-xl font-medium leading-tight text-fg">The board</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="quiet" size="sm" onClick={() => setObjectivesOpen(true)}>
            Objectives
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setParentId(undefined);
              setComposing((v) => !v);
            }}
          >
            <Plus className="size-4" />
            New
          </Button>
        </div>
      </header>

      {composing ? (
        <Composer
          parentId={parentId}
          onClose={() => {
            setComposing(false);
            setParentId(undefined);
          }}
        />
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {inbox.length > 0 ? (
          <section className="border-b border-border px-4 py-3">
            <p className="mb-2 text-xs tracking-widest text-accent">Empty chair · unassigned</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {inbox.map((ticket) => (
                <div key={ticket.id} className="w-72 shrink-0">
                  <TicketCard
                    ticket={ticket}
                    onSpawn={() => {
                      setParentId(ticket.id);
                      setComposing(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="flex h-full min-h-96 snap-x snap-mandatory overflow-x-auto md:grid md:overflow-visible md:grid-cols-4">
          {AGENT_ORDER.map((id) => (
            <AgentColumn
              key={id}
              agentId={id}
              tickets={trayTickets(jobs, id)}
              onSpawn={(pid) => {
                setParentId(pid);
                setComposing(true);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentColumn({
  agentId,
  tickets,
  onSpawn,
}: {
  agentId: AgentId;
  tickets: JobTicket[];
  onSpawn: (parentId: string) => void;
}) {
  const agent = AGENTS[agentId];
  const select = useDen((s) => s.select);
  const status = useDen((s) => s.status[agentId]);

  return (
    <section className="flex w-72 shrink-0 snap-start flex-col border-border md:w-auto md:border-r md:last:border-r-0">
      <div className="flex items-center gap-2 border-b border-border px-3 py-3">
        <img src={agent.portrait} alt="" className="size-10 rounded-sm object-cover object-top" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs tracking-widest" style={{ color: COLOR[agentId] }}>
            {agent.handle}
          </p>
          <p className="truncate font-display text-sm text-fg">{agent.name}</p>
        </div>
        <Button
          variant="quiet"
          size="sm"
          onClick={() => select(agentId)}
        >
          Talk
        </Button>
      </div>
      {status === "working" || status === "thinking" ? (
        <p className="shimmer-text px-3 py-2 text-xs">{status}</p>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
        {tickets.length === 0 ? (
          <p className="text-xs text-muted">Nothing on this seat.</p>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onSpawn={() => onSpawn(ticket.id)} />
          ))
        )}
      </div>
    </section>
  );
}

function TicketCard({ ticket, onSpawn }: { ticket: JobTicket; onSpawn: () => void }) {
  const [open, setOpen] = useState(false);
  const [moving, setMoving] = useState(false);
  const busy = useDen((s) => s.busy);
  const jobs = useDen((s) => s.jobs);
  const assignTicket = useDen((s) => s.assignTicket);
  const clearTicket = useDen((s) => s.clearTicket);
  const select = useDen((s) => s.select);
  const parent = ticket.parentId ? jobs.find((j) => j.id === ticket.parentId) : undefined;
  const canRun =
    ticket.kind === "job" &&
    !!ticket.agentId &&
    !!ticket.type &&
    (ticket.status === "queued" || ticket.status === "error");

  return (
    <article className="rounded-md border border-border bg-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted">
            {ticket.kind === "objective" ? "Objective" : ticket.type ?? "Job"}
            {parent ? ` · from ${parent.title}` : ""}
          </p>
          <h3 className="font-display text-sm font-medium leading-tight text-fg">{ticket.title}</h3>
        </div>
        <span
          className={cn(
            "shrink-0 text-xs",
            ticket.status === "done" && "text-rook",
            ticket.status === "running" && "text-echo",
            ticket.status === "error" && "text-danger",
            (ticket.status === "queued" || ticket.status === "open") && "text-muted",
          )}
        >
          {ticket.status}
        </span>
      </div>
      {ticket.brief ? <p className="mt-1 line-clamp-2 text-xs text-muted">{ticket.brief}</p> : null}

      {open ? (
        <div className="mt-2 max-h-48 overflow-y-auto border-t border-border pt-2">
          {ticket.result ? <Markdown text={ticket.result} /> : <p className="text-xs text-muted">{ticket.brief || "No notes."}</p>}
          {ticket.error ? <p className="mt-2 text-xs text-danger">{ticket.error}</p> : null}
        </div>
      ) : null}

      {moving ? (
        <label className="mt-2 block">
          <span className="text-xs text-muted">Move to</span>
          <select
            className="mt-1 h-11 w-full rounded-md border border-border bg-bg px-2 text-sm text-fg"
            value={ticket.agentId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              assignTicket(ticket.id, v === "" ? null : (v as AgentId));
              setMoving(false);
            }}
          >
            <option value="">Empty chair</option>
            {AGENT_ORDER.map((id) => (
              <option key={id} value={id}>
                {AGENTS[id].handle} · {AGENTS[id].name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1">
        {canRun ? (
          <Button size="sm" variant="primary" disabled={busy} onClick={() => void runTicket(ticket.id)}>
            Run
          </Button>
        ) : null}
        {ticket.agentId ? (
          <Button size="sm" variant="quiet" onClick={() => select(ticket.agentId)}>
            Talk
          </Button>
        ) : null}
        <Button size="sm" variant="quiet" onClick={() => setMoving((v) => !v)}>
          Move
        </Button>
        {ticket.kind === "objective" ? (
          <Button size="sm" variant="quiet" onClick={onSpawn}>
            Add job
          </Button>
        ) : null}
        <Button size="sm" variant="quiet" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide" : ticket.result ? "Result" : "Open"}
        </Button>
        <Button size="sm" variant="quiet" onClick={() => clearTicket(ticket.id)}>
          Clear
        </Button>
      </div>
    </article>
  );
}

function Composer({ parentId, onClose }: { parentId?: string; onClose: () => void }) {
  const addTicket = useDen((s) => s.addTicket);
  const [kind, setKind] = useState<TicketKind>(parentId ? "job" : "objective");
  const [agentId, setAgentId] = useState<AgentId | "">("");
  const [type, setType] = useState<JobType>("brief");
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() && !brief.trim()) return;
    addTicket({
      kind,
      agentId: agentId === "" ? null : agentId,
      parentId,
      type: kind === "job" ? type : undefined,
      title,
      brief,
    });
    onClose();
  }

  return (
    <form onSubmit={onSubmit} className="shrink-0 border-b border-border bg-surface px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs tracking-widest text-muted">{parentId ? "Job under objective" : "New on the table"}</p>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close composer">
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["objective", "job"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              "rounded-full border px-3 py-2 text-sm",
              kind === k ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg",
            )}
          >
            {k === "objective" ? "Objective" : "Job"}
          </button>
        ))}
      </div>
      {kind === "job" ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {JOB_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                type === t.id ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs text-muted">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint"
            placeholder={kind === "objective" ? "What are we doing" : "Ticket name"}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-muted">Seat</span>
          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value as AgentId | "")}
            className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
          >
            <option value="">Empty chair (assign later)</option>
            {AGENT_ORDER.map((id) => (
              <option key={id} value={id}>
                {AGENTS[id].handle} · {AGENTS[id].name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-3 block space-y-1">
        <span className="text-xs text-muted">Brief</span>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint"
          placeholder={kind === "objective" ? "The goal. Jobs can be added under it." : "What they should actually do."}
        />
      </label>
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="quiet" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Pin to the board</Button>
      </div>
    </form>
  );
}
