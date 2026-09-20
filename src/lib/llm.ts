import { AGENTS, AGENT_ORDER, jobSystemAddendum, parseMentions } from "./agents";
import { completeChat } from "./complete-chat";
import { useDen } from "./store";
import { wallContext } from "./tickets";
import { uid } from "./utils";
import type { AgentId, JobType, LlmResult, Settings, TableMessage } from "./types";

const CHAT_TIMEOUT_MS = 90_000;
const JOB_TIMEOUT_MS = 120_000;

let chain: Promise<void> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export interface OllamaModel {
  name: string;
  size?: number;
}

export async function probeOllama(
  url: string,
  timeoutMs = 1800,
): Promise<{ ok: true; models: OllamaModel[] } | { ok: false; error: string }> {
  const base = url.replace(/\/$/, "");
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}/api/tags`, { signal: ctrl.signal });
    if (!res.ok) {
      return { ok: false, error: `Ollama answered ${res.status}.` };
    }
    const json = (await res.json()) as { models?: { name: string; size?: number }[] };
    return { ok: true, models: json.models ?? [] };
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "AbortError") {
      return { ok: false, error: "No local Ollama on that URL." };
    }
    return {
      ok: false,
      error:
        "Could not reach Ollama. If this page is remote, the browser may block the call — allow CORS or use Relay.",
    };
  } finally {
    window.clearTimeout(timer);
  }
}

export async function refreshUplink(): Promise<void> {
  const { settings, setUplink } = useDen.getState();
  if (settings.provider === "grok") {
    setUplink("grok", "Relay · crew still talks if local is dark");
    return;
  }
  const probe = await probeOllama(settings.ollamaUrl);
  if (probe.ok) {
    const names = probe.models.map((m) => m.name);
    if (!settings.sharedModel && names[0]) {
      useDen.getState().patchSettings({ sharedModel: stripTag(names[0]) });
    }
    setUplink("ollama", `Local · ${probe.models.length} model${probe.models.length === 1 ? "" : "s"}`);
    return;
  }
  if (settings.provider === "ollama") {
    setUplink("offline", probe.error);
    return;
  }
  setUplink("grok", "Local dark · using relay so the crew still talks");
}

function stripTag(name: string) {
  return name.replace(/:latest$/, "");
}

function modelFor(agentId: AgentId, settings: Settings, fallback: string) {
  if (settings.perAgentModels) {
    return settings.agentModels[agentId] || settings.sharedModel || fallback;
  }
  return settings.sharedModel || fallback;
}

async function ollamaComplete(input: {
  url: string;
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens: number;
  temperature: number;
  timeoutMs: number;
}): Promise<LlmResult> {
  const base = input.url.replace(/\/$/, "");
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), input.timeoutMs);
  try {
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: input.model,
        messages: input.messages,
        temperature: input.temperature,
        max_tokens: input.maxTokens,
        stream: false,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Ollama ${res.status}: ${body.slice(0, 180)}` };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      model?: string;
    };
    const text = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false, error: "Ollama came back empty." };
    return { ok: true, text, source: "ollama", model: json.model ?? input.model };
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "AbortError") return { ok: false, error: "Ollama timed out." };
    return {
      ok: false,
      error: "Ollama call failed. Check CORS (OLLAMA_ORIGINS) and the base URL.",
    };
  } finally {
    window.clearTimeout(timer);
  }
}

async function grokComplete(input: {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens: number;
  temperature: number;
}): Promise<LlmResult> {
  const result = await completeChat({
    data: {
      messages: input.messages,
      maxTokens: input.maxTokens,
      temperature: input.temperature,
    },
  });
  if (!result.ok) return result;
  return result;
}

