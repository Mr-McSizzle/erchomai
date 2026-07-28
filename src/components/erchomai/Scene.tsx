import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Figure } from "./Figure";
import { Particles, Nodes } from "./Particles";
import { Exoskeleton } from "./Exoskeleton";
import { SyntheticWorld, DecisionBeam } from "./SyntheticWorld";
import { PALETTE, damp, range, easeOutQuint, lerp } from "./scroll";

/** Cinematic camera rig — one continuous, high-mass move across all 7 scenes. */
function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera, size } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.9, 0));

  useFrame((_, dt) => {
    const p = progressRef.current;
    const d = Math.min(dt, 0.05);
    const mobile = size.width < 768;
    const widen = mobile ? 1.75 : 1;

    // Keyframed dolly path
    const keys: [number, THREE.Vector3Tuple, THREE.Vector3Tuple][] = [
      [0.0, [0, 0.95, 6.4], [0, 0.85, 0]],
      [0.15, [0, 1.3, 2.5], [0, 1.28, 0]],
      [0.3, [0, 1.15, 6.2], [0, 1.1, 0]],
      [0.45, [1.5, 1.1, 5.9], [0, 0.9, 0]],
      [0.6, [-1.9, 1.9, 7.6], [0, 0.9, 0]],
      [0.75, [0, 1.35, 4.2], [0, 1.25, 0]],
      [0.85, [0.6, 1.6, 9.2], [0, 0.8, 0]],
      [1.0, [0, 0.9, 11.5], [0, 0.7, 0]],
    ];

    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
    const [p0, a, at] = keys[i];
    const [p1, b, bt] = keys[i + 1];
    const t = easeOutQuint(range(p, p0, p1));

    const px = lerp(a[0], b[0], t) * widen;
    const py = lerp(a[1], b[1], t);
    const pz = lerp(a[2], b[2], t) * widen;

    camera.position.x = damp(camera.position.x, px, 3.2, d);
    camera.position.y = damp(camera.position.y, py, 3.2, d);
    camera.position.z = damp(camera.position.z, pz, 3.2, d);

    target.current.set(
      damp(target.current.x, lerp(at[0], bt[0], t), 3.2, d),
      damp(target.current.y, lerp(at[1], bt[1], t), 3.2, d),
      damp(target.current.z, lerp(at[2], bt[2], t), 3.2, d),
    );
    camera.lookAt(target.current);

    const cam = camera as THREE.PerspectiveCamera;
    const fov = mobile ? 52 : 38;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

export function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={[PALETTE.obsidian]} />
      <fog attach="fog" args={[PALETTE.obsidian, 9, 24]} />

      <CameraRig progressRef={progressRef} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color={PALETTE.porcelain} />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color={PALETTE.titanium} />
      <spotLight
        position={[0, 7, 3]}
        angle={0.6}
        penumbra={1}
        intensity={12}
        color={PALETTE.porcelain}
      />

      <Figure progressRef={progressRef} />
      <Particles progressRef={progressRef} />
      <Nodes progressRef={progressRef} />
      <Exoskeleton progressRef={progressRef} />
      <SyntheticWorld progressRef={progressRef} />
      <DecisionBeam progressRef={progressRef} />
    </>
  );
}
