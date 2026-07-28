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
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.36, 64, 64]} />
        {porcelain()}
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.24, 0]}>
        <capsuleGeometry args={[0.11, 0.16, 12, 32]} />
        {porcelain()}
      </mesh>
      {/* Chest / torso (breathing) */}
      <mesh ref={chest} position={[0, 0.62, 0]}>
        <capsuleGeometry args={[0.42, 0.72, 24, 64]} />
        {porcelain()}
      </mesh>
      {/* Shoulders */}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.95, 0]}>
          <sphereGeometry args={[0.17, 32, 32]} />
          {porcelain()}
        </mesh>
      ))}
      {/* Arms, abstracted */}
      {[-0.56, 0.56].map((x) => (
        <mesh key={x} position={[x, 0.44, 0]} rotation={[0, 0, x > 0 ? -0.06 : 0.06]}>
          <capsuleGeometry args={[0.085, 0.72, 12, 24]} />
          {porcelain()}
        </mesh>
      ))}
      {/* Base plinth — the bust cut */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.46, 0.5, 0.1, 64]} />
        {porcelain({ roughness: 0.95 })}
      </mesh>

      {/* The exposed brain */}
      <group ref={brain} position={[0, 1.62, 0]}>
        <mesh ref={brainCore}>
          <icosahedronGeometry args={[0.2, 1]} />
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
          <icosahedronGeometry args={[0.12, 2]} />
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
