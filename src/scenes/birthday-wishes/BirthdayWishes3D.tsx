import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CakeModel } from './CakeModel';

/* ── Floating golden particles inside the 3D scene ── */

function GoldParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 1] = Math.random() * 5 - 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = 0.003 + Math.random() * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      if (pos[i * 3 + 1] > 3.5) {
        pos[i * 3 + 1] = -1.5;
        pos[i * 3] = (Math.random() - 0.5) * 7;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      }
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#e9b13a"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Luxury bokeh sprites ── */

function Bokeh() {
  const meshRef = useRef<THREE.Group>(null);

  const circles = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      pos: [
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5,
        -2 - Math.random() * 3,
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
      opacity: 0.04 + Math.random() * 0.08,
      speed: 0.0005 + Math.random() * 0.001,
    }));
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.children.forEach((child, i) => {
      child.position.y += circles[i].speed;
      if (child.position.y > 2.5) child.position.y = -2.5;
    });
  });

  return (
    <group ref={meshRef}>
      {circles.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial
            color="#e9b13a"
            transparent
            opacity={c.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Responsive camera controller ── */

function CameraRig({ phase }: { phase: number }) {
  const { camera, size } = useThree();
  const targetZ = useRef(5.5);
  const targetY = useRef(0.3);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Responsive distance: pull back on small screens
    const aspect = size.width / size.height;
    const baseZ = aspect < 1 ? 5.0 : 4.2; // mobile: further back
    const heroZ = aspect < 1 ? 4.2 : 3.6;
    const closeZ = aspect < 1 ? 3.5 : 3.0;

    if (phase <= 1) {
      targetZ.current = THREE.MathUtils.lerp(targetZ.current, baseZ, 0.02);
      targetY.current = THREE.MathUtils.lerp(targetY.current, 0.35, 0.02);
    } else if (phase === 2) {
      targetZ.current = THREE.MathUtils.lerp(targetZ.current, heroZ, 0.015);
      targetY.current = THREE.MathUtils.lerp(targetY.current, 0.3, 0.015);
    } else {
      targetZ.current = THREE.MathUtils.lerp(targetZ.current, closeZ, 0.01);
      targetY.current = THREE.MathUtils.lerp(targetY.current, 0.35, 0.01);
    }

    const breath = Math.sin(t * 0.4) * 0.05;
    const sway = Math.sin(t * 0.25) * 0.04;

    camera.position.x = sway;
    camera.position.y = targetY.current + breath;
    camera.position.z = targetZ.current;
    camera.lookAt(0, 0.25, 0);
  });

  return null;
}

/* ── Cake rise animation wrapper ── */

function CakeRise({ phase }: { phase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = useRef(-2);

  useFrame(() => {
    if (!groupRef.current) return;
    if (phase >= 2) {
      targetY.current = THREE.MathUtils.lerp(targetY.current, 0, 0.025);
    }
    groupRef.current.position.y = targetY.current;
  });

  useFrame(() => {
    if (!groupRef.current) return;
    if (phase < 2) {
      groupRef.current.rotation.y += 0.006;
    } else if (phase === 2 && targetY.current < -0.1) {
      groupRef.current.rotation.y += 0.004;
    } else {
      groupRef.current.rotation.y *= 0.97;
    }
  });

  return (
    <group ref={groupRef}>
      <CakeModel />
    </group>
  );
}

/* ── Main 3D scene ── */

function Scene3D({ phase }: { phase: number }) {
  return (
    <>
      <CameraRig phase={phase} />

      <ambientLight intensity={0.2} color="#5a4a2a" />
      <directionalLight
        position={[3, 5, 2]}
        intensity={0.35}
        color="#e9b13a"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.4} color="#ffcc66" distance={10} />

      <fog attach="fog" args={['#0a0a0f', 5, 16]} />

      <Suspense fallback={null}>
        <CakeRise phase={phase} />
      </Suspense>

      <GoldParticles count={80} />
      <Bokeh />
    </>
  );
}

export interface BirthdayWishesSceneProps {
  phase: number;
}

export function BirthdayWishes3D({ phase }: BirthdayWishesSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.35, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene3D phase={phase} />
    </Canvas>
  );
}
