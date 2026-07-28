import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, range, window3, damp } from "./scroll";

/**
 * Minimalist, gender-neutral abstract humanoid figure built from primitives.
 * Matte porcelain material. Breathing chest. Dissolves during the final scene.
 */
export function Figure({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Mesh>(null);
  const brain = useRef<THREE.Group>(null);
  const brainCore = useRef<THREE.Mesh>(null);
  const matsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const collect = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !matsRef.current.includes(m)) matsRef.current.push(m);
  };

  useFrame((state, dt) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 0.05);

    // Breathing — subtle, high-mass, never bouncy.
    const breath = 1 + Math.sin(t * 0.55) * 0.01 + 0.01;
    if (chest.current) {
      chest.current.scale.x = damp(chest.current.scale.x, breath, 4, d);
      chest.current.scale.z = damp(chest.current.scale.z, breath, 4, d);
    }

    // Slow presence rotation, settles as scroll advances.
    if (group.current) {
      const targetY = Math.sin(t * 0.12) * 0.12 + range(p, 0.8, 1) * Math.PI * 0.25;
      group.current.rotation.y = damp(group.current.rotation.y, targetY, 2.5, d);
      group.current.position.y = damp(group.current.position.y, Math.sin(t * 0.4) * 0.02, 3, d);
    }

    // Brain: idle rotation, brightens on Consciousness + Decision.
    if (brain.current) {
      brain.current.rotation.y += d * 0.35;
      brain.current.rotation.x += d * 0.12;
    }
    if (brainCore.current) {
      const mat = brainCore.current.material as THREE.MeshStandardMaterial;
      const glow =
        0.35 +
        window3(p, 0.05, 0.18, 0.36) * 1.6 +
        window3(p, 0.7, 0.78, 0.9) * 3.2 +
        Math.sin(t * 1.6) * 0.08;
      mat.emissiveIntensity = damp(mat.emissiveIntensity, glow, 6, d);
    }

    // Dissolve in the logo scene.
    const opacity = 1 - range(p, 0.9, 0.985);
    for (const m of matsRef.current) {
      m.opacity = opacity;
      m.visible = opacity > 0.001;
    }
    if (group.current) group.current.visible = opacity > 0.001;
  });

  const porcelain = (extra?: Partial<THREE.MeshStandardMaterialParameters>) => (
    <meshStandardMaterial
      ref={(m) => collect(m as THREE.MeshStandardMaterial)}
      color={PALETTE.porcelain}
      roughness={0.82}
      metalness={0.04}
      transparent
      {...extra}
    />
  );

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      {/* Head */}
      <mesh position={[0, 1.66, 0]} scale={[0.86, 1.12, 0.94]} castShadow>
        <sphereGeometry args={[0.26, 64, 64]} />
        {porcelain()}
      </mesh>
      {/* Jaw / chin mass */}
      <mesh position={[0, 1.55, 0.05]} scale={[0.72, 0.78, 0.86]}>
        <sphereGeometry args={[0.22, 48, 48]} />
        {porcelain()}
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.24, -0.01]}>
        <capsuleGeometry args={[0.085, 0.3, 16, 32]} />
        {porcelain()}
      </mesh>
      {/* Chest / torso (breathing) */}
      <mesh ref={chest} position={[0, 0.74, 0]} scale={[1, 1, 0.72]}>
        <capsuleGeometry args={[0.3, 0.6, 24, 64]} />
        {porcelain()}
      </mesh>
      {/* Shoulder line */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 1.02, 0]} scale={[1, 0.62, 0.62]}>
          <sphereGeometry args={[0.135, 40, 40]} />
          {porcelain()}
        </mesh>
      ))}
      {/* Deltoid stubs — the bust cut */}
      {[-0.38, 0.38].map((x) => (
        <mesh key={x} position={[x, 0.88, 0]} scale={[0.9, 0.85, 0.8]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]}>
          <capsuleGeometry args={[0.1, 0.14, 12, 32]} />
          {porcelain()}
        </mesh>
      ))}
      {/* Plinth */}
      <mesh position={[0, 0.34, 0]} scale={[1, 1, 0.72]}>
        <cylinderGeometry args={[0.34, 0.36, 0.05, 64]} />
        {porcelain({ roughness: 0.95 })}
      </mesh>
      <mesh position={[0, 0.08, 0]} scale={[1, 1, 0.72]}>
        <cylinderGeometry args={[0.16, 0.2, 0.5, 48]} />
        {porcelain({ roughness: 0.95 })}
      </mesh>

      {/* The exposed brain */}
      <group ref={brain} position={[0, 1.7, 0]}>
        <mesh ref={brainCore}>
          <icosahedronGeometry args={[0.235, 1]} />
          <meshStandardMaterial
            color={PALETTE.porcelain}
            emissive={PALETTE.porcelain}
            emissiveIntensity={0.4}
            wireframe
            transparent
            ref={(m) => collect(m as THREE.MeshStandardMaterial)}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.115, 2]} />
          <meshStandardMaterial
            color={PALETTE.porcelain}
            emissive={PALETTE.porcelain}
            emissiveIntensity={0.9}
            roughness={0.3}
            transparent
            ref={(m) => collect(m as THREE.MeshStandardMaterial)}
          />
        </mesh>
        <pointLight color={PALETTE.porcelain} intensity={2.2} distance={4} />
      </group>
    </group>
  );
}
