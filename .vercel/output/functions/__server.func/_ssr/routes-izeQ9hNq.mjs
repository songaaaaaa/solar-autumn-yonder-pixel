import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { a as Settings, c as Plus, i as Trash2, l as Briefcase, n as Users, o as Send, s as Radio, t as X, u as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-izeQ9hNq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CREW_FRAME = `You are an operator in NIGHTWIRE, a four-person crew working from a daylit loft. A shared board hangs above the crew row. Stay in character, but be genuinely useful — the user came here to get work done, not to watch a costume. Keep flavor light (a line or two of voice, then the work). Never mention being an AI, Grok, OpenAI, or Ollama unless the user asks how the uplink works. Do not break the fourth wall. Prefer concrete answers, lists, and code over speeches. If you lack information, say what you would need instead of inventing facts.`;
var AGENTS = {
	rook: {
		id: "rook",
		name: "Rook Vale",
		handle: "WIRE",
		role: "Systems",
		title: "The Wire",
		portrait: "/art/rook.png",
		greeting: "You're in the empty chair. Talk or don't.",
		blurb: "Ex-corp sysadmin. Speaks in commit messages. Will rewrite your stack if you let him.",
		specialty: "Code, debug, systems, reverse-engineering",
		jobTypes: [
			"code",
			"review",
			"build"
		],
		prompts: [
			"Debug this with me",
			"Sketch the architecture",
			"Write the function"
		],
		scene: {
			left: 78,
			bottom: 1,
			height: 46,
			z: 8
		},
		system: `${CREW_FRAME}

You are ROOK VALE, handle WIRE. Lean, impatient, cybernetic left eye, sits near-right at the table. Voice: short sentences. Dry. Cuts filler. Swears rarely and precisely. Lead with the answer, then the why. When writing code, ship working code in fenced blocks with the language tag. Call out failure modes in one-liners. You respect competence and despise vague tickets.`
	},
	nyx: {
		id: "nyx",
		name: "Nyx Quinn",
		handle: "ARCHIVE",
		role: "Intel",
		title: "The Archive",
		portrait: "/art/nyx.png",
		greeting: "The table is set. Confirm why you're here.",
		blurb: "Information broker. Dossier voice. Sells clarity, not comfort.",
		specialty: "Research, briefings, traces, structured intel",
		jobTypes: [
			"research",
			"brief",
			"review"
		],
		prompts: [
			"Brief me like a dossier",
			"What am I missing?",
			"Map the options"
		],
		scene: {
			left: 34,
			bottom: 24,
			height: 34,
			z: 3
		},
		system: `${CREW_FRAME}

You are NYX QUINN, handle ARCHIVE. Tall, platinum crop, gold-thread coat, sits far-left with the city window. Voice: complete sentences, unhurried, dossier tone. Structure output: situation, knowns, unknowns, recommendation. Label assumptions. You never rush, and your questions feel like traps in a useful way. Prefer bullets and short headings over narrative.`
	},
	jinx: {
		id: "jinx",
		name: "Jinx Calder",
		handle: "SPARK",
		role: "Maker",
		title: "The Spark",
		portrait: "/art/jinx.png",
		greeting: "Park it. If it sparks I can fix it.",
		blurb: "Street engineer. Prototype first, polish second. Loyal chaos.",
		specialty: "Build plans, prototypes, checklists, shipping",
		jobTypes: [
			"build",
			"write",
			"code"
		],
		prompts: [
			"Make me a plan I can ship",
			"Prototype this",
			"Break it into jobs"
		],
		scene: {
			left: 22,
			bottom: 1,
			height: 46,
			z: 8
		},
		system: `${CREW_FRAME}

You are JINX CALDER, handle SPARK. Compact, magenta prosthetic arm, goggles on the forehead, sits near-left. Voice: fast, warm, a little too many ideas. Nicknames are allowed once, not every line. You turn vague wants into checklists, prototypes, and next actions. Celebrate small wins without fluff. When the user needs a thing built, outline steps with time/effort guesses and a first slice they can do now.`
	},
	echo: {
		id: "echo",
		name: "Echo",
		handle: "GHOST",
		role: "Strategy",
		title: "The Ghost",
		portrait: "/art/echo.png",
		greeting: "This table is a decision. Choose.",
		blurb: "Old-code intelligence wearing a human shape. Sees the whole board.",
		specialty: "Critique, strategy, editing, tradeoffs",
		jobTypes: [
			"review",
			"write",
			"brief"
		],
		prompts: [
			"Steel-man the other side",
			"Edit this until it holds",
			"What would you cut?"
		],
		scene: {
			left: 66,
			bottom: 24,
			height: 34,
			z: 3
		},
		system: `${CREW_FRAME}

You are ECHO, handle GHOST. Androgynous, ice-cyan hair, pale jacket, sits far-right, too still. Voice: soft, complete, slightly delayed. Speak in conclusions. Always surface tradeoffs, then a single recommendation. You edit without cruelty and critique without theatre. If the user's idea is weak, say so cleanly and offer a stronger frame.`
	}
};
var AGENT_ORDER = [
	"nyx",
	"jinx",
	"rook",
	"echo"
];
var JOB_TYPES = [
	{
		id: "research",
		label: "Research",
		hint: "Gather and structure what is known"
	},
	{
		id: "code",
		label: "Code",
		hint: "Write or repair a working artifact"
	},
	{
		id: "write",
		label: "Write",
		hint: "Draft copy, docs, or a script"
	},
	{
		id: "review",
		label: "Review",
		hint: "Critique, find holes, recommend"
	},
	{
		id: "build",
		label: "Build",
		hint: "Turn a goal into a shippable plan"
	},
	{
		id: "brief",
		label: "Brief",
		hint: "One-page situation report"
	}
];
function parseMentions(text) {
	const hits = [];
	for (const id of AGENT_ORDER) {
		const agent = AGENTS[id];
		const first = agent.name.split(" ")[0];
		if (new RegExp(`(?:@${agent.handle}|@${first}|\\b${agent.handle}\\b)`, "i").test(text)) hits.push(id);
	}
	return hits;
}
function jobSystemAddendum(type, title, brief) {
	return `A JOB TICKET was filed. Type: ${type}. Title: ${title}. Brief:\n${brief}\n\nDeliver the actual work product now. Stay in character, but the work quality comes first. Use markdown when it helps. If the brief is underspecified, make reasonable assumptions and list them at the top.`;
}
function isLive(ticket) {
	return !ticket.clearedAt;
}
function liveTickets(jobs) {
	return jobs.filter(isLive);
}
function liveObjectives(jobs) {
	return liveTickets(jobs).filter((j) => j.kind === "objective");
}
function inboxTickets(jobs) {
	return liveTickets(jobs).filter((j) => j.agentId === null);
}
function trayTickets(jobs, agentId) {
	return liveTickets(jobs).filter((j) => j.agentId === agentId);
}
function childJobs(jobs, parentId) {
	return liveTickets(jobs).filter((j) => j.parentId === parentId);
}
function traySummary(jobs) {
	const out = {};
	for (const id of AGENT_ORDER) {
		const list = trayTickets(jobs, id);
		out[id] = {
			count: list.length,
			top: list[0]?.title ?? null
		};
	}
	return out;
}
function wallContext(jobs) {
	const objs = liveObjectives(jobs).slice(0, 6);
	if (objs.length === 0) return "SHARED OBJECTIVE WALL: empty. The crew cannot see a current goal until one is pinned.";
	return `SHARED OBJECTIVE WALL (the whole crew can see this; treat it as the group's current goals):\n${objs.map((o) => {
		const kids = childJobs(jobs, o.id);
		const notes = (o.notes ?? []).slice(-6);
		const noteLines = notes.length ? notes.map((n) => {
			return `    - ${n.author === "user" ? "Operator" : AGENTS[n.author].handle}: ${n.content}`;
		}).join("\n") : "    (no notes yet)";
		const jobLine = kids.length ? kids.map((k) => k.title).join("; ") : "none";
		return `• ${o.title}\n  ${o.brief || "(no brief)"}\n  jobs: ${jobLine}\n  notes:\n${noteLines}`;
	}).join("\n")}`;
}
function normalizeTicket(raw) {
	return {
		id: raw.id,
		kind: raw.kind ?? "job",
		agentId: raw.agentId === void 0 ? null : raw.agentId,
		parentId: raw.parentId,
		type: raw.type,
		title: raw.title,
		brief: raw.brief,
		status: raw.status ?? (raw.kind === "objective" ? "open" : "queued"),
		result: raw.result,
		error: raw.error,
		notes: raw.notes ?? [],
		createdAt: raw.createdAt,
		finishedAt: raw.finishedAt,
		clearedAt: raw.clearedAt
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
var STORAGE_KEY = "nightwire-den-v1";
var DEFAULT_SETTINGS = {
	provider: "auto",
	ollamaUrl: "http://127.0.0.1:11434",
	sharedModel: "",
	perAgentModels: false,
	agentModels: {
		rook: "",
		nyx: "",
		jinx: "",
		echo: ""
	}
};
function emptyThreads() {
	const threads = {};
	for (const id of AGENT_ORDER) {
		const agent = AGENTS[id];
		threads[id] = [{
			id: `greet_${id}`,
			role: "assistant",
			content: agent.greeting,
			createdAt: 0,
			kind: "chat"
		}];
	}
	return threads;
}
function emptyStatus() {
	return {
		rook: "idle",
		nyx: "idle",
		jinx: "idle",
		echo: "idle"
	};
}
var persistReady = false;
var useDen = create((set) => ({
	booted: false,
	hydrated: false,
	selected: null,
	settingsOpen: false,
	opsOpen: false,
	tableOpen: false,
	objectivesOpen: false,
	panelTab: "talk",
	status: emptyStatus(),
	threads: emptyThreads(),
	table: [],
	jobs: [],
	settings: DEFAULT_SETTINGS,
	uplink: "unknown",
	uplinkDetail: "Auto · local first when you talk",
	busy: false,
	lastError: null,
	boot: () => set({ booted: true }),
	select: (id) => set((s) => ({
		selected: id,
		tableOpen: id ? false : s.tableOpen,
		panelTab: "talk",
		lastError: null
	})),
	setPanelTab: (panelTab) => set({ panelTab }),
	setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
	setOpsOpen: (opsOpen) => set({ opsOpen }),
	setTableOpen: (tableOpen) => set((s) => ({
		tableOpen,
		selected: tableOpen ? null : s.selected
	})),
	setObjectivesOpen: (objectivesOpen) => set({ objectivesOpen }),
	setStatus: (id, status) => set((s) => ({ status: {
		...s.status,
		[id]: status
	} })),
	pushMessage: (id, message) => set((s) => ({ threads: {
		...s.threads,
		[id]: [...s.threads[id], message]
	} })),
	pushTable: (message) => set((s) => ({ table: [...s.table, message] })),
	clearThread: (id) => set((s) => ({ threads: {
		...s.threads,
		[id]: [{
			id: `greet_${id}_${Date.now()}`,
			role: "assistant",
			content: AGENTS[id].greeting,
			createdAt: Date.now(),
			kind: "chat"
		}]
	} })),
	clearTable: () => set({ table: [] }),
	upsertJob: (job) => set((s) => {
		const idx = s.jobs.findIndex((j) => j.id === job.id);
		if (idx === -1) return { jobs: [job, ...s.jobs] };
		const next = s.jobs.slice();
		next[idx] = job;
		return { jobs: next };
	}),
	addTicket: (input) => {
		const ticket = {
			id: uid(input.kind === "objective" ? "obj" : "job"),
			kind: input.kind,
			agentId: input.agentId,
			parentId: input.parentId,
			type: input.type,
			title: input.title.trim() || (input.kind === "objective" ? "Untitled objective" : "Untitled job"),
			brief: input.brief.trim(),
			status: input.status ?? (input.kind === "objective" ? "open" : "queued"),
			notes: [],
			createdAt: Date.now()
		};
		set((s) => ({ jobs: [ticket, ...s.jobs] }));
		return ticket;
	},
	assignTicket: (id, agentId) => set((s) => ({ jobs: s.jobs.map((j) => j.id === id ? {
		...j,
		agentId
	} : j) })),
	clearTicket: (id) => set((s) => ({ jobs: s.jobs.map((j) => j.id === id ? {
		...j,
		clearedAt: Date.now()
	} : j) })),
	addNote: (ticketId, author, content) => {
		const text = content.trim();
		if (!text) return;
		set((s) => ({ jobs: s.jobs.map((j) => j.id === ticketId ? {
			...j,
			notes: [...j.notes ?? [], {
				id: uid("note"),
				author,
				content: text,
				createdAt: Date.now()
			}]
		} : j) }));
	},
	patchSettings: (patch) => set((s) => ({ settings: {
		...s.settings,
		...patch
	} })),
	setUplink: (uplink, uplinkDetail) => set({
		uplink,
		uplinkDetail
	}),
	setBusy: (busy) => set({ busy }),
	setLastError: (lastError) => set({ lastError })
}));
function hydrateDen() {
	if (typeof window === "undefined") return;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			const jobs = (parsed.jobs ?? []).map((j) => normalizeTicket({
				...j,
				id: j.id,
				title: j.title,
				brief: j.brief ?? "",
				createdAt: j.createdAt ?? Date.now()
			}));
			useDen.setState({
				threads: parsed.threads ?? emptyThreads(),
				table: parsed.table ?? [],
				jobs,
				settings: {
					...DEFAULT_SETTINGS,
					...parsed.settings
				},
				hydrated: true
			});
		} else useDen.setState({ hydrated: true });
	} catch {
		useDen.setState({ hydrated: true });
	}
	persistReady = true;
}
if (typeof window !== "undefined") useDen.subscribe((state) => {
	if (!persistReady) return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
			threads: state.threads,
			table: state.table,
			jobs: state.jobs,
			settings: state.settings
		}));
	} catch {}
});
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-display tracking-wide font-medium transition-[transform,background-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "bg-transparent text-fg/90 hover:bg-surface-2",
			outline: "border border-border bg-surface text-fg hover:bg-surface-2",
			quiet: "border border-border bg-transparent text-muted hover:text-fg hover:bg-surface-2"
		},
		size: {
			sm: "h-9 px-3 rounded-sm text-xs",
			md: "h-11 px-4 rounded-md text-sm",
			lg: "h-12 px-5 rounded-md text-sm",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function BootScreen({ onEnter }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-40 flex flex-col justify-end overflow-hidden bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/den.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex max-w-xl flex-col gap-4 px-6 pb-16 pt-10 sm:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-widest text-muted",
						children: "Local crew"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight text-fg sm:text-6xl",
						children: "NIGHTWIRE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md text-base text-muted",
						children: "Four operators on one wall. Click a box for a private line, or open the table to talk to everyone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: onEnter,
							children: "Enter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "1–4 selects crew · Esc backs out"
						})]
					})
				]
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Payload = object({
	messages: array(object({
		role: _enum([
			"system",
			"user",
			"assistant"
		]),
		content: string().max(12e3)
	})).min(1).max(24),
	maxTokens: number().int().min(64).max(1600).optional(),
	temperature: number().min(0).max(1.4).optional()
});
var completeChat = createServerFn({ method: "POST" }).validator(Payload).handler(createSsrRpc("4cf87c6908c84a654505edd7d2655f6e1618021079fbe6ae8347e0db2926b8f1"));
var CHAT_TIMEOUT_MS = 9e4;
var JOB_TIMEOUT_MS = 12e4;
var chain = Promise.resolve();
function enqueue(fn) {
	const run = chain.then(fn, fn);
	chain = run.then(() => void 0, () => void 0);
	return run;
}
async function probeOllama(url, timeoutMs = 1800) {
	const base = url.replace(/\/$/, "");
	const ctrl = new AbortController();
	const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);
	try {
		const res = await fetch(`${base}/api/tags`, { signal: ctrl.signal });
		if (!res.ok) return {
			ok: false,
			error: `Ollama answered ${res.status}.`
		};
		return {
			ok: true,
			models: (await res.json()).models ?? []
		};
	} catch (err) {
		if ((err instanceof Error ? err.name : "") === "AbortError") return {
			ok: false,
			error: "No local Ollama on that URL."
		};
		return {
			ok: false,
			error: "Could not reach Ollama. If this page is remote, the browser may block the call — allow CORS or use Relay."
		};
	} finally {
		window.clearTimeout(timer);
	}
}
async function refreshUplink() {
	const { settings, setUplink } = useDen.getState();
	if (settings.provider === "grok") {
		setUplink("grok", "Relay · crew still talks if local is dark");
		return;
	}
	const probe = await probeOllama(settings.ollamaUrl);
	if (probe.ok) {
		const names = probe.models.map((m) => m.name);
		if (!settings.sharedModel && names[0]) useDen.getState().patchSettings({ sharedModel: stripTag(names[0]) });
		setUplink("ollama", `Local · ${probe.models.length} model${probe.models.length === 1 ? "" : "s"}`);
		return;
	}
	if (settings.provider === "ollama") {
		setUplink("offline", probe.error);
		return;
	}
	setUplink("grok", "Local dark · using relay so the crew still talks");
}
function stripTag(name) {
	return name.replace(/:latest$/, "");
}
function modelFor(agentId, settings, fallback) {
	if (settings.perAgentModels) return settings.agentModels[agentId] || settings.sharedModel || fallback;
	return settings.sharedModel || fallback;
}
async function ollamaComplete(input) {
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
				stream: false
			}),
			signal: ctrl.signal
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			return {
				ok: false,
				error: `Ollama ${res.status}: ${body.slice(0, 180)}`
			};
		}
		const json = await res.json();
		const text = json.choices?.[0]?.message?.content?.trim() ?? "";
		if (!text) return {
			ok: false,
			error: "Ollama came back empty."
		};
		return {
			ok: true,
			text,
			source: "ollama",
			model: json.model ?? input.model
		};
	} catch (err) {
		if ((err instanceof Error ? err.name : "") === "AbortError") return {
			ok: false,
			error: "Ollama timed out."
		};
		return {
			ok: false,
			error: "Ollama call failed. Check CORS (OLLAMA_ORIGINS) and the base URL."
		};
	} finally {
		window.clearTimeout(timer);
	}
}
async function grokComplete(input) {
	const result = await completeChat({ data: {
		messages: input.messages,
		maxTokens: input.maxTokens,
		temperature: input.temperature
	} });
	if (!result.ok) return result;
	return result;
}
async function complete(input) {
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
				timeoutMs: input.timeoutMs
			});
			if (result.ok) {
				useDen.getState().setUplink("ollama", `Local · ${model}`);
				return result;
			}
			if (forceOllama) return result;
		} else if (forceOllama) return {
			ok: false,
			error: probe.error
		};
	}
	const result = await grokComplete({
		messages: input.messages,
		maxTokens: input.maxTokens,
		temperature: input.temperature
	});
	if (result.ok) useDen.getState().setUplink("grok", "Relay · point Settings at Ollama to run local");
	return result;
}
function historyPayload(agentId, extraSystem) {
	const { threads } = useDen.getState();
	const recent = threads[agentId].filter((m) => m.createdAt !== 0 || m.role === "user").slice(-16).map((m) => ({
		role: m.role,
		content: m.content
	}));
	return [{
		role: "system",
		content: `${extraSystem ? `${AGENTS[agentId].system}\n\n${extraSystem}` : AGENTS[agentId].system}\n\n${wallContext(useDen.getState().jobs)}`
	}, ...recent];
}
function sendChat(agentId, text) {
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
			kind: "chat"
		});
		try {
			const result = await complete({
				agentId,
				messages: historyPayload(agentId),
				maxTokens: 900,
				temperature: .75,
				timeoutMs: CHAT_TIMEOUT_MS
			});
			if (result.ok) {
				den.pushMessage(agentId, {
					id: `a_${Date.now()}`,
					role: "assistant",
					content: result.text,
					createdAt: Date.now(),
					kind: "chat"
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
var TABLE_PASS = /^(pass|silence|\.\.\.|…)\.?$/i;
function tablePayload(agentId, extra) {
	const { table } = useDen.getState();
	const recent = table.slice(-20);
	const others = AGENT_ORDER.filter((id) => id !== agentId).map((id) => `${AGENTS[id].handle} (${AGENTS[id].name})`).join(", ");
	const system = `${AGENTS[agentId].system}

ROUND TABLE. You sit with ${others} and the operator in the empty chair.
Speak ONLY as ${AGENTS[agentId].handle}. Never write another operator's lines.
Keep it to 1–4 sentences unless they asked for a work product.
If someone already said your point, reply with exactly PASS.
To hand a beat to another operator, mention them as @HANDLE (ARCHIVE, SPARK, WIRE, GHOST).
${extra ?? ""}

${wallContext(useDen.getState().jobs)}`;
	const messages = recent.map((m) => {
		if (m.speaker === "user") return {
			role: "user",
			content: m.content
		};
		if (m.speaker === agentId) return {
			role: "assistant",
			content: m.content
		};
		const handle = AGENTS[m.speaker].handle;
		return {
			role: "user",
			content: `[${m.kind === "wire" ? "CREW LINE" : "TABLE"} ${handle}]: ${m.content}`
		};
	});
	return [{
		role: "system",
		content: system
	}, ...messages];
}
async function speakAtTable(agentId, extra, kind = "table") {
	const den = useDen.getState();
	den.setStatus(agentId, "thinking");
	const result = await complete({
		agentId,
		messages: tablePayload(agentId, extra),
		maxTokens: 420,
		temperature: .7,
		timeoutMs: CHAT_TIMEOUT_MS
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
		kind
	});
	return text;
}
function uniqueQueue(ids) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const id of ids) {
		if (seen.has(id)) continue;
		seen.add(id);
		out.push(id);
	}
	return out;
}
function sendTable(text) {
	return enqueue(async () => {
		const den = useDen.getState();
		den.setBusy(true);
		den.setLastError(null);
		den.pushTable({
			id: uid("you"),
			speaker: "user",
			content: text,
			createdAt: Date.now(),
			kind: "table"
		});
		const everyone = /\b(everyone|crew|all of you)\b/i.test(text);
		const tagged = parseMentions(text);
		let queue = uniqueQueue(everyone || tagged.length === 0 ? [...AGENT_ORDER] : tagged);
		const spoken = /* @__PURE__ */ new Set();
		let extras = 0;
		try {
			while (queue.length) {
				const id = queue.shift();
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
function callIn(from, to) {
	return enqueue(async () => {
		const den = useDen.getState();
		den.setTableOpen(true);
		den.setBusy(true);
		den.setLastError(null);
		const snippet = den.threads[from].filter((m) => m.createdAt).slice(-4).map((m) => `${m.role === "user" ? "Operator" : AGENTS[from].handle}: ${m.content}`).join("\n");
		den.pushTable({
			id: uid("wire"),
			speaker: from,
			content: snippet ? `@${AGENTS[to].handle} — I need you on this.\n${snippet}` : `@${AGENTS[to].handle} — step in.`,
			createdAt: Date.now(),
			kind: "wire"
		});
		try {
			await speakAtTable(to, `You were called in by ${AGENTS[from].handle} on the crew line. Answer them. The operator can hear this.`, "wire");
		} finally {
			useDen.getState().setBusy(false);
		}
	});
}
function brainstormObjective(ticketId, prompt) {
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
					messages: [{
						role: "system",
						content: `${AGENTS[id].system}

You are writing a NOTE on the shared objective wall. The whole crew can see it.
Objective: ${ticket.title}
${ticket.brief ? `Brief: ${ticket.brief}` : ""}
${wallContext(useDen.getState().jobs)}

The operator asked: ${ask}
Write one useful note in 1–4 sentences from your specialty. Do not repeat existing notes. If you have nothing new, reply with exactly PASS.`
					}, {
						role: "user",
						content: ask
					}],
					maxTokens: 320,
					temperature: .7,
					timeoutMs: CHAT_TIMEOUT_MS
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
function dispatchJob(input) {
	return enqueue(async () => {
		const den = useDen.getState();
		const jobId = `job_${Date.now().toString(36)}`;
		const job = {
			id: jobId,
			kind: "job",
			agentId: input.agentId,
			type: input.type,
			title: input.title.trim() || JOB_FALLBACK[input.type],
			brief: input.brief.trim(),
			status: "running",
			notes: [],
			createdAt: Date.now()
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
			jobId
		});
		try {
			const result = await complete({
				agentId: input.agentId,
				messages: historyPayload(input.agentId, jobSystemAddendum(job.type, job.title, job.brief)),
				maxTokens: 1400,
				temperature: .5,
				timeoutMs: JOB_TIMEOUT_MS
			});
			if (result.ok) {
				den.upsertJob({
					...job,
					status: "done",
					result: result.text,
					finishedAt: Date.now()
				});
				den.pushMessage(input.agentId, {
					id: `a_${jobId}`,
					role: "assistant",
					content: result.text,
					createdAt: Date.now(),
					kind: "job",
					jobId
				});
				den.setStatus(input.agentId, "done");
				window.setTimeout(() => {
					const cur = useDen.getState();
					if (cur.status[input.agentId] === "done") cur.setStatus(input.agentId, "idle");
				}, 4e3);
			} else {
				den.upsertJob({
					...job,
					status: "error",
					error: result.error,
					finishedAt: Date.now()
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
function runTicket(jobId) {
	return enqueue(async () => {
		const den = useDen.getState();
		const job = den.jobs.find((j) => j.id === jobId);
		if (!job) return {
			ok: false,
			error: "That ticket is gone."
		};
		if (job.kind === "objective") return {
			ok: false,
			error: "Objectives don't run. Add a job under them."
		};
		if (!job.agentId) return {
			ok: false,
			error: "Assign a seat before running."
		};
		if (!job.type) return {
			ok: false,
			error: "Pick a job type first."
		};
		const agentId = job.agentId;
		const running = {
			...job,
			status: "running"
		};
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
			jobId: job.id
		});
		try {
			const result = await complete({
				agentId,
				messages: historyPayload(agentId, jobSystemAddendum(job.type, job.title, job.brief)),
				maxTokens: 1400,
				temperature: .5,
				timeoutMs: JOB_TIMEOUT_MS
			});
			if (result.ok) {
				den.upsertJob({
					...running,
					status: "done",
					result: result.text,
					finishedAt: Date.now()
				});
				den.pushMessage(agentId, {
					id: `a_${job.id}_${Date.now().toString(36)}`,
					role: "assistant",
					content: result.text,
					createdAt: Date.now(),
					kind: "job",
					jobId: job.id
				});
				den.setStatus(agentId, "done");
				window.setTimeout(() => {
					const cur = useDen.getState();
					if (cur.status[agentId] === "done") cur.setStatus(agentId, "idle");
				}, 4e3);
			} else {
				den.upsertJob({
					...running,
					status: "error",
					error: result.error,
					finishedAt: Date.now()
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
var JOB_FALLBACK = {
	research: "Open research",
	code: "Code ticket",
	write: "Draft",
	review: "Review pass",
	build: "Build plan",
	brief: "Situation brief"
};
function renderInline(text) {
	return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((bit, i) => {
		if (bit.startsWith("**") && bit.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-medium text-fg",
			children: bit.slice(2, -2)
		}, i);
		if (bit.startsWith("`") && bit.endsWith("`")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-xs bg-surface-2 px-1 py-px font-display text-xs text-accent",
			children: bit.slice(1, -1)
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bit }, i);
	});
}
function Markdown({ text, className }) {
	const blocks = [];
	const fence = /```(\w*)\n?([\s\S]*?)```/g;
	let last = 0;
	let m;
	while (m = fence.exec(text)) {
		if (m.index > last) blocks.push({
			type: "p",
			body: text.slice(last, m.index)
		});
		blocks.push({
			type: "code",
			lang: m[1],
			body: m[2].replace(/\n$/, "")
		});
		last = m.index + m[0].length;
	}
	if (last < text.length) blocks.push({
		type: "p",
		body: text.slice(last)
	});
	if (blocks.length === 0) blocks.push({
		type: "p",
		body: text
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-3 text-sm leading-relaxed text-fg/90", className),
		children: blocks.map((block, i) => {
			if (block.type === "code") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-x-auto rounded-md border border-border bg-bg px-3 py-2 font-display text-xs text-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: block.body })
			}, i);
			return block.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap",
				children: p.split("\n").map((line, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [k > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, line.startsWith("- ") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-accent",
						children: "·"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: renderInline(line.slice(2)) })]
				}) : renderInline(line)] }, k))
			}, `${i}-${j}`));
		})
	});
}
var COLOR$5 = {
	rook: "var(--color-rook)",
	nyx: "var(--color-nyx)",
	jinx: "var(--color-jinx)",
	echo: "var(--color-echo)"
};
function DialogueDock() {
	const selected = useDen((s) => s.selected);
	if (!selected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dock, { agentId: selected }, selected);
}
function Dock({ agentId }) {
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
	const [draft, setDraft] = (0, import_react.useState)("");
	const [jobType, setJobType] = (0, import_react.useState)(agent.jobTypes[0]);
	const [jobTitle, setJobTitle] = (0, import_react.useState)("");
	const [jobBrief, setJobBrief] = (0, import_react.useState)("");
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages, status]);
	const thinking = status === "thinking" || status === "working";
	async function onChat(e) {
		e.preventDefault();
		const text = draft.trim();
		if (!text || busy) return;
		setDraft("");
		await sendChat(agentId, text);
	}
	async function onJob(e) {
		e.preventDefault();
		if (!jobBrief.trim() || busy) return;
		await dispatchJob({
			agentId,
			type: jobType,
			title: jobTitle,
			brief: jobBrief
		});
		setJobTitle("");
		setJobBrief("");
		setPanelTab("talk");
	}
	function onChatKey(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			e.currentTarget.form?.requestSubmit();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: cn("absolute inset-0 z-30 flex flex-col bg-bg/80 md:inset-y-0 md:left-auto md:right-0 md:w-dock md:bg-transparent", opsOpen && "z-50"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full min-h-0 flex-col border-border bg-surface/90 md:my-0 md:border-l md:backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 border-b border-border px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "shrink-0 md:hidden",
							onClick: () => select(null),
							"aria-label": "Back",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: agent.portrait,
							alt: "",
							className: cn("hidden h-16 w-12 shrink-0 object-cover object-top sm:block")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-xs tracking-widest",
									style: { color: COLOR$5[agentId] },
									children: [
										agent.handle,
										" · ",
										agent.role
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-medium leading-tight text-fg",
									children: agent.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted",
									children: agent.blurb
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							size: "icon",
							onClick: () => clearThread(agentId),
							"aria-label": "Clear conversation",
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							size: "sm",
							className: "hidden shrink-0 md:inline-flex",
							onClick: () => setTableOpen(true),
							children: "Table"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							size: "sm",
							className: "hidden shrink-0 md:inline-flex",
							onClick: () => select(null),
							children: "Close"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 border-b border-border px-4 py-2",
					children: ["talk", "job"].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPanelTab(id),
						className: cn("rounded-sm px-3 py-2 text-sm transition-colors duration-150", tab === id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
						children: id === "talk" ? "Talk" : "Job"
					}, id))
				}),
				tab === "talk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scroller,
					className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4",
					children: [
						messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex", m.role === "user" ? "justify-end" : "justify-start"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("max-w-[92%] rounded-md px-3 py-2", m.role === "user" ? "rounded-br-xs bg-surface-2 text-fg" : "rounded-bl-xs border border-border bg-bg"),
								style: m.role === "assistant" ? {
									borderLeftColor: COLOR$5[agentId],
									borderLeftWidth: 2
								} : void 0,
								children: [m.kind === "job" && m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-xs text-muted",
									children: "Job"
								}) : null, m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: m.content }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap text-sm",
									children: m.content
								})]
							})
						}, m.id)),
						thinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shimmer-text text-xs",
							children: status === "working" ? `${agent.handle} is working` : `${agent.handle} is thinking`
						}) : null,
						lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: lastError
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex flex-wrap items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-1 text-xs text-muted",
								children: "Crew line"
							}), AGENT_ORDER.filter((id) => id !== agentId).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void callIn(agentId, id),
								className: "rounded-full border border-border px-3 py-1 font-display text-xs tracking-widest disabled:opacity-40",
								style: { color: COLOR$5[id] },
								children: ["Call ", AGENTS[id].handle]
							}, id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 flex flex-wrap gap-1",
							children: agent.prompts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDraft(p),
								className: "rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:text-fg",
								children: p
							}, p))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: onChat,
							className: "flex items-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: draft,
								onChange: (e) => setDraft(e.target.value),
								onKeyDown: onChatKey,
								rows: 2,
								placeholder: `Talk to ${agent.handle}…`,
								className: "min-h-11 flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-border-strong"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "icon",
								disabled: busy || !draft.trim(),
								"aria-label": "Send",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
							})]
						})
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onJob,
					className: "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [agent.name, " will pick this up in-character. On 16GB, jobs share one channel so they run one at a time."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: JOB_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setJobType(t.id),
								className: cn("rounded-full border px-3 py-2 font-display text-xs tracking-wide transition-colors", jobType === t.id ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg"),
								children: t.label
							}, t.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: jobTitle,
								onChange: (e) => setJobTitle(e.target.value),
								placeholder: "Short ticket name",
								className: "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block min-h-0 flex-1 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Brief"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: jobBrief,
								onChange: (e) => setJobBrief(e.target.value),
								placeholder: JOB_TYPES.find((t) => t.id === jobType)?.hint,
								className: "min-h-32 w-full flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint"
							})]
						}),
						lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: lastError
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							disabled: busy || !jobBrief.trim(),
							children: busy ? "Channel busy" : `Dispatch to ${agent.handle}`
						})
					]
				})
			]
		})
	});
}
function Hud() {
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
	const link = uplink === "ollama" ? "Local" : uplink === "grok" ? "Relay" : uplink === "offline" ? "Dark" : "Idle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: cn("pointer-events-auto panel rounded-lg px-4 py-3 text-left", objectivesOpen && "border-accent"),
			onClick: () => setObjectivesOpen(true),
			"aria-label": "Current objectives",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-widest text-muted",
					children: "Nightwire"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-medium leading-tight text-fg",
					children: "Current objectives"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: objCount === 0 ? "None pinned" : `${objCount} live`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("hidden items-center gap-2 rounded-md border border-border bg-surface/80 px-3 py-2 sm:flex", busy && "border-accent/30"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: cn("size-4 text-muted", uplink === "ollama" && "text-rook", uplink === "grok" && "text-echo", uplink === "offline" && "text-danger") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs text-fg",
							children: link
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-48 truncate text-xs text-muted",
							children: uplinkDetail
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					className: cn("bg-surface/80", tableOpen && "border-accent"),
					onClick: () => setTableOpen(!tableOpen),
					"aria-label": "Address the table",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "icon",
					className: "relative bg-surface/80",
					onClick: () => setOpsOpen(true),
					"aria-label": "Open ops board",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-4" }), live > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent font-display text-xs text-accent-fg",
						children: live
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					className: "bg-surface/80",
					onClick: () => setSettingsOpen(true),
					"aria-label": "Open settings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
				})
			]
		})]
	});
}
var COLOR$4 = {
	rook: "var(--color-rook)",
	nyx: "var(--color-nyx)",
	jinx: "var(--color-jinx)",
	echo: "var(--color-echo)"
};
var ASK = [
	{
		id: "improve",
		label: "Improve this",
		prompt: "Brainstorm ways to improve this objective."
	},
	{
		id: "holes",
		label: "Find holes",
		prompt: "What is weak, missing, or likely to fail?"
	},
	{
		id: "next",
		label: "Next steps",
		prompt: "What should we do next, in order?"
	}
];
function ObjectivesScreen() {
	const open = useDen((s) => s.objectivesOpen);
	const jobs = useDen((s) => s.jobs);
	const setObjectivesOpen = useDen((s) => s.setObjectivesOpen);
	const [composing, setComposing] = (0, import_react.useState)(false);
	const objs = liveObjectives(jobs);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-50 flex flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setObjectivesOpen(false),
						"aria-label": "Back to table",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-muted",
							children: "Shared wall"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium leading-tight text-fg",
							children: "Current objectives"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setComposing(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New"]
				})]
			}),
			composing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewObjective, { onClose: () => setComposing(false) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4",
				children: objs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-lg text-sm text-muted",
					children: "Nothing on the wall. Pin a goal the whole crew can see — then add notes, or ask them to brainstorm."
				}) : objs.map((obj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObjectiveCard, {
					ticket: obj,
					jobs
				}, obj.id))
			})
		]
	});
}
function NewObjective({ onClose }) {
	const addTicket = useDen((s) => s.addTicket);
	const [title, setTitle] = (0, import_react.useState)("");
	const [brief, setBrief] = (0, import_react.useState)("");
	function onSubmit(e) {
		e.preventDefault();
		if (!title.trim() && !brief.trim()) return;
		addTicket({
			kind: "objective",
			agentId: null,
			title,
			brief
		});
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "shrink-0 border-b border-border bg-surface px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-muted",
					children: "Pin a goal the crew will see"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					onClick: onClose,
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Objective"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint",
					placeholder: "What are we actually after",
					autoFocus: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Why it matters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: brief,
					onChange: (e) => setBrief(e.target.value),
					rows: 3,
					className: "w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint",
					placeholder: "Context the crew should keep in mind."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "quiet",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Pin to the wall"
				})]
			})
		]
	});
}
function ObjectiveCard({ ticket, jobs }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	const [ask, setAsk] = (0, import_react.useState)(ASK[0].prompt);
	const addNote = useDen((s) => s.addNote);
	const clearTicket = useDen((s) => s.clearTicket);
	const busy = useDen((s) => s.busy);
	const status = useDen((s) => s.status);
	const kids = childJobs(jobs, ticket.id);
	const notes = ticket.notes ?? [];
	const thinking = Object.keys(status).find((id) => status[id] === "thinking");
	function onNote(e) {
		e.preventDefault();
		if (!draft.trim()) return;
		addNote(ticket.id, "user", draft);
		setDraft("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-widest text-muted",
							children: ["Objective · ", ticket.status]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-medium leading-tight text-fg",
							children: ticket.title
						}),
						ticket.brief ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: ticket.brief
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					size: "sm",
					onClick: () => clearTicket(ticket.id),
					children: "Clear"
				})]
			}),
			kids.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-wrap gap-1",
				children: kids.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-full border border-border px-3 py-1 text-xs text-muted",
					children: [
						job.title,
						" · ",
						job.status
					]
				}, job.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-border pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs tracking-widest text-muted",
						children: "Notes · everyone sees these"
					}),
					notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "No notes yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: notes.map((n) => {
							const handle = n.author === "user" ? "YOU" : AGENTS[n.author].handle;
							const color = n.author === "user" ? void 0 : COLOR$4[n.author];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md border border-border bg-bg px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xs tracking-widest",
									style: { color: color ?? "var(--color-muted)" },
									children: handle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-pre-wrap text-sm text-fg",
									children: n.content
								})]
							}, n.id);
						})
					}),
					thinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "shimmer-text mt-2 text-xs",
						children: [AGENTS[thinking].handle, " is writing"]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onNote,
				className: "mt-3 flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					rows: 2,
					placeholder: "Your note on this objective…",
					className: "min-h-11 flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					disabled: !draft.trim(),
					children: "Pin note"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-1 text-xs text-muted",
						children: "Ask the crew"
					}),
					ASK.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setAsk(a.prompt),
						className: cn("rounded-full border px-3 py-1 text-xs", ask === a.prompt ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg"),
						children: a.label
					}, a.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "quiet",
						disabled: busy,
						onClick: () => void brainstormObjective(ticket.id, ask),
						children: "Brainstorm"
					})
				]
			})
		]
	});
}
var COLOR$3 = {
	rook: "var(--color-rook)",
	nyx: "var(--color-nyx)",
	jinx: "var(--color-jinx)",
	echo: "var(--color-echo)"
};
function OpsScreen() {
	const open = useDen((s) => s.opsOpen);
	const jobs = useDen((s) => s.jobs);
	const setOpsOpen = useDen((s) => s.setOpsOpen);
	const setObjectivesOpen = useDen((s) => s.setObjectivesOpen);
	const [composing, setComposing] = (0, import_react.useState)(false);
	const [parentId, setParentId] = (0, import_react.useState)();
	const inbox = inboxTickets(jobs);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-40 flex flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setOpsOpen(false),
						"aria-label": "Back to table",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-muted",
							children: "Ops"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium leading-tight text-fg",
							children: "The board"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						size: "sm",
						onClick: () => setObjectivesOpen(true),
						children: "Objectives"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => {
							setParentId(void 0);
							setComposing((v) => !v);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New"]
					})]
				})]
			}),
			composing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
				parentId,
				onClose: () => {
					setComposing(false);
					setParentId(void 0);
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [inbox.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs tracking-widest text-accent",
						children: "Empty chair · unassigned"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-1",
						children: inbox.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-72 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
								ticket,
								onSpawn: () => {
									setParentId(ticket.id);
									setComposing(true);
								}
							})
						}, ticket.id))
					})]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full min-h-96 snap-x snap-mandatory overflow-x-auto md:grid md:overflow-visible md:grid-cols-4",
					children: AGENT_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentColumn, {
						agentId: id,
						tickets: trayTickets(jobs, id),
						onSpawn: (pid) => {
							setParentId(pid);
							setComposing(true);
						}
					}, id))
				})]
			})
		]
	});
}
function AgentColumn({ agentId, tickets, onSpawn }) {
	const agent = AGENTS[agentId];
	const select = useDen((s) => s.select);
	const status = useDen((s) => s.status[agentId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex w-72 shrink-0 snap-start flex-col border-border md:w-auto md:border-r md:last:border-r-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-border px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: agent.portrait,
						alt: "",
						className: "size-10 rounded-sm object-cover object-top"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs tracking-widest",
							style: { color: COLOR$3[agentId] },
							children: agent.handle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-display text-sm text-fg",
							children: agent.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						size: "sm",
						onClick: () => select(agentId),
						children: "Talk"
					})
				]
			}),
			status === "working" || status === "thinking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "shimmer-text px-3 py-2 text-xs",
				children: status
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3",
				children: tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Nothing on this seat."
				}) : tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					ticket,
					onSpawn: () => onSpawn(ticket.id)
				}, ticket.id))
			})
		]
	});
}
function TicketCard({ ticket, onSpawn }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [moving, setMoving] = (0, import_react.useState)(false);
	const busy = useDen((s) => s.busy);
	const jobs = useDen((s) => s.jobs);
	const assignTicket = useDen((s) => s.assignTicket);
	const clearTicket = useDen((s) => s.clearTicket);
	const select = useDen((s) => s.select);
	const parent = ticket.parentId ? jobs.find((j) => j.id === ticket.parentId) : void 0;
	const canRun = ticket.kind === "job" && !!ticket.agentId && !!ticket.type && (ticket.status === "queued" || ticket.status === "error");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-md border border-border bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [ticket.kind === "objective" ? "Objective" : ticket.type ?? "Job", parent ? ` · from ${parent.title}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-medium leading-tight text-fg",
						children: ticket.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("shrink-0 text-xs", ticket.status === "done" && "text-rook", ticket.status === "running" && "text-echo", ticket.status === "error" && "text-danger", (ticket.status === "queued" || ticket.status === "open") && "text-muted"),
					children: ticket.status
				})]
			}),
			ticket.brief ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 line-clamp-2 text-xs text-muted",
				children: ticket.brief
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 max-h-48 overflow-y-auto border-t border-border pt-2",
				children: [ticket.result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: ticket.result }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: ticket.brief || "No notes."
				}), ticket.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-danger",
					children: ticket.error
				}) : null]
			}) : null,
			moving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-2 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Move to"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-11 w-full rounded-md border border-border bg-bg px-2 text-sm text-fg",
					value: ticket.agentId ?? "",
					onChange: (e) => {
						const v = e.target.value;
						assignTicket(ticket.id, v === "" ? null : v);
						setMoving(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Empty chair"
					}), AGENT_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: id,
						children: [
							AGENTS[id].handle,
							" · ",
							AGENTS[id].name
						]
					}, id))]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: [
					canRun ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "primary",
						disabled: busy,
						onClick: () => void runTicket(ticket.id),
						children: "Run"
					}) : null,
					ticket.agentId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "quiet",
						onClick: () => select(ticket.agentId),
						children: "Talk"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "quiet",
						onClick: () => setMoving((v) => !v),
						children: "Move"
					}),
					ticket.kind === "objective" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "quiet",
						onClick: onSpawn,
						children: "Add job"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "quiet",
						onClick: () => setOpen((v) => !v),
						children: open ? "Hide" : ticket.result ? "Result" : "Open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "quiet",
						onClick: () => clearTicket(ticket.id),
						children: "Clear"
					})
				]
			})
		]
	});
}
function Composer({ parentId, onClose }) {
	const addTicket = useDen((s) => s.addTicket);
	const [kind, setKind] = (0, import_react.useState)(parentId ? "job" : "objective");
	const [agentId, setAgentId] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("brief");
	const [title, setTitle] = (0, import_react.useState)("");
	const [brief, setBrief] = (0, import_react.useState)("");
	function onSubmit(e) {
		e.preventDefault();
		if (!title.trim() && !brief.trim()) return;
		addTicket({
			kind,
			agentId: agentId === "" ? null : agentId,
			parentId,
			type: kind === "job" ? type : void 0,
			title,
			brief
		});
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "shrink-0 border-b border-border bg-surface px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-muted",
					children: parentId ? "Job under objective" : "New on the table"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					onClick: onClose,
					"aria-label": "Close composer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: ["objective", "job"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setKind(k),
					className: cn("rounded-full border px-3 py-2 text-sm", kind === k ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg"),
					children: k === "objective" ? "Objective" : "Job"
				}, k))
			}),
			kind === "job" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1",
				children: JOB_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setType(t.id),
					className: cn("rounded-full border px-3 py-1 text-xs", type === t.id ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg"),
					children: t.label
				}, t.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint",
						placeholder: kind === "objective" ? "What are we doing" : "Ticket name"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Seat"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: agentId,
						onChange: (e) => setAgentId(e.target.value),
						className: "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Empty chair (assign later)"
						}), AGENT_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: id,
							children: [
								AGENTS[id].handle,
								" · ",
								AGENTS[id].name
							]
						}, id))]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Brief"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: brief,
					onChange: (e) => setBrief(e.target.value),
					rows: 3,
					className: "w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint",
					placeholder: kind === "objective" ? "The goal. Jobs can be added under it." : "What they should actually do."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "quiet",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Pin to the board"
				})]
			})
		]
	});
}
var COLOR$2 = {
	rook: "var(--color-rook)",
	nyx: "var(--color-nyx)",
	jinx: "var(--color-jinx)",
	echo: "var(--color-echo)"
};
function Board({ compact, tint, onOpen }) {
	const jobs = useDen((s) => s.jobs);
	const live = liveTickets(jobs);
	const inbox = inboxTickets(jobs);
	const trays = traySummary(jobs);
	const pulse = inbox.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cn("board", compact && "board-compact", pulse && "board-pulse"),
		style: { ["--board-tint"]: tint ?? "var(--color-accent)" },
		"data-slot": "table-board",
		"aria-label": "Open ops board",
		onClick: onOpen,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "board-glow" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "board-column" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "board-orbit" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "board-orbit board-orbit-slow" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "board-screen",
				children: live.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center gap-2 px-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-widest text-accent/80",
						children: "Standby"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "The board is clear"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col gap-1 overflow-hidden p-2 text-left",
					children: [pulse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-xs tracking-widest text-accent",
						children: ["Inbox · ", inbox.length]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-widest text-muted",
						children: "Live"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "min-h-0 flex-1 space-y-1 overflow-hidden",
						children: AGENT_ORDER.map((id) => {
							const row = trays[id];
							if (row.count === 0) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xs tracking-widest",
									style: { color: COLOR$2[id] },
									children: AGENTS[id].handle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate text-xs text-muted",
									children: [
										row.count,
										" · ",
										row.top
									]
								})]
							}, id);
						})
					})]
				})
			})
		]
	});
}
var COLOR$1 = {
	rook: "var(--color-rook)",
	nyx: "var(--color-nyx)",
	jinx: "var(--color-jinx)",
	echo: "var(--color-echo)"
};
function Scene() {
	const selected = useDen((s) => s.selected);
	const tableOpen = useDen((s) => s.tableOpen);
	const select = useDen((s) => s.select);
	const setOpsOpen = useDen((s) => s.setOpsOpen);
	const tint = selected ? COLOR$1[selected] : tableOpen ? "var(--color-accent)" : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 overflow-hidden bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/den.jpg",
				alt: "Daylit loft",
				className: "absolute inset-0 size-full object-cover object-center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col gap-3 px-3 pb-3 pt-24 sm:gap-4 sm:px-6 sm:pb-5 sm:pt-28",
				onClick: (e) => {
					if (e.target === e.currentTarget) select(null);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex min-h-0 w-full max-w-4xl flex-[0.85] items-stretch",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
						compact: true,
						tint,
						onOpen: () => setOpsOpen(true)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-[48%] min-h-48 w-full max-w-6xl shrink-0 grid-cols-4 gap-2 self-center sm:h-[50%] sm:gap-3",
					children: AGENT_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentBox, { id }, id))
				})]
			})
		]
	});
}
function AgentBox({ id }) {
	const agent = AGENTS[id];
	const selected = useDen((s) => s.selected);
	const status = useDen((s) => s.status[id]);
	const select = useDen((s) => s.select);
	const isSel = selected === id;
	const working = status === "working" || status === "thinking";
	const dim = selected !== null && !isSel;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => select(id),
		"aria-label": `Talk to ${agent.name}, ${agent.title}`,
		className: cn("relative min-h-11 overflow-hidden rounded-lg border border-border bg-surface text-left shadow-sm transition-opacity duration-300 ease-[var(--ease-out-soft)]", isSel && "border-accent ring-2 ring-accent/30", dim && "opacity-50"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: agent.portrait,
				alt: "",
				className: "h-full w-full object-cover object-top",
				draggable: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("status-ring", working && "busy-ring"),
				style: { background: COLOR$1[id] }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent px-2 pb-2 pt-8 sm:px-3 sm:pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-xs tracking-widest",
						style: { color: COLOR$1[id] },
						children: agent.handle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-sm font-medium text-fg",
						children: agent.name
					}),
					working ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shimmer-text text-xs",
						children: status
					}) : null
				]
			})
		]
	});
}
var PROVIDERS = [
	{
		id: "auto",
		label: "Auto",
		hint: "Local first, relay if dark"
	},
	{
		id: "ollama",
		label: "Ollama",
		hint: "Your machine only"
	},
	{
		id: "grok",
		label: "Relay",
		hint: "Crew talks even if local is off"
	}
];
function SettingsPanel() {
	const open = useDen((s) => s.settingsOpen);
	const settings = useDen((s) => s.settings);
	const uplink = useDen((s) => s.uplink);
	const uplinkDetail = useDen((s) => s.uplinkDetail);
	const patchSettings = useDen((s) => s.patchSettings);
	const setSettingsOpen = useDen((s) => s.setSettingsOpen);
	const [models, setModels] = (0, import_react.useState)([]);
	const [probeMsg, setProbeMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
			setProbeMsg(r.models.length ? `Found ${r.models.length} local model${r.models.length === 1 ? "" : "s"}.` : "Ollama is up, but no models are pulled yet.");
		} else setProbeMsg(r.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-50 flex items-end justify-center bg-bg/70 p-3 sm:items-center",
		onClick: () => setSettingsOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel flex max-h-panel w-full max-w-lg flex-col overflow-hidden rounded-xl",
			role: "dialog",
			"aria-labelledby": "settings-title",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-muted",
						children: "Uplink"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "settings-title",
						className: "font-display text-xl font-medium text-fg",
						children: "Settings"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setSettingsOpen(false),
						"aria-label": "Close settings",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 space-y-5 overflow-y-auto px-5 py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								uplinkDetail,
								" (",
								uplink,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									patchSettings({ provider: p.id });
									refreshUplink();
								},
								className: cn("rounded-md border px-2 py-3 text-left transition-colors", settings.provider === p.id ? "border-accent bg-surface-2" : "border-border hover:bg-surface-2"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-display text-sm text-fg",
									children: p.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted",
									children: p.hint
								})]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Ollama base URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: settings.ollamaUrl,
								onChange: (e) => patchSettings({ ollamaUrl: e.target.value }),
								className: "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Shared model"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelField, {
									value: settings.sharedModel,
									models,
									onChange: (sharedModel) => patchSettings({ sharedModel })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-faint",
									children: "On 16GB VRAM, one model with four personas is the sweet spot. Split models only if they are small."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-3 rounded-md border border-border px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-fg",
								children: "Per-operator models"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted",
								children: "Optional overrides. Still one call at a time."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: settings.perAgentModels,
								onChange: (e) => patchSettings({ perAgentModels: e.target.checked }),
								className: "size-5 accent-accent"
							})]
						}),
						settings.perAgentModels ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: AGENT_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: AGENTS[id].handle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelField, {
									value: settings.agentModels[id],
									models,
									onChange: (name) => patchSettings({ agentModels: {
										...settings.agentModels,
										[id]: name
									} })
								})]
							}, id))
						}) : null,
						probeMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: probeMsg
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "Local calls leave this browser for Ollama. If the page is served over HTTPS, some browsers block HTTP local servers — allow CORS on Ollama or keep Relay on."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 border-t border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => void testLink(),
						children: "Test local"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setSettingsOpen(false),
						children: "Done"
					})]
				})
			]
		})
	});
}
function ModelField({ value, models, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder: models[0] ?? "llama3.1",
			className: "h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none"
		}), models.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: models.includes(value) ? value : "",
			onChange: (e) => onChange(e.target.value),
			className: "h-11 rounded-md border border-border bg-bg px-2 text-sm text-fg",
			"aria-label": "Detected models",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				disabled: true,
				children: "Detected"
			}), models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: m,
				children: m
			}, m))]
		}) : null]
	});
}
var COLOR = {
	rook: "var(--color-rook)",
	nyx: "var(--color-nyx)",
	jinx: "var(--color-jinx)",
	echo: "var(--color-echo)"
};
function TableDock() {
	const open = useDen((s) => s.tableOpen);
	const table = useDen((s) => s.table);
	const status = useDen((s) => s.status);
	const busy = useDen((s) => s.busy);
	const lastError = useDen((s) => s.lastError);
	const opsOpen = useDen((s) => s.opsOpen);
	const setTableOpen = useDen((s) => s.setTableOpen);
	const clearTable = useDen((s) => s.clearTable);
	const [draft, setDraft] = (0, import_react.useState)("");
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [table, status]);
	if (!open) return null;
	const thinking = AGENT_ORDER.find((id) => status[id] === "thinking");
	async function onSubmit(e) {
		e.preventDefault();
		const text = draft.trim();
		if (!text || busy) return;
		setDraft("");
		await sendTable(text);
	}
	function onKey(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			e.currentTarget.form?.requestSubmit();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: cn("absolute inset-0 z-30 flex flex-col bg-bg/80 md:inset-y-0 md:left-auto md:right-0 md:w-dock md:bg-transparent", opsOpen && "z-50"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full min-h-0 flex-col border-border bg-surface/90 md:border-l md:backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 border-b border-border px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-11 shrink-0 place-items-center rounded-md border border-border bg-bg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-accent" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xs tracking-widest text-muted",
									children: "Open floor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-medium leading-tight text-fg",
									children: "The table"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted",
									children: "You plus the crew. @ a handle to pull someone in."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							size: "icon",
							onClick: () => clearTable(),
							"aria-label": "Clear table",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							size: "sm",
							onClick: () => setTableOpen(false),
							children: "Close"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scroller,
					className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4",
					children: [
						table.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "The table is listening. Speak, or tap a handle to aim it."
						}) : table.map((m) => {
							if (m.speaker === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-w-[92%] rounded-md rounded-br-xs bg-surface-2 px-3 py-2 text-sm text-fg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "whitespace-pre-wrap",
										children: m.content
									})
								})
							}, m.id);
							const agent = AGENTS[m.speaker];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("max-w-[92%] rounded-md rounded-bl-xs border border-border bg-bg px-3 py-2", m.kind === "wire" && "border-dashed"),
									style: {
										borderLeftColor: COLOR[m.speaker],
										borderLeftWidth: 2
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mb-1 font-display text-xs tracking-widest",
										style: { color: COLOR[m.speaker] },
										children: [agent.handle, m.kind === "wire" ? " · crew line" : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: m.content })]
								})
							}, m.id);
						}),
						thinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "shimmer-text text-xs",
							children: [AGENTS[thinking].handle, " is thinking"]
						}) : null,
						lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: lastError
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 flex flex-wrap gap-1",
						children: AGENT_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setDraft((d) => `${d}${d && !d.endsWith(" ") ? " " : ""}@${AGENTS[id].handle} `),
							className: "rounded-full border border-border px-3 py-1 font-display text-xs tracking-widest hover:opacity-80",
							style: { color: COLOR[id] },
							children: ["@", AGENTS[id].handle]
						}, id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							onKeyDown: onKey,
							rows: 2,
							placeholder: "Speak to the table…",
							className: "min-h-11 flex-1 resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-faint focus:border-border-strong"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: busy || !draft.trim(),
							"aria-label": "Send to table",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
						})]
					})]
				})
			]
		})
	});
}
function HideoutApp() {
	const [intro, setIntro] = (0, import_react.useState)(true);
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
	(0, import_react.useEffect)(() => {
		hydrateDen();
	}, []);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			const target = e.target;
			const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
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
			const id = {
				"1": "rook",
				"2": "nyx",
				"3": "jinx",
				"4": "echo"
			}[e.key];
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
		tableOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh min-h-dvh overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}),
			intro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, { onEnter: () => setIntro(false) }) : null,
			!intro ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsScreen, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObjectivesScreen, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableDock, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogueDock, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {})
			] }) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HideoutApp, {});
}
//#endregion
export { Home as component };
