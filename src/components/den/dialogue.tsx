import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { AGENTS, AGENT_ORDER, JOB_TYPES } from "@/lib/agents";
import { callIn, dispatchJob, sendChat } from "@/lib/llm";
import type { AgentId, JobType } from "@/lib/types";
import { useDen } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";

const COLOR: Record<AgentId, string> = {
  rook: "var(--color-rook)",
  nyx: "var(--color-nyx)",
  jinx: "var(--color-jinx)",
  echo: "var(--color-echo)",
};

export function DialogueDock() {
  const selected = useDen((s) => s.selected);
  if (!selected) return null;
  return <Dock key={selected} agentId={selected} />;
}

function Dock({ agentId }: { agentId: AgentId }) {
  const agent = AGENTS[agentId];
  const messages = useDen((s) => s.threads[agentId]);
  const status = useDen((s) => s.status[agentId]);
  const tab = useDen((s) => s.panelTab);
  const busy = useDen((s) => s.busy);
  const lastError = useDen((s) => s.lastError);
  const opsOpen = useDen((s) => s.opsOpen);
  const select = useDen((s) => s.select);
  const setTableOpen = useDen((s) => s.setTableOpen);
  const setPanelTab = useDen((s) => s.setPanelTab);
  const clearThread = useDen((s) => s.clearThread);
  const [draft, setDraft] = useState("");
  const [jobType, setJobType] = useState<JobType>(agent.jobTypes[0]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobBrief, setJobBrief] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const thinking = status === "thinking" || status === "working";

  async function onChat(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    await sendChat(agentId, text);
  }

  async function onJob(e: FormEvent) {
    e.preventDefault();
    if (!jobBrief.trim() || busy) return;
    await dispatchJob({
      agentId,
      type: jobType,
      title: jobTitle,
      brief: jobBrief,
    });
    setJobTitle("");
    setJobBrief("");
    setPanelTab("talk");
  }

  function onChatKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <aside className={cn("absolute inset-0 z-30 flex flex-col bg-bg/80 md:inset-y-0 md:left-auto md:right-0 md:w-dock md:bg-transparent", opsOpen && "z-50")}>
      <div className="flex h-full min-h-0 flex-col border-border bg-surface/90 md:my-0 md:border-l md:backdrop-blur-sm">
        <div className="flex items-start gap-3 border-b border-border px-4 py-4">
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden" onClick={() => select(null)} aria-label="Back">
            <ArrowLeft className="size-5" />
          </Button>
          <img
            src={agent.portrait}
            alt=""
            className={cn(
              "hidden h-16 w-12 shrink-0 object-cover object-top sm:block",
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xs tracking-widest" style={{ color: COLOR[agentId] }}>
              {agent.handle} · {agent.role}
            </p>
            <h2 className="font-display text-xl font-medium leading-tight text-fg">{agent.name}</h2>
            <p className="truncate text-xs text-muted">{agent.blurb}</p>
          </div>
          <Button
            variant="quiet"
            size="icon"
            onClick={() => clearThread(agentId)}
            aria-label="Clear conversation"
            className="shrink-0"
          >
            <Trash2 className="size-4" />
          </Button>
          <Button
            variant="quiet"
            size="sm"
            className="hidden shrink-0 md:inline-flex"
            onClick={() => setTableOpen(true)}
          >
            Table
          </Button>
          <Button
            variant="quiet"
            size="sm"
            className="hidden shrink-0 md:inline-flex"
            onClick={() => select(null)}
          >
            Close
          </Button>
        </div>

        <div className="flex gap-1 border-b border-border px-4 py-2">
          {(["talk", "job"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPanelTab(id)}
              className={cn(
                "rounded-sm px-3 py-2 text-sm transition-colors duration-150",
                tab === id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
              )}
            >
              {id === "talk" ? "Talk" : "Job"}
            </button>
          ))}
        </div>

        {tab === "talk" ? (
          <>
            <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[92%] rounded-md px-3 py-2",
                      m.role === "user"
                        ? "rounded-br-xs bg-surface-2 text-fg"
                        : "rounded-bl-xs border border-border bg-bg",
                    )}
                    style={
                      m.role === "assistant"
                        ? { borderLeftColor: COLOR[agentId], borderLeftWidth: 2 }
                        : undefined
                    }
                  >
                    {m.kind === "job" && m.role === "user" ? (
                      <p className="mb-1 text-xs text-muted">Job</p>
                    ) : null}
                    {m.role === "assistant" ? (
                      <Markdown text={m.content} />
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {thinking ? (
                <p className="shimmer-text text-xs">
                  {status === "working" ? `${agent.handle} is working` : `${agent.handle} is thinking`}
                </p>
              ) : null}
              {lastError ? <p className="text-sm text-danger">{lastError}</p> : null}
            </div>

            <div className="border-t border-border px-4 py-3">
              <div className="mb-2 flex flex-wrap items-center gap-1">
                <span className="mr-1 text-xs text-muted">Crew line</span>
                {AGENT_ORDER.filter((id) => id !== agentId).map((id) => (
                  <button
                    key={id}
                    type="button"
                    disabled={busy}
                    onClick={() => void callIn(agentId, id)}
                    className="rounded-full border border-border px-3 py-1 font-display text-xs tracking-widest disabled:opacity-40"
                    style={{ color: COLOR[id] }}
                  >
                    Call {AGENTS[id].handle}
                  </button>
                ))}
              </div>
              <div className="mb-2 flex flex-wrap gap-1">
                {agent.prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDraft(p)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:text-fg"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form onSubmit={onChat} className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onChatKey}
                  rows={2}
                  placeholder={`Talk to ${agent.handle}…`}
                  className="min-h-11 flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-border-strong"
                />
                <Button type="submit" size="icon" disabled={busy || !draft.trim()} aria-label="Send">
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <form onSubmit={onJob} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
            <p className="text-sm text-muted">
              {agent.name} will pick this up in-character. On 16GB, jobs share one channel so they run one at a time.
            </p>
            <div className="flex flex-wrap gap-1">
              {JOB_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setJobType(t.id)}
                  className={cn(
                    "rounded-full border px-3 py-2 font-display text-xs tracking-wide transition-colors",
                    jobType === t.id
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border text-muted hover:text-fg",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <label className="block space-y-1">
              <span className="text-xs text-muted">Title</span>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Short ticket name"
                className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint"
              />
            </label>
            <label className="block min-h-0 flex-1 space-y-1">
              <span className="text-xs text-muted">Brief</span>
              <textarea
                value={jobBrief}
                onChange={(e) => setJobBrief(e.target.value)}
                placeholder={JOB_TYPES.find((t) => t.id === jobType)?.hint}
                className="min-h-32 w-full flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint"
              />
            </label>
            {lastError ? <p className="text-sm text-danger">{lastError}</p> : null}
            <Button type="submit" size="lg" disabled={busy || !jobBrief.trim()}>
              {busy ? "Channel busy" : `Dispatch to ${agent.handle}`}
            </Button>
          </form>
        )}
      </div>
    </aside>
  );
}