async function complete(input: {
  agentId: AgentId;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens: number;
  temperature: number;
  timeoutMs: number;
}): Promise<LlmResult> {
  const { settings } = useDen.getState();
  const preferOllama = settings.provider !== "grok";
  const forceOllama = settings.provider === "ollama";

  if (preferOllama) {
    const probe = await probeOllama(settings.ollamaUrl);
    if (probe.ok) {
      const fallback = probe.models[0]?.name ?? "llama3.1";
      const model = modelFor(input.agentId, settings, fallback);
      const result = await ollamaComplete({
        url: settings.ollamaUrl,
        model,
        messages: input.messages,
        maxTokens: input.maxTokens,
        temperature: input.temperature,
        timeoutMs: input.timeoutMs,
      });
      if (result.ok) {
        useDen.getState().setUplink("ollama", `Local · ${model}`);
        return result;
      }
      if (forceOllama) return result;
    } else if (forceOllama) {
      return { ok: false, error: probe.error };
    }
  }

  const result = await grokComplete({
    messages: input.messages,
    maxTokens: input.maxTokens,
    temperature: input.temperature,
  });
  if (result.ok) {
    useDen
      .getState()
      .setUplink("grok", "Relay · point Settings at Ollama to run local");
  }
  return result;
}

function historyPayload(agentId: AgentId, extraSystem?: string) {
  const { threads } = useDen.getState();
  const recent = threads[agentId]
    .filter((m) => m.createdAt !== 0 || m.role === "user")
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content }));
  const system = extraSystem
    ? `${AGENTS[agentId].system}\n\n${extraSystem}`
    : AGENTS[agentId].system;
  return [{ role: "system" as const, content: `${system}\n\n${wallContext(useDen.getState().jobs)}` }, ...recent];
}

