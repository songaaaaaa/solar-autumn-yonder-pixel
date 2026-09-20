const DROPS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(i * 19.3 + 8) % 100}%`,
  delay: `${(i * 0.31) % 3.4}s`,
  duration: `${2.8 + (i % 5) * 0.35}s`,
  opacity: 0.2 + (i % 4) * 0.08,
}));

export function Rain() {
  return (
    <div className="rain" aria-hidden="true">
      {DROPS.map((d) => (
        <span
          key={d.id}
          style={{
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}
