import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Payload = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().max(12000),
      }),
    )
    .min(1)
    .max(24),
  maxTokens: z.number().int().min(64).max(1600).optional(),
  temperature: z.number().min(0).max(1.4).optional(),
});

export const completeChat = createServerFn({ method: "POST" })
  .validator(Payload)
  .handler(async ({ data }) => {
    const apiKey = process.env["XAI_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, error: "Relay is not available in this environment." };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        messages: data.messages,
        temperature: data.temperature ?? 0.7,
        max_tokens: data.maxTokens ?? 900,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false as const,
        error: `Relay refused the call (${res.status}). ${body.slice(0, 180)}`.trim(),
      };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return { ok: false as const, error: "Relay came back empty." };
    }
    return { ok: true as const, text, source: "grok" as const, model: "grok-4.5" };
  });