export function sendChat(agentId: AgentId, text: string): Promise<LlmResult> {
  return enqueue(async () => {
    const den = useDen.getState();
    den.setBusy(true);
    den.setLastError(null);
    den.setStatus(agentId, "thinking");
    den.pushMessage(agentId, {
      id: `u_${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
      kind: "chat",
    });
    try {
      const result = await complete({
        agentId,
        messages: historyPayload(agentId),
        maxTokens: 900,
        temperature: 0.75,
        timeoutMs: CHAT_TIMEOUT_MS,
      });
      if (result.ok) {
        den.pushMessage(agentId, {
          id: `a_${Date.now()}`,
          role: "assistant",
          content: result.text,
          createdAt: Date.now(),
          kind: "chat",
        });
        den.setStatus(agentId, "idle");
      } else {
        den.setLastError(result.error);
        den.setStatus(agentId, "idle");
      }
      return result;
    } finally {
      useDen.getState().setBusy(false);
    }
  });
}

const TABLE_PASS = /^(pass|silence|\.\.\.|…)\.?$/i;

function tablePayload(agentId: AgentId, extra?: string) {
  const { table } = useDen.getState();
  const recent = table.slice(-20);
  const others = AGENT_ORDER.filter((id) => id !== agentId)
    .map((id) => `${AGENTS[id].handle} (${AGENTS[id].name})`)
    .join(", ");
  const system = `${AGENTS[agentId].system}

ROUND TABLE. You sit with ${others} and the operator in the empty chair.
Speak ONLY as ${AGENTS[agentId].handle}. Never write another operator's lines.
Keep it to 1–4 sentences unless they asked for a work product.
If someone already said your point, reply with exactly PASS.
To hand a beat to another operator, mention them as @HANDLE (ARCHIVE, SPARK, WIRE, GHOST).
${extra ?? ""}

${wallContext(useDen.getState().jobs)}`;

  const messages = recent.map((m) => {
    if (m.speaker === "user") return { role: "user" as const, content: m.content };
    if (m.speaker === agentId) return { role: "assistant" as const, content: m.content };
    const handle = AGENTS[m.speaker].handle;
    const tag = m.kind === "wire" ? "CREW LINE" : "TABLE";
    return { role: "user" as const, content: `[${tag} ${handle}]: ${m.content}` };
  });
  return [{ role: "system" as const, content: system }, ...messages];
}

async function speakAtTable(agentId: AgentId, extra?: string, kind: TableMessage["kind"] = "table"): Promise<string | null> {
  const den = useDen.getState();
  den.setStatus(agentId, "thinking");
  const result = await complete({
    agentId,
    messages: tablePayload(agentId, extra),
    maxTokens: 420,
    temperature: 0.7,
    timeoutMs: CHAT_TIMEOUT_MS,
  });
  den.setStatus(agentId, "idle");
  if (!result.ok) {
    den.setLastError(result.error);
    return null;
  }
  const text = result.text.trim();
  if (!text || TABLE_PASS.test(text)) return null;
  den.pushTable({
    id: uid("tbl"),
    speaker: agentId,
    content: text,
    createdAt: Date.now(),
    kind,
  });
  return text;
}

function uniqueQueue(ids: AgentId[]): AgentId[] {
  const seen = new Set<AgentId>();
  const out: AgentId[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function sendTable(text: string): Promise<void> {
  return enqueue(async () => {
    const den = useDen.getState();
    den.setBusy(true);
    den.setLastError(null);
    den.pushTable({
      id: uid("you"),
      speaker: "user",
      content: text,
      createdAt: Date.now(),
      kind: "table",
    });
    const everyone = /\b(everyone|crew|all of you)\b/i.test(text);
    const tagged = parseMentions(text);
    let queue = uniqueQueue(everyone || tagged.length === 0 ? [...AGENT_ORDER] : tagged);
    const spoken = new Set<AgentId>();
    let extras = 0;
    try {
      while (queue.length) {
        const id = queue.shift()!;
        if (spoken.has(id)) continue;
        const reply = await speakAtTable(id);
        spoken.add(id);
        if (!reply || extras >= 3) continue;
        const pinged = parseMentions(reply).filter((x) => x !== id && !spoken.has(x));
        if (pinged.length) {
          extras += pinged.length;
          queue.push(...pinged);
        }
      }
    } finally {
      useDen.getState().setBusy(false);
    }
  });
}

export function callIn(from: AgentId, to: AgentId): Promise<void> {
  return enqueue(async () => {
    const den = useDen.getState();
    den.setTableOpen(true);
    den.setBusy(true);
    den.setLastError(null);
    const snippet = den.threads[from]
      .filter((m) => m.createdAt)
      .slice(-4)
      .map((m) => `${m.role === "user" ? "Operator" : AGENTS[from].handle}: ${m.content}`)
      .join("\n");
    den.pushTable({
      id: uid("wire"),
      speaker: from,
      content: snippet
        ? `@${AGENTS[to].handle} — I need you on this.\n${snippet}`
        : `@${AGENTS[to].handle} — step in.`,
      createdAt: Date.now(),
      kind: "wire",
    });
    try {
      await speakAtTable(
        to,
        `You were called in by ${AGENTS[from].handle} on the crew line. Answer them. The operator can hear this.`,
        "wire",
      );
    } finally {
      useDen.getState().setBusy(false);
    }
  });
}

export function brainstormObjective(ticketId: string, prompt: string): Promise<void> {
  return enqueue(async () => {
    const den = useDen.getState();
    const ticket = den.jobs.find((j) => j.id === ticketId);
    if (!ticket) return;
    const ask = prompt.trim() || "Brainstorm ways to improve this objective.";
    den.setBusy(true);
    den.setLastError(null);
    den.addNote(ticketId, "user", ask);
    try {
      for (const id of AGENT_ORDER) {
        den.setStatus(id, "thinking");
        const result = await complete({
          agentId: id,
          messages: [
            {
              role: "system",
              content: `${AGENTS[id].system}

You are writing a NOTE on the shared objective wall. The whole crew can see it.
Objective: ${ticket.title}
${ticket.brief ? `Brief: ${ticket.brief}` : ""}
${wallContext(useDen.getState().jobs)}

The operator asked: ${ask}
Write one useful note in 1–4 sentences from your specialty. Do not repeat existing notes. If you have nothing new, reply with exactly PASS.`,
            },
            { role: "user", content: ask },
          ],
          maxTokens: 320,
          temperature: 0.7,
          timeoutMs: CHAT_TIMEOUT_MS,
        });
        den.setStatus(id, "idle");
        if (!result.ok) {
          den.setLastError(result.error);
          break;
        }
        const text = result.text.trim();
        if (text && !TABLE_PASS.test(text)) den.addNote(ticketId, id, text);
      }
    } finally {
      useDen.getState().setBusy(false);
    }
  });
}

export function dispatchJob(input: {
  agentId: AgentId;
  type: JobType;
  title: string;
  brief: string;
}): Promise<LlmResult> {
  return enqueue(async () => {
    const den = useDen.getState();
    const jobId = `job_${Date.now().toString(36)}`;
    const job = {
      id: jobId,
      kind: "job" as const,
      agentId: input.agentId,
      type: input.type,
      title: input.title.trim() || JOB_FALLBACK[input.type],
      brief: input.brief.trim(),
      status: "running" as const,
      notes: [],
      createdAt: Date.now(),
    };
    den.setBusy(true);
    den.setLastError(null);
    den.setStatus(input.agentId, "working");
    den.upsertJob(job);
    den.pushMessage(input.agentId, {
      id: `u_${jobId}`,
      role: "user",
      content: `JOB · ${job.type.toUpperCase()} · ${job.title}\n${job.brief}`,
      createdAt: Date.now(),
      kind: "job",
      jobId,
    });
    try {
      const result = await complete({
        agentId: input.agentId,
        messages: historyPayload(
          input.agentId,
          jobSystemAddendum(job.type, job.title, job.brief),
        ),
        maxTokens: 1400,
        temperature: 0.5,
        timeoutMs: JOB_TIMEOUT_MS,
      });
      if (result.ok) {
        den.upsertJob({
          ...job,
          status: "done",
          result: result.text,
          finishedAt: Date.now(),
        });
        den.pushMessage(input.agentId, {
          id: `a_${jobId}`,
          role: "assistant",
          content: result.text,
          createdAt: Date.now(),
          kind: "job",
          jobId,
        });
        den.setStatus(input.agentId, "done");
        window.setTimeout(() => {
          const cur = useDen.getState();
          if (cur.status[input.agentId] === "done") cur.setStatus(input.agentId, "idle");
        }, 4000);
      } else {
        den.upsertJob({
          ...job,
          status: "error",
          error: result.error,
          finishedAt: Date.now(),
        });
        den.setLastError(result.error);
        den.setStatus(input.agentId, "idle");
      }
      return result;
    } finally {
      useDen.getState().setBusy(false);
    }
  });
}

export function runTicket(jobId: string): Promise<LlmResult> {
  return enqueue(async () => {
    const den = useDen.getState();
    const job = den.jobs.find((j) => j.id === jobId);
    if (!job) return { ok: false, error: "That ticket is gone." };
    if (job.kind === "objective") return { ok: false, error: "Objectives don't run. Add a job under them." };
    if (!job.agentId) return { ok: false, error: "Assign a seat before running." };
    if (!job.type) return { ok: false, error: "Pick a job type first." };
    const agentId = job.agentId;
    const running = { ...job, status: "running" as const };
    den.setBusy(true);
    den.setLastError(null);
    den.setStatus(agentId, "working");
    den.upsertJob(running);
    den.pushMessage(agentId, {
      id: `u_${job.id}`,
      role: "user",
      content: `JOB · ${job.type.toUpperCase()} · ${job.title}\n${job.brief}`,
      createdAt: Date.now(),
      kind: "job",
      jobId: job.id,
    });
    try {
      const result = await complete({
        agentId,
        messages: historyPayload(agentId, jobSystemAddendum(job.type, job.title, job.brief)),
        maxTokens: 1400,
        temperature: 0.5,
        timeoutMs: JOB_TIMEOUT_MS,
      });
      if (result.ok) {
        den.upsertJob({
          ...running,
          status: "done",
          result: result.text,
          finishedAt: Date.now(),
        });
        den.pushMessage(agentId, {
          id: `a_${job.id}_${Date.now().toString(36)}`,
          role: "assistant",
          content: result.text,
          createdAt: Date.now(),
          kind: "job",
          jobId: job.id,
        });
        den.setStatus(agentId, "done");
        window.setTimeout(() => {
          const cur = useDen.getState();
          if (cur.status[agentId] === "done") cur.setStatus(agentId, "idle");
        }, 4000);
      } else {
        den.upsertJob({
          ...running,
          status: "error",
          error: result.error,
          finishedAt: Date.now(),
        });
        den.setLastError(result.error);
        den.setStatus(agentId, "idle");
      }
      return result;
    } finally {
      useDen.getState().setBusy(false);
    }
  });
}

const JOB_FALLBACK: Record<JobType, string> = {
  research: "Open research",
  code: "Code ticket",
  write: "Draft",
  review: "Review pass",
  build: "Build plan",
  brief: "Situation brief",
};
