import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, range, ramp, clamp } from "./scroll";
import { BRAIN } from "./Particles";

/**
 * Scene 4 — translucent wireframe spatial cities, graphs and market data
 * expanding around the figure.
 */
export function SyntheticWorld({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.Material[]>([]);
  const addMat = (m: THREE.Material | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };

  const towers = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const a = (i / 46) * Math.PI * 2 + (i % 3) * 0.3;
        const r = 3.2 + ((i * 7919) % 100) / 100 * 4.2;
        const h = 0.4 + ((i * 104729) % 100) / 100 * 3.4;
        return {
          key: i,
          pos: [Math.cos(a) * r, h / 2 - 1.6, Math.sin(a) * r] as [number, number, number],
          size: [0.35 + (i % 4) * 0.12, h, 0.35 + (i % 3) * 0.14] as [number, number, number],
        };
      }),
    [],
  );

  const graph = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let s = 0; s < 5; s++) {
      let y = 0;
      for (let i = 0; i < 60; i++) {
        const x = -3 + (i / 59) * 6;
        const ny = y + (Math.sin(i * 0.7 + s * 2.1) + Math.sin(i * 0.23 + s)) * 0.06;
        if (i > 0) {
          pts.push(x - 6 / 59, y, 0, x, ny, 0);
        }
        y = ny;
      }
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const appear = ramp(p, 0.48, 0.62);
    const vanish = 1 - ramp(p, 0.69, 0.79);
    const o = clamp(appear * vanish);
    for (const m of mats.current) (m as THREE.Material & { opacity: number }).opacity = o * 0.34;
    if (group.current) {
      group.current.visible = o > 0.002;
      group.current.rotation.y = t * 0.02;
      group.current.scale.setScalar(0.82 + o * 0.18);
    }
  });

  return (
    <group ref={group} visible={false}>
      {/* Ground data grid */}
      <gridHelper
        args={[26, 52, PALETTE.titanium, PALETTE.titanium]}
        position={[0, -1.62, 0]}
        ref={(g) => {
          const gh = g as THREE.GridHelper | null;
          if (!gh) return;
          const m = gh.material as THREE.Material;
          m.transparent = true;
          m.opacity = 0;
          addMat(m);
        }}
      />

      {/* Spatial city */}
      {towers.map((tw) => (
        <mesh key={tw.key} position={tw.pos}>
          <boxGeometry args={tw.size} />
          <meshBasicMaterial
            ref={(m) => addMat(m as THREE.Material)}
            color={PALETTE.titanium}
            wireframe
            transparent
            opacity={0}
          />
        </mesh>
      ))}

      {/* Floating market graphs */}
      {[
        { p: [-4.6, 2.4, -2.2], r: [0, 0.6, 0] },
        { p: [4.6, 2.1, -2.2], r: [0, -0.6, 0] },
        { p: [0, 3.4, -4.5], r: [0, 0, 0] },
      ].map((c, i) => (
        <lineSegments
          key={i}
          geometry={graph}
          position={c.p as [number, number, number]}
          rotation={c.r as [number, number, number]}
          scale={0.8}
        >
          <lineBasicMaterial
            ref={(m) => addMat(m as THREE.Material)}
            color={PALETTE.porcelain}
            transparent
            opacity={0}
          />
        </lineSegments>
      ))}

      {/* Enclosing data volumes */}
      {[5.2, 7.4].map((r) => (
        <mesh key={r} position={[0, 0.6, 0]}>
          <icosahedronGeometry args={[r, 2]} />
          <meshBasicMaterial
            ref={(m) => addMat(m as THREE.Material)}
            color={PALETTE.titanium}
            wireframe
            transparent
            opacity={0}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Scene 5 — one perfect bright white line striking into the brain. */
export function DecisionBeam({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = progressRef.current;
    const strike = ramp(p, 0.71, 0.785);
    const out = 1 - ramp(p, 0.79, 0.87);
    const o = clamp(strike * out);
    if (mat.current) mat.current.opacity = o;
    if (mesh.current) {
      mesh.current.visible = o > 0.002;
      mesh.current.scale.x = mesh.current.scale.z = 0.25 + strike * 0.75;
    }
    if (light.current) light.current.intensity = o * 14;
  });

  return (
    <group position={[BRAIN.x, BRAIN.y, BRAIN.z]}>
      <mesh ref={mesh} position={[0, 6, 0]} visible={false}>
        <cylinderGeometry args={[0.012, 0.004, 12, 12, 1, true]} />
        <meshBasicMaterial
          ref={mat}
          color={PALETTE.porcelain}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight ref={light} color={PALETTE.porcelain} intensity={0} distance={9} />
    </group>
  );
}
