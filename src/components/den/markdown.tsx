import { cn } from "@/lib/utils";

function renderInline(text: string) {
  const bits = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return bits.map((bit, i) => {
    if (bit.startsWith("**") && bit.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-fg">
          {bit.slice(2, -2)}
        </strong>
      );
    }
    if (bit.startsWith("`") && bit.endsWith("`")) {
      return (
        <code key={i} className="rounded-xs bg-surface-2 px-1 py-px font-display text-xs text-accent">
          {bit.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{bit}</span>;
  });
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const blocks: { type: "code" | "p"; lang?: string; body: string }[] = [];
  const fence = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(text))) {
    if (m.index > last) {
      blocks.push({ type: "p", body: text.slice(last, m.index) });
    }
    blocks.push({ type: "code", lang: m[1], body: m[2].replace(/\n$/, "") });
    last = m.index + m[0].length;
  }
  if (last < text.length) blocks.push({ type: "p", body: text.slice(last) });
  if (blocks.length === 0) blocks.push({ type: "p", body: text });

  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-fg/90", className)}>
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-md border border-border bg-bg px-3 py-2 font-display text-xs text-accent"
            >
              <code>{block.body}</code>
            </pre>
          );
        }
        return block.body
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p, j) => (
            <p key={`${i}-${j}`} className="whitespace-pre-wrap">
              {p.split("\n").map((line, k) => (
                <span key={k}>
                  {k > 0 ? <br /> : null}
                  {line.startsWith("- ") ? (
                    <span className="flex gap-2">
                      <span className="text-accent">·</span>
                      <span>{renderInline(line.slice(2))}</span>
                    </span>
                  ) : (
                    renderInline(line)
                  )}
                </span>
              ))}
            </p>
          ));
      })}
    </div>
  );
}
