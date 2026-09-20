import { AGENTS, AGENT_ORDER } from "@/lib/agents";
import type { AgentId } from "@/lib/types";
import { useDen } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Board } from "./board";

const COLOR: Record<AgentId, string> = {
  rook: "var(--color-rook)",
  nyx: "var(--color-nyx)",
  jinx: "var(--color-jinx)",
  echo: "var(--color-echo)",
};

export function Scene() {
  const selected = useDen((s) => s.selected);
  const tableOpen = useDen((s) => s.tableOpen);
  const select = useDen((s) => s.select);
  const setOpsOpen = useDen((s) => s.setOpsOpen);
  const tint = selected ? COLOR[selected] : tableOpen ? "var(--color-accent)" : undefined;

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      <img
        src="/art/den.jpg"
        alt="Daylit loft"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="vignette" />

      <div
        className="absolute inset-0 flex flex-col gap-3 px-3 pb-3 pt-24 sm:gap-4 sm:px-6 sm:pb-5 sm:pt-28"
        onClick={(e) => {
          if (e.target === e.currentTarget) select(null);
        }}
      >
        <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-[0.85] items-stretch">
          <Board compact tint={tint} onOpen={() => setOpsOpen(true)} />
        </div>

        <div className="grid h-[48%] min-h-48 w-full max-w-6xl shrink-0 grid-cols-4 gap-2 self-center sm:h-[50%] sm:gap-3">
          {AGENT_ORDER.map((id) => (
            <AgentBox key={id} id={id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentBox({ id }: { id: AgentId }) {
  const agent = AGENTS[id];
  const selected = useDen((s) => s.selected);
  const status = useDen((s) => s.status[id]);
  const select = useDen((s) => s.select);
  const isSel = selected === id;
  const working = status === "working" || status === "thinking";
  const dim = selected !== null && !isSel;

  return (
    <button
      type="button"
      onClick={() => select(id)}
      aria-label={`Talk to ${agent.name}, ${agent.title}`}
      className={cn(
        "agent-glass relative min-h-11 overflow-hidden rounded-lg text-left transition-opacity duration-300 ease-[var(--ease-out-soft)]",
        dim && "opacity-50",
      )}
      data-selected={isSel ? "true" : undefined}
    >
      <img
        src={agent.portrait}
        alt=""
        className="absolute inset-0 size-full object-contain object-top p-2 pb-10"
        draggable={false}
      />
      <span
        className={cn("status-ring", working && "busy-ring")}
        style={{ background: COLOR[id] }}
      />
      <span className="agent-glass-name absolute inset-x-0 bottom-0 px-2 py-2 sm:px-3">
        <span
          className="block font-display text-xs tracking-widest"
          style={{ color: COLOR[id] }}
        >
          {agent.handle}
        </span>
        <span className="block truncate text-sm font-medium text-fg">{agent.name}</span>
        {working ? <span className="shimmer-text text-xs">{status}</span> : null}
      </span>
    </button>
  );
}
