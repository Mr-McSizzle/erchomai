import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, range, clamp, easeOutQuint, damp, lerp } from "./scroll";

/** A single parametric curved rib, Zaha Hadid style. */
function Rib({
  radius,
  tilt,
  offset,
  thickness,
}: {
  radius: number;
  tilt: number;
  offset: number;
  thickness: number;
}) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const SEG = 140;
    for (let i = 0; i <= SEG; i++) {
      const a = (i / SEG) * Math.PI * 2;
      const r = radius + Math.sin(a * 3 + offset) * 0.1;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * r,
          Math.sin(a * 2 + offset) * 0.3 + Math.sin(a) * radius * Math.sin(tilt),
          Math.sin(a) * r * Math.cos(tilt),
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal", 0.5);
    return new THREE.TubeGeometry(curve, 320, thickness, 10, true);
  }, [radius, tilt, offset, thickness]);

  return <mesh geometry={geometry} />;
}

/**
 * Parametric architectural exoskeleton.
 * Assembles at scene 3, pulses while "processing" in scene 4,
 * detaches into a continuous Ouroboros ring at scene 6, then compresses away.
 */
export function Exoskeleton({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);

  const addMat = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };

  useFrame((state, dt) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 0.05);

    const assemble = easeOutQuint(range(p, 0.36, 0.5));
    const pulse = range(p, 0.55, 0.62) * (1 - range(p, 0.68, 0.74));
    const ouroboros = easeOutQuint(range(p, 0.8, 0.92));
    const compress = easeOutQuint(range(p, 0.93, 1));
    const opacity = clamp(assemble) * (1 - compress);

    for (const m of mats.current) {
      m.opacity = opacity * 0.95;
      m.emissiveIntensity = 0.06 + pulse * (0.5 + Math.sin(t * 3.2) * 0.4);
    }

    if (group.current) {
      group.current.visible = opacity > 0.002;
      const s = lerp(0.7, 1, assemble) * (1 - compress * 0.98);
      group.current.scale.setScalar(damp(group.current.scale.x, s, 6, d));
      group.current.rotation.y += d * (0.06 + ouroboros * 0.45);
    }

    // Shell fades into the flat ring as the Ouroboros forms.
    if (shell.current) {
      shell.current.scale.y = lerp(1, 0.06, ouroboros);
      shell.current.scale.x = shell.current.scale.z = lerp(1, 1.35, ouroboros);
      shell.current.rotation.z = lerp(0, 0.0, ouroboros);
    }
    if (ring.current) {
      const ro = ouroboros * (1 - compress);
      ring.current.scale.setScalar(lerp(0.4, 1.55, ouroboros));
      ring.current.rotation.z += d * 0.25 * ro;
      ring.current.visible = ro > 0.01;
    }
  });

  const titanium = (
    <meshStandardMaterial
      ref={(m) => addMat(m as THREE.MeshStandardMaterial)}
      color={PALETTE.titanium}
      emissive={PALETTE.titanium}
      emissiveIntensity={0.06}
      roughness={0.28}
      metalness={0.9}
      transparent
      opacity={0}
    />
  );

  return (
    <group ref={group} position={[0, 0.55, 0]}>
      <group ref={shell}>
        {[
          { radius: 0.82, tilt: 0.12, offset: 0, thickness: 0.012 },
          { radius: 0.95, tilt: -0.35, offset: 1.1, thickness: 0.009 },
          { radius: 0.72, tilt: 0.8, offset: 2.3, thickness: 0.008 },
          { radius: 1.08, tilt: 0.5, offset: 3.7, thickness: 0.007 },
        ].map((r, i) => (
          <group key={i}>
            <Rib {...r} />
          </group>
        ))}
        {titanium}
        {/* Vertical spines */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.86, 0, Math.sin(a) * 0.86]}>
              <capsuleGeometry args={[0.005, 1.2, 4, 8]} />
              <meshStandardMaterial
                ref={(m) => addMat(m as THREE.MeshStandardMaterial)}
                color={PALETTE.titanium}
                emissive={PALETTE.titanium}
                emissiveIntensity={0.06}
                roughness={0.32}
                metalness={0.85}
                transparent
                opacity={0}
              />
            </mesh>
          );
        })}
      </group>

      {/* Ouroboros — one perfect continuous ring */}
      <group ref={ring} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <mesh>
          <torusGeometry args={[1.2, 0.012, 24, 400]} />
          <meshStandardMaterial
            ref={(m) => addMat(m as THREE.MeshStandardMaterial)}
            color={PALETTE.titanium}
            emissive={PALETTE.titanium}
            emissiveIntensity={0.3}
            roughness={0.25}
            metalness={0.9}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh scale={0.94}>
          <torusKnotGeometry args={[1.2, 0.004, 320, 8, 2, 3]} />
          <meshStandardMaterial
            ref={(m) => addMat(m as THREE.MeshStandardMaterial)}
            color={PALETTE.titanium}
            emissive={PALETTE.titanium}
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.9}
            transparent
            opacity={0}
          />
        </mesh>
      </group>
    </group>
  );
}
