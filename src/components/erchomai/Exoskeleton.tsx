import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, range, clamp, easeOutQuint, damp, lerp } from "./scroll";

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
      ring.current.scale.setScalar(lerp(0.4, 0.92, ouroboros));
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
        {[0, 1, 2, 3, 4].map((i) => (
          <Meridian
            key={i}
            angle={(i / 5) * Math.PI}
            radius={0.84}
            height={1.16}
            thickness={i === 0 ? 0.006 : 0.004}
            lean={i % 2 === 0 ? 0.06 : -0.06}
          />
        ))}
        <Latitude y={0.62} radius={0.6} thickness={0.005} />
        <Latitude y={0.12} radius={0.83} thickness={0.006} />
        <Latitude y={-0.46} radius={0.7} thickness={0.005} />
        {titanium}

      </group>

      {/* Ouroboros — one perfect continuous ring */}
      <group ref={ring} rotation={[Math.PI / 2.35, 0, 0]} visible={false}>
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
        <mesh scale={0.82}>
          <torusGeometry args={[1.2, 0.004, 16, 300]} />
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
