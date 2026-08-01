/** Fixed animated film-grain layer. Analog weight over the whole viewport. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] mix-blend-soft-light opacity-[0.5]"
    >
      <div className="grain-layer absolute inset-[-150%] h-[400%] w-[400%]" />
    </div>
  );
}
