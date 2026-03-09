export default function Marquee() {
  const items = [
    "PHONE REPAIR", "CONTROLLER MODS", "CUSTOM PC BUILDS", "CONSOLE REPAIR",
    "SCREEN REPLACEMENT", "BATTERY SERVICE", "LED MODS", "DIAGNOSTICS",
    "WATER DAMAGE", "DATA RECOVERY", "CUSTOM SHELLS", "OVERCLOCKING"
  ];

  return (
    <div className="border-y border-border py-4 overflow-hidden glass-panel">
      <div className="flex gap-16 marquee-track animate-[marquee_25s_linear_infinite]" style={{ width: "max-content" }}>
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-16 font-display text-sm tracking-[0.25em] text-muted-foreground whitespace-nowrap">
            {item}
            <span className="text-primary text-[10px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}