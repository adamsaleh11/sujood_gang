export function InteractiveGooeyBackground() {
  return (
    <div
      aria-hidden="true"
      className="bg-foreground pointer-events-none absolute inset-0 overflow-hidden contain-paint"
    >
      <div className="hero-background-static absolute inset-0" />
      <div className="bg-lime/35 absolute inset-x-0 top-0 h-px" />
      <div className="bg-background/10 absolute inset-x-0 bottom-0 h-px" />
      <div className="bg-foreground/18 absolute inset-0" />
    </div>
  );
}
