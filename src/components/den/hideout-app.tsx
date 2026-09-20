import { useEffect, useState } from "react";
import { AGENT_ORDER } from "@/lib/agents";
import { hydrateDen, useDen } from "@/lib/store";
import { BootScreen } from "./boot-screen";
import { DialogueDock } from "./dialogue";
import { Hud } from "./hud";
import { ObjectivesScreen } from "./objectives-screen";
import { OpsScreen } from "./ops-screen";
import { Scene } from "./scene";
import { SettingsPanel } from "./settings-panel";
import { TableDock } from "./table-dock";

export function HideoutApp() {
  const [intro, setIntro] = useState(true);
  const selected = useDen((s) => s.selected);
  const settingsOpen = useDen((s) => s.settingsOpen);
  const opsOpen = useDen((s) => s.opsOpen);
  const tableOpen = useDen((s) => s.tableOpen);
  const objectivesOpen = useDen((s) => s.objectivesOpen);
  const select = useDen((s) => s.select);
  const setSettingsOpen = useDen((s) => s.setSettingsOpen);
  const setOpsOpen = useDen((s) => s.setOpsOpen);
  const setTableOpen = useDen((s) => s.setTableOpen);
  const setObjectivesOpen = useDen((s) => s.setObjectivesOpen);

  useEffect(() => {
    hydrateDen();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "Escape") {
        if (settingsOpen) {
          setSettingsOpen(false);
          return;
        }
        if (selected) {
          select(null);
          return;
        }
        if (tableOpen) {
          setTableOpen(false);
          return;
        }
        if (objectivesOpen) {
          setObjectivesOpen(false);
          return;
        }
        if (opsOpen) {
          setOpsOpen(false);
          return;
        }
        return;
      }
      if (typing || intro) return;
      if (e.key === "t" || e.key === "T" || e.key === "0") {
        setTableOpen(true);
        return;
      }
      if (e.key === "o" || e.key === "O") {
        setObjectivesOpen(true);
        return;
      }
      const map: Record<string, (typeof AGENT_ORDER)[number]> = {
        "1": "rook",
        "2": "nyx",
        "3": "jinx",
        "4": "echo",
      };
      const id = map[e.key];
      if (id) select(id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    intro,
    objectivesOpen,
    opsOpen,
    select,
    selected,
    setObjectivesOpen,
    setOpsOpen,
    setSettingsOpen,
    setTableOpen,
    settingsOpen,
    tableOpen,
  ]);

  return (
    <div className="relative h-dvh min-h-dvh overflow-hidden bg-bg text-fg">
      <Scene />
      {intro ? <BootScreen onEnter={() => setIntro(false)} /> : null}
      {!intro ? (
        <>
          <Hud />
          <OpsScreen />
          <ObjectivesScreen />
          <TableDock />
          <DialogueDock />
          <SettingsPanel />
        </>
      ) : null}
    </div>
  );
}
