import { Button } from "@/components/ui/button";

export function BootScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end overflow-hidden bg-bg">
      <img
        src="/art/den.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
      <div className="relative z-10 flex max-w-xl flex-col gap-4 px-6 pb-16 pt-10 sm:px-10">
        <p className="font-display text-xs tracking-widest text-muted">Local crew</p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-6xl">
          NIGHTWIRE
        </h1>
        <p className="max-w-md text-base text-muted">
          Four operators on one wall. Click a box for a private line, or open the table to talk to everyone.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onEnter}>
            Enter
          </Button>
          <p className="text-xs text-faint">1–4 selects crew · Esc backs out</p>
        </div>
      </div>
    </div>
  );
}
