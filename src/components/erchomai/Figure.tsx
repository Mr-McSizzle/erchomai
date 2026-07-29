import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, range, window3, damp } from "./scroll";

/**
 * Minimalist, gender-neutral abstract humanoid figure built from primitives.
 * Matte porcelain material. Breathing chest. Dissolves during the final scene.
 */
/** Smooth revolve profile: plinth cut -> waist -> chest -> shoulder line -> neck. */
function makeBustProfile() {
  const control = [
    new THREE.Vector2(0.001, 0.1),
    new THREE.Vector2(0.34, 0.12),
    new THREE.Vector2(0.3, 0.36),
    new THREE.Vector2(0.31, 0.66),
    new THREE.Vector2(0.38, 0.96),
    new THREE.Vector2(0.42, 1.14),
    new THREE.Vector2(0.3, 1.26),
    new THREE.Vector2(0.12, 1.32),
    new THREE.Vector2(0.085, 1.36),
  ];
  return new THREE.SplineCurve(control).getPoints(64);
}

export function Figure({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const bustProfile = useMemo(makeBustProfile, []);
  const group = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Mesh>(null);
  const brain = useRef<THREE.Group>(null);
  const brainCore = useRef<THREE.Mesh>(null);
  const matsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const collect = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !matsRef.current.includes(m)) {
      m.userData.base = m.userData.base ?? m.opacity;
      matsRef.current.push(m);
    }
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
      m.opacity = opacity * (m.userData.base ?? 1);
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
      {/* Cranium — opened at the crown so the brain is exposed */}
      <mesh position={[0, 1.72, 0]} scale={[0.88, 1.14, 0.96]} castShadow>
        <sphereGeometry args={[0.26, 64, 64, 0, Math.PI * 2, Math.PI * 0.2, Math.PI * 0.8]} />
        {porcelain({ side: THREE.DoubleSide })}
      </mesh>


      {/* Jaw / chin mass */}
      <mesh position={[0, 1.63, 0.06]} scale={[0.68, 0.7, 0.82]}>
        <sphereGeometry args={[0.2, 48, 48]} />
        {porcelain()}
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.4, -0.01]}>
        <capsuleGeometry args={[0.082, 0.18, 16, 32]} />
        {porcelain()}
      </mesh>

      {/* Torso — lathed bust profile (breathing) */}
      <mesh ref={chest} position={[0, 0, 0]} scale={[1, 1, 0.66]}>
        <latheGeometry args={[bustProfile, 96]} />
        {porcelain()}
      </mesh>

      {/* Plinth */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.4, 0.44, 0.12, 96]} />
        {porcelain({ roughness: 0.95 })}
      </mesh>

      {/* The exposed brain */}
      <group ref={brain} position={[0, 1.9, 0]} scale={0.92}>
        <mesh ref={brainCore}>
          <icosahedronGeometry args={[0.185, 1]} />
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
          <icosahedronGeometry args={[0.095, 2]} />
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
