import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complete-chat-BiaI4oRi.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
var completeChat_createServerFn_handler = createServerRpc({
	id: "4cf87c6908c84a654505edd7d2655f6e1618021079fbe6ae8347e0db2926b8f1",
	name: "completeChat",
	filename: "src/lib/complete-chat.ts"
}, (opts) => completeChat.__executeServer(opts));
var completeChat = createServerFn({ method: "POST" }).validator(Payload).handler(completeChat_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env["XAI_API_KEY"];
	if (!apiKey) return {
		ok: false,
		error: "Relay is not available in this environment."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages: data.messages,
			temperature: data.temperature ?? .7,
			max_tokens: data.maxTokens ?? 900
		})
	});
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Relay refused the call (${res.status}). ${body.slice(0, 180)}`.trim()
		};
	}
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Relay came back empty."
	};
	return {
		ok: true,
		text,
		source: "grok",
		model: "grok-4.5"
	};
});
//#endregion
export { completeChat_createServerFn_handler };
