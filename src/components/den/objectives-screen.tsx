import { useState, type FormEvent } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENTS } from "@/lib/agents";
import { brainstormObjective } from "@/lib/llm";
import { useDen } from "@/lib/store";
import { childJobs, liveObjectives } from "@/lib/tickets";
import type { AgentId, JobTicket } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLOR: Record<AgentId, string> = {
  rook: "var(--color-rook)",
  nyx: "var(--color-nyx)",
  jinx: "var(--color-jinx)",
  echo: "var(--color-echo)",
};

const ASK = [
  { id: "improve", label: "Improve this", prompt: "Brainstorm ways to improve this objective." },
  { id: "holes", label: "Find holes", prompt: "What is weak, missing, or likely to fail?" },
  { id: "next", label: "Next steps", prompt: "What should we do next, in order?" },
];

export function ObjectivesScreen() {
  const open = useDen((s) => s.objectivesOpen);
  const jobs = useDen((s) => s.jobs);
  const setObjectivesOpen = useDen((s) => s.setObjectivesOpen);
  const [composing, setComposing] = useState(false);
  const objs = liveObjectives(jobs);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-bg text-fg">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setObjectivesOpen(false)}
            aria-label="Back to table"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="min-w-0">
            <p className="text-xs tracking-widest text-muted">Shared wall</p>
            <h2 className="font-display text-xl font-medium leading-tight text-fg">Current objectives</h2>
          </div>
        </div>
        <Button size="sm" onClick={() => setComposing(true)}>
          <Plus className="size-4" />
          New
        </Button>
      </header>

      {composing ? <NewObjective onClose={() => setComposing(false)} /> : null}

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {objs.length === 0 ? (
          <p className="max-w-lg text-sm text-muted">
            Nothing on the wall. Pin a goal the whole crew can see — then add notes, or ask them to brainstorm.
          </p>
        ) : (
          objs.map((obj) => <ObjectiveCard key={obj.id} ticket={obj} jobs={jobs} />)
        )}
      </div>
    </div>
  );
}

function NewObjective({ onClose }: { onClose: () => void }) {
  const addTicket = useDen((s) => s.addTicket);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() && !brief.trim()) return;
    addTicket({ kind: "objective", agentId: null, title, brief });
    onClose();
  }

  return (
    <form onSubmit={onSubmit} className="shrink-0 border-b border-border bg-surface px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs tracking-widest text-muted">Pin a goal the crew will see</p>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="size-4" />
        </Button>
      </div>
      <label className="block space-y-1">
        <span className="text-xs text-muted">Objective</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint"
          placeholder="What are we actually after"
          autoFocus
        />
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs text-muted">Why it matters</span>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint"
          placeholder="Context the crew should keep in mind."
        />
      </label>
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="quiet" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Pin to the wall</Button>
      </div>
    </form>
  );
}

function ObjectiveCard({ ticket, jobs }: { ticket: JobTicket; jobs: JobTicket[] }) {
  const [draft, setDraft] = useState("");
  const [ask, setAsk] = useState(ASK[0].prompt);
  const addNote = useDen((s) => s.addNote);
  const clearTicket = useDen((s) => s.clearTicket);
  const busy = useDen((s) => s.busy);
  const status = useDen((s) => s.status);
  const kids = childJobs(jobs, ticket.id);
  const notes = ticket.notes ?? [];
  const thinking = (Object.keys(status) as AgentId[]).find((id) => status[id] === "thinking");

  function onNote(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    addNote(ticket.id, "user", draft);
    setDraft("");
  }

  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs tracking-widest text-muted">Objective · {ticket.status}</p>
          <h3 className="font-display text-lg font-medium leading-tight text-fg">{ticket.title}</h3>
          {ticket.brief ? <p className="mt-1 text-sm text-muted">{ticket.brief}</p> : null}
        </div>
        <Button variant="quiet" size="sm" onClick={() => clearTicket(ticket.id)}>
          Clear
        </Button>
      </div>

      {kids.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1">
          {kids.map((job) => (
            <li
              key={job.id}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              {job.title} · {job.status}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 text-xs tracking-widest text-muted">Notes · everyone sees these</p>
        {notes.length === 0 ? (
          <p className="text-xs text-muted">No notes yet.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n) => {
              const handle = n.author === "user" ? "YOU" : AGENTS[n.author].handle;
              const color = n.author === "user" ? undefined : COLOR[n.author];
              return (
                <li key={n.id} className="rounded-md border border-border bg-bg px-3 py-2">
                  <p className="font-display text-xs tracking-widest" style={{ color: color ?? "var(--color-muted)" }}>
                    {handle}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-fg">{n.content}</p>
                </li>
              );
            })}
          </ul>
        )}
        {thinking ? (
          <p className="shimmer-text mt-2 text-xs">{AGENTS[thinking].handle} is writing</p>
        ) : null}
      </div>

      <form onSubmit={onNote} className="mt-3 flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Your note on this objective…"
          className="min-h-11 flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint"
        />
        <Button type="submit" size="sm" disabled={!draft.trim()}>
          Pin note
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-1">
        <span className="mr-1 text-xs text-muted">Ask the crew</span>
        {ASK.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAsk(a.prompt)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              ask === a.prompt ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg",
            )}
          >
            {a.label}
          </button>
        ))}
        <Button
          size="sm"
          variant="quiet"
          disabled={busy}
          onClick={() => void brainstormObjective(ticket.id, ask)}
        >
          Brainstorm
        </Button>
      </div>
    </article>
  );
}