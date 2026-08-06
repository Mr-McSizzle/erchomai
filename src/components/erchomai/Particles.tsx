import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE, range, ramp, clamp, easeOutQuint } from "./scroll";

export const BRAIN = new THREE.Vector3(0, 1.55, 0);

/** The six intelligence nodes. Positions are shared with the HTML labels. */
export const NODES: { label: string; short: string; pos: [number, number, number] }[] = [
  { label: "Research", short: "Research", pos: [-1.12, 2.62, -0.15] },
  { label: "Simulation", short: "Simulation", pos: [1.12, 2.62, -0.15] },
  { label: "Forecasting", short: "Forecast", pos: [-1.42, 1.72, 0.35] },
  { label: "Synthetic Markets", short: "Markets", pos: [1.42, 1.72, 0.35] },
  { label: "Synthetic Customers", short: "Customers", pos: [-1.3, 0.86, -0.3] },
  { label: "Execution", short: "Execution", pos: [1.3, 0.86, -0.3] },
];


const COUNT = 6000;

/**
 * Single BufferGeometry point cloud, morphed between three procedural states:
 *  A: orbital cloud around the brain (Consciousness)
 *  B: geometric lines shooting outward into the 6 nodes (Intelligence)
 *  C: total collapse into one line striking the brain (Decision)
 */
export function Particles({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const { geometry, orbit, beams, collapse, seeds } = useMemo(() => {
    const orbit = new Float32Array(COUNT * 3);
    const beams = new Float32Array(COUNT * 3);
    const collapse = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // A — spherical shell orbit around the brain
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 0.42 + Math.pow(Math.random(), 0.6) * 1.5;
      orbit[i * 3] = BRAIN.x + r * Math.sin(phi) * Math.cos(theta);
      orbit[i * 3 + 1] = BRAIN.y + r * Math.cos(phi) * 0.85;
      orbit[i * 3 + 2] = BRAIN.z + r * Math.sin(phi) * Math.sin(theta);

      // B — straight lines from the brain to one of six nodes
      const n = NODES[i % NODES.length].pos;
      const t = Math.pow(Math.random(), 0.75);
      const jitter = 0.035;
      beams[i * 3] = BRAIN.x + (n[0] - BRAIN.x) * t + (Math.random() - 0.5) * jitter;
      beams[i * 3 + 1] = BRAIN.y + (n[1] - BRAIN.y) * t + (Math.random() - 0.5) * jitter;
      beams[i * 3 + 2] = BRAIN.z + (n[2] - BRAIN.z) * t + (Math.random() - 0.5) * jitter;

      // C — one perfect vertical line striking into the brain
      const k = i / COUNT;
      collapse[i * 3] = BRAIN.x + (Math.random() - 0.5) * 0.012;
      collapse[i * 3 + 1] = BRAIN.y + k * 9.5;
      collapse[i * 3 + 2] = BRAIN.z + (Math.random() - 0.5) * 0.012;

      seeds[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(orbit.slice(), 3));
    return { geometry, orbit, beams, collapse, seeds };
  }, []);

  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;

    // Morph weights — smootherstep so particles ease out of one formation and
    // into the next with no velocity snap at the boundaries.
    const wBeam = ramp(p, 0.22, 0.36);
    const wCollapse = ramp(p, 0.685, 0.78);
    // Visibility envelope
    const fadeIn = ramp(p, 0.04, 0.17);
    const fadeOut = 1 - ramp(p, 0.79, 0.91);
    // Recede while the synthetic world takes the stage, return for the collapse.
    const recede = 1 - ramp(p, 0.42, 0.56) * 0.72 * (1 - ramp(p, 0.64, 0.73));
    const opacity = clamp(fadeIn * fadeOut * recede);


    if (mat.current) {
      mat.current.opacity = opacity;
      mat.current.size = 0.012 + wCollapse * 0.01;
    }
    if (points.current) {
      points.current.visible = opacity > 0.002;
      // Slow orbital drift, killed once the beams lock in.
      points.current.rotation.y = t * 0.06 * (1 - wBeam);
    }
    if (!points.current?.visible) return;

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const breathe = 1 - wCollapse;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const s = seeds[i];
      const drift = Math.sin(t * 0.5 + s) * 0.03 * breathe * (1 - wBeam);

      let x = orbit[i3] + drift;
      let y = orbit[i3 + 1] + Math.cos(t * 0.42 + s) * 0.03 * breathe * (1 - wBeam);
      let z = orbit[i3 + 2] + drift;

      if (wBeam > 0) {
        x += (beams[i3] - x) * wBeam;
        y += (beams[i3 + 1] - y) * wBeam;
        z += (beams[i3 + 2] - z) * wBeam;
      }
      if (wCollapse > 0) {
        x += (collapse[i3] - x) * wCollapse;
        y += (collapse[i3 + 1] - y) * wCollapse;
        z += (collapse[i3 + 2] - z) * wCollapse;
      }

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }
    attr.needsUpdate = true;
    scratch.set(0, 0, 0);
    void dt;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={mat}
        color={PALETTE.porcelain}
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Six floating geometric nodes that the beams connect to. */
export function Nodes({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const labels = useRef<HTMLDivElement[]>([]);

  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const appear = ramp(p, 0.23, 0.325);
    const vanish = 1 - ramp(p, 0.35, 0.45);
    const o = clamp(appear * vanish);
    for (const m of mats.current) m.opacity = o;
    for (const el of labels.current) {
      el.style.opacity = String(o);
      el.style.transform = `translateY(${-24 + (1 - o) * 8}px)`;
    }
    if (group.current) {
      group.current.visible = o > 0.002;
      group.current.scale.setScalar(0.94 + o * 0.06);
      group.current.rotation.y = Math.sin(t * 0.1) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {NODES.map((n) => (
        <mesh key={n.label} position={n.pos}>
          <octahedronGeometry args={[0.032, 0]} />
          <meshStandardMaterial
            ref={(m) => {
              const mm = m as THREE.MeshStandardMaterial | null;
              if (mm && !mats.current.includes(mm)) mats.current.push(mm);
            }}
            color={PALETTE.porcelain}
            emissive={PALETTE.porcelain}
            emissiveIntensity={0.8}
            transparent
            opacity={0}
          />
          <Html center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
            <div
              ref={(el) => {
                if (el && !labels.current.includes(el)) labels.current.push(el);
              }}
              className="-translate-y-6 whitespace-nowrap text-[7px] font-light uppercase tracking-[0.14em] text-porcelain/75 sm:text-[9px] sm:tracking-[0.28em] md:text-[10px] md:tracking-[0.34em]"
              style={{ opacity: 0, transform: "translateY(-16px)" }}
            >
              <span className="sm:hidden">{n.short}</span>
              <span className="hidden sm:inline">{n.label}</span>

            </div>
          </Html>
        </mesh>
      ))}
    </group>
  );
}
