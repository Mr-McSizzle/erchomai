import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, range, clamp, easeOutQuint } from "./scroll";

export const BRAIN = new THREE.Vector3(0, 1.27, 0);

/** The six intelligence nodes. Positions are shared with the HTML labels. */
export const NODES: { label: string; pos: [number, number, number] }[] = [
  { label: "Research", pos: [-2.5, 2.05, -0.3] },
  { label: "Simulation", pos: [2.5, 2.05, -0.3] },
  { label: "Forecasting", pos: [-3.05, 0.75, 0.6] },
  { label: "Synthetic Markets", pos: [3.05, 0.75, 0.6] },
  { label: "Synthetic Customers", pos: [-2.05, -0.55, -0.5] },
  { label: "Execution", pos: [2.05, -0.55, -0.5] },
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

    // Morph weights
    const wBeam = easeOutQuint(range(p, 0.24, 0.36));
    const wCollapse = easeOutQuint(range(p, 0.7, 0.775));
    // Visibility envelope
    const fadeIn = range(p, 0.05, 0.16);
    const fadeOut = 1 - range(p, 0.8, 0.9);
    const opacity = clamp(fadeIn * fadeOut);

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

  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const appear = easeOutQuint(range(p, 0.24, 0.34));
    const vanish = 1 - range(p, 0.44, 0.56);
    const o = clamp(appear * vanish);
    if (mat.current) mat.current.opacity = o;
    if (group.current) {
      group.current.visible = o > 0.002;
      group.current.scale.setScalar(0.6 + o * 0.4);
      group.current.rotation.y = Math.sin(t * 0.1) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {NODES.map((n, i) => (
        <mesh key={n.label} position={n.pos}>
          <octahedronGeometry args={[0.085, 0]} />
          {i === 0 ? (
            <meshStandardMaterial
              ref={mat}
              color={PALETTE.porcelain}
              emissive={PALETTE.porcelain}
              emissiveIntensity={0.8}
              transparent
              opacity={0}
            />
          ) : (
            <primitive object={mat.current ?? new THREE.MeshStandardMaterial()} attach="material" />
          )}
        </mesh>
      ))}
    </group>
  );
}
