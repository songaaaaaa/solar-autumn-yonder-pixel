import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AGENTS, AGENT_ORDER } from "@/lib/agents";
import { probeOllama, refreshUplink } from "@/lib/llm";
import type { AgentBackend, AgentId, Provider } from "@/lib/types";
import { useDen } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROVIDERS: { id: Provider; label: string; hint: string }[] = [
  { id: "auto", label: "Auto", hint: "Local first, relay if dark" },
  { id: "ollama", label: "Ollama", hint: "Your machine only" },
  { id: "grok", label: "Relay", hint: "Crew talks even if local is off" },
];

export function SettingsPanel() {
  const open = useDen((s) => s.settingsOpen);
  const settings = useDen((s) => s.settings);
  const uplink = useDen((s) => s.uplink);
  const uplinkDetail = useDen((s) => s.uplinkDetail);
  const patchSettings = useDen((s) => s.patchSettings);
  const setSettingsOpen = useDen((s) => s.setSettingsOpen);
  const [models, setModels] = useState<string[]>([]);
  const [probeMsg, setProbeMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let live = true;
    probeOllama(settings.ollamaUrl).then((r) => {
      if (!live) return;
      if (r.ok) setModels(r.models.map((m) => m.name));
      else setModels([]);
    });
    return () => {
      live = false;
    };
  }, [open, settings.ollamaUrl]);

  if (!open) return null;

  async function testLink() {
    setProbeMsg("Probing…");
    await refreshUplink();
    const r = await probeOllama(useDen.getState().settings.ollamaUrl);
    if (r.ok) {
      setModels(r.models.map((m) => m.name));
      setProbeMsg(
        r.models.length
          ? `Found ${r.models.length} local model${r.models.length === 1 ? "" : "s"}.`
          : "Ollama is up, but no models are pulled yet.",
      );
    } else {
      setProbeMsg(r.error);
    }
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-bg/70 p-3 sm:items-center"
      onClick={() => setSettingsOpen(false)}
    >
      <div
        className="panel flex max-h-panel w-full max-w-lg flex-col overflow-hidden rounded-xl"
        role="dialog"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs tracking-widest text-muted">Uplink</p>
            <h2 id="settings-title" className="font-display text-xl font-medium text-fg">
              Settings
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(false)} aria-label="Close settings">
            <X className="size-5" />
          </Button>
        </div>

        <div className="min-h-0 space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-sm text-muted">
            {uplinkDetail} ({uplink})
          </p>

          <div className="grid grid-cols-3 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  patchSettings({ provider: p.id });
                  void refreshUplink();
                }}
                className={cn(
                  "rounded-md border px-2 py-3 text-left transition-colors",
                  settings.provider === p.id
                    ? "border-accent bg-surface-2"
                    : "border-border hover:bg-surface-2",
                )}
              >
                <span className="block font-display text-sm text-fg">{p.label}</span>
                <span className="block text-xs text-muted">{p.hint}</span>
              </button>
            ))}
          </div>

          <label className="block space-y-1">
            <span className="text-xs text-muted">Ollama base URL</span>
            <input
              value={settings.ollamaUrl}
              onChange={(e) => patchSettings({ ollamaUrl: e.target.value })}
              className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-muted">Shared Ollama model</span>
            <ModelField
              value={settings.sharedModel}
              models={models}
              onChange={(sharedModel) => patchSettings({ sharedModel })}
            />
          </label>

          <div className="space-y-3 rounded-md border border-border p-3">
            <p className="text-sm text-fg">AnythingLLM</p>
            <label className="block space-y-1">
              <span className="text-xs text-muted">Base URL</span>
              <input
                value={settings.anythingllmUrl ?? ""}
                onChange={(e) => patchSettings({ anythingllmUrl: e.target.value })}
                placeholder="http://127.0.0.1:3001"
                className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-muted">API key</span>
              <input
                type="password"
                value={settings.anythingllmKey ?? ""}
                onChange={(e) => patchSettings({ anythingllmKey: e.target.value })}
                placeholder="Paste AnythingLLM key here"
                className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-muted">Workspace slug</span>
              <input
                value={settings.anythingllmSlug ?? ""}
                onChange={(e) => patchSettings({ anythingllmSlug: e.target.value })}
                placeholder="my-workspace"
                className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-md border border-border p-3">
            <p className="text-sm text-fg">Grok (Relay)</p>
            <label className="block space-y-1">
              <span className="text-xs text-muted">xAI API key</span>
              <input
                type="password"
                value={settings.grokApiKey ?? ""}
                onChange={(e) => patchSettings({ grokApiKey: e.target.value })}
                placeholder="xai-... paste here, not in chat"
                className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-muted">Model</span>
              <input
                value={settings.grokModel ?? "grok-4-fast"}
                onChange={(e) => patchSettings({ grokModel: e.target.value })}
                placeholder="grok-4-fast"
                className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
              />
            </label>
            <p className="text-xs text-faint">Get a key at console.x.ai. Stored only in this browser.</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted">Who talks to which backend</p>
            {AGENT_ORDER.map((id) => (
              <label key={id} className="flex items-center justify-between gap-3">
                <span className="text-sm text-fg">{AGENTS[id].handle}</span>
                <select
                  value={settings.agentBackends?.[id] ?? "auto"}
                  onChange={(e) =>
                    patchSettings({
                      agentBackends: {
                        ...settings.agentBackends,
                        [id]: e.target.value as AgentBackend,
                      },
                    })
                  }
                  className="h-10 rounded-md border border-border bg-bg px-2 text-sm text-fg"
                >
                  <option value="auto">Auto</option>
                  <option value="ollama">Ollama</option>
                  <option value="anythingllm">AnythingLLM</option>
                  <option value="grok">Grok</option>
                </select>
              </label>
            ))}
          </div>

          {probeMsg ? <p className="text-sm text-muted">{probeMsg}</p> : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" onClick={() => void testLink()}>
            Test local
          </Button>
          <Button onClick={() => setSettingsOpen(false)}>Done</Button>
        </div>
      </div>
    </div>
  );
}

function ModelField({
  value,
  models,
  onChange,
}: {
  value: string;
  models: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={models[0] ?? "qwen2.5:14b"}
        className="h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
      />
      {models.length > 0 ? (
        <select
          value={models.includes(value) ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-md border border-border bg-bg px-2 text-sm text-fg"
          aria-label="Detected models"
        >
          <option value="" disabled>
            Detected
          </option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
