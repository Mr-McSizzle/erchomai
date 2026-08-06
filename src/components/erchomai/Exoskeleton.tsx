import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, ramp, clamp, damp, lerp } from "./scroll";

/** A clean parametric meridian arc — armillary/Hadid style, no noise. */
function Meridian({
  angle,
  radius,
  height,
  thickness,
  lean,
}: {
  angle: number;
  radius: number;
  height: number;
  thickness: number;
  lean: number;
}) {
  const geometry = useMemo(
    () => new THREE.TorusGeometry(radius, thickness, 8, 220),
    [radius, thickness],
  );
  return (
    <mesh
      geometry={geometry}
      rotation={[0, angle, lean]}
      scale={[1, height / radius, 1]}
    />
  );
}

/** A horizontal latitude ring. */
function Latitude({
  y,
  radius,
  thickness,
}: {
  y: number;
  radius: number;
  thickness: number;
}) {
  const geometry = useMemo(
    () => new THREE.TorusGeometry(radius, thickness, 8, 220),
    [radius, thickness],
  );
  return <mesh geometry={geometry} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} />;
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
  const shellMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const ringMats = useRef<THREE.MeshStandardMaterial[]>([]);

  const addShell = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !shellMats.current.includes(m)) shellMats.current.push(m);
  };
  const addRing = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !ringMats.current.includes(m)) ringMats.current.push(m);
  };

  useFrame((state, dt) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 0.05);

    const assemble = ramp(p, 0.34, 0.5);
    const pulse = ramp(p, 0.54, 0.63) * (1 - ramp(p, 0.67, 0.75));
    const ouroboros = ramp(p, 0.78, 0.92);
    const compress = ramp(p, 0.92, 1);
    const opacity = clamp(assemble) * (1 - compress);

    // Shell dissolves as the ring resolves — a crossfade, never a pop.
    const shellFade = 1 - ramp(p, 0.79, 0.88);
    for (const m of shellMats.current) {
      m.opacity = opacity * 0.62 * shellFade;
      m.emissiveIntensity = 0.06 + pulse * (0.5 + Math.sin(t * 3.2) * 0.4);
    }
    const ringFade = clamp(ouroboros * (1 - compress));
    for (const m of ringMats.current) m.opacity = ringFade * 0.85;

    if (group.current) {
      group.current.visible = opacity > 0.002 || ringFade > 0.002;
      const s = lerp(0.7, 1, assemble) * (1 - compress * 0.98);
      group.current.scale.setScalar(damp(group.current.scale.x, s, 5, d));
      group.current.rotation.y += d * (0.06 + ouroboros * 0.45);
    }

    if (shell.current) {
      shell.current.visible = shellFade > 0.002 && opacity > 0.002;
      shell.current.scale.y = lerp(1, 0.06, ouroboros);
      shell.current.scale.x = shell.current.scale.z = lerp(1, 1.35, ouroboros);
    }
    if (ring.current) {
      ring.current.scale.setScalar(lerp(0.4, 0.92, ouroboros));
      ring.current.rotation.z += d * 0.25 * ringFade;
      ring.current.visible = ringFade > 0.002;
    }
  });

  const titanium = (
    <meshStandardMaterial
      ref={(m) => addShell(m as THREE.MeshStandardMaterial)}
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
    <group ref={group} position={[0, 0.82, 0]}>
      <group ref={shell}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Meridian
            key={i}
            angle={(i / 5) * Math.PI}
            radius={1.02}
            height={1.5}
            thickness={i === 0 ? 0.006 : 0.004}
            lean={i % 2 === 0 ? 0.06 : -0.06}
          />
        ))}
        <Latitude y={0.8} radius={0.72} thickness={0.005} />
        <Latitude y={0.14} radius={1.01} thickness={0.006} />
        <Latitude y={-0.6} radius={0.84} thickness={0.005} />
        {titanium}


      </group>

      {/* Ouroboros — one perfect continuous ring */}
      <group ref={ring} rotation={[Math.PI / 2.35, 0, 0]} visible={false}>
        <mesh>
          <torusGeometry args={[1.2, 0.012, 24, 400]} />
          <meshStandardMaterial
            ref={(m) => addRing(m as THREE.MeshStandardMaterial)}
            color={PALETTE.titanium}
            emissive={PALETTE.titanium}
            emissiveIntensity={1.6}
            roughness={0.35}
            metalness={0.2}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh scale={0.82}>
          <torusGeometry args={[1.2, 0.004, 16, 300]} />
          <meshStandardMaterial
            ref={(m) => addRing(m as THREE.MeshStandardMaterial)}
            color={PALETTE.titanium}
            emissive={PALETTE.titanium}
            emissiveIntensity={1.1}
            roughness={0.35}
            metalness={0.2}
            transparent
            opacity={0}
          />
        </mesh>
      </group>
    </group>
  );
}
