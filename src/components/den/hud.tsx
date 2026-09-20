import { Briefcase, Radio, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDen } from "@/lib/store";
import { liveObjectives, liveTickets } from "@/lib/tickets";
import { cn } from "@/lib/utils";

export function Hud() {
  const uplink = useDen((s) => s.uplink);
  const uplinkDetail = useDen((s) => s.uplinkDetail);
  const jobs = useDen((s) => s.jobs);
  const busy = useDen((s) => s.busy);
  const setSettingsOpen = useDen((s) => s.setSettingsOpen);
  const setOpsOpen = useDen((s) => s.setOpsOpen);
  const setTableOpen = useDen((s) => s.setTableOpen);
  const setObjectivesOpen = useDen((s) => s.setObjectivesOpen);
  const tableOpen = useDen((s) => s.tableOpen);
  const objectivesOpen = useDen((s) => s.objectivesOpen);
  const live = liveTickets(jobs).length;
  const objCount = liveObjectives(jobs).length;

  const link =
    uplink === "ollama" ? "Local" : uplink === "grok" ? "Relay" : uplink === "offline" ? "Dark" : "Idle";

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
      <button
        type="button"
        className={cn(
          "pointer-events-auto panel rounded-lg px-4 py-3 text-left",
          objectivesOpen && "border-accent",
        )}
        onClick={() => setObjectivesOpen(true)}
        aria-label="Current objectives"
      >
        <p className="font-display text-xs tracking-widest text-muted">Nightwire</p>
        <p className="font-display text-lg font-medium leading-tight text-fg">Current objectives</p>
        <p className="text-xs text-muted">{objCount === 0 ? "None pinned" : `${objCount} live`}</p>
      </button>

      <div className="pointer-events-auto flex items-center gap-2">
        <div
          className={cn(
            "hidden items-center gap-2 rounded-md border border-border bg-surface/80 px-3 py-2 sm:flex",
            busy && "border-accent/30",
          )}
        >
          <Radio
            className={cn(
              "size-4 text-muted",
              uplink === "ollama" && "text-rook",
              uplink === "grok" && "text-echo",
              uplink === "offline" && "text-danger",
            )}
          />
          <div className="min-w-0">
            <p className="font-display text-xs text-fg">{link}</p>
            <p className="max-w-48 truncate text-xs text-muted">{uplinkDetail}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className={cn("bg-surface/80", tableOpen && "border-accent")}
          onClick={() => setTableOpen(!tableOpen)}
          aria-label="Address the table"
        >
          <Users className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-surface/80"
          onClick={() => setOpsOpen(true)}
          aria-label="Open ops board"
        >
          <Briefcase className="size-4" />
          {live > 0 ? (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent font-display text-xs text-accent-fg">
              {live}
            </span>
          ) : null}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-surface/80"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          <Settings className="size-4" />
        </Button>
      </div>
    </header>
  );
}