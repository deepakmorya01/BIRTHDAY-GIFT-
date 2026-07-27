import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── Luxury 3-tier cake (scaled down ~35%) ── */

function CakeTier({
  radius,
  height,
  positionY,
}: {
  radius: number;
  height: number;
  positionY: number;
}) {
  return (
    <group position={[0, positionY, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.02, height, 64]} />
        <meshStandardMaterial
          color="#f7f1e3"
          roughness={0.55}
          metalness={0.05}
          emissive="#fff8e8"
          emissiveIntensity={0.06}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.03, 0]} castShadow>
        <torusGeometry args={[radius, 0.05, 12, 48]} />
        <meshStandardMaterial color="#f5ead0" roughness={0.4} metalness={0.1} />
      </mesh>

      <mesh position={[0, -height / 2 - 0.03, 0]} castShadow>
        <torusGeometry args={[radius * 1.01, 0.06, 12, 48]} />
        <meshStandardMaterial color="#f5ead0" roughness={0.4} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius + 0.004, radius + 0.004, height * 0.25, 64, 1, true]} />
        <meshStandardMaterial
          color="#e9b13a"
          roughness={0.25}
          metalness={0.85}
          emissive="#916018"
          emissiveIntensity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function GoldPearl({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <mesh position={position} castShadow scale={scale}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color="#f5e9c6"
        roughness={0.15}
        metalness={0.9}
        emissive="#916018"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function PearlRing({
  radius,
  y,
  count,
}: {
  radius: number;
  y: number;
  count: number;
}) {
  const pearls = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      arr.push([Math.cos(a) * radius, y, Math.sin(a) * radius]);
    }
    return arr;
  }, [radius, y, count]);

  return (
    <group>
      {pearls.map((p, i) => (
        <GoldPearl key={i} position={p} />
      ))}
    </group>
  );
}

function Rose({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const petals = useMemo(() => {
    const arr: { rot: [number, number, number]; pos: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      arr.push({
        rot: [0.3, a, 0],
        pos: [Math.cos(a) * 0.035, 0, Math.sin(a) * 0.035],
        s: 0.6 - i * 0.07,
      });
    }
    return arr;
  }, []);

  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#fff5f5" roughness={0.5} metalness={0.05} />
      </mesh>
      {petals.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot} scale={p.s} castShadow>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color="#fff0f0" roughness={0.45} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function RoseCluster({
  radius,
  y,
  count = 4,
}: {
  radius: number;
  y: number;
  count?: number;
}) {
  const roses = useMemo(() => {
    const arr: { pos: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + 0.3;
      arr.push({
        pos: [Math.cos(a) * radius, y, Math.sin(a) * radius],
        s: 0.7 + Math.random() * 0.25,
      });
    }
    return arr;
  }, [radius, y, count]);

  return (
    <group>
      {roses.map((r, i) => (
        <Rose key={i} position={r.pos} scale={r.s} />
      ))}
    </group>
  );
}

function Candle({
  position,
  flameRef,
}: {
  position: [number, number, number];
  flameRef: React.MutableRefObject<THREE.PointLight | null>;
}) {
  const flameMeshRef = useRef<THREE.Mesh>(null);
  const emberRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.85 + Math.sin(t * 12 + position[0] * 3) * 0.1 + Math.sin(t * 7) * 0.05;
    if (flameRef.current) {
      flameRef.current.intensity = flicker * 2.5;
    }
    if (flameMeshRef.current) {
      flameMeshRef.current.scale.y = 1 + Math.sin(t * 15 + position[2] * 2) * 0.15;
      flameMeshRef.current.scale.x = 1 + Math.sin(t * 10) * 0.08;
    }
    if (emberRef.current) {
      emberRef.current.position.y = 0.15 + ((t * 0.3 + position[0]) % 0.5);
      const mat = emberRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.6 - ((t * 0.3 + position[0]) % 0.5));
    }
  });

  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.3, 16]} />
        <meshStandardMaterial color="#fffaf0" roughness={0.3} metalness={0.05} />
      </mesh>

      <mesh position={[0, 0.165, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.03, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>

      <mesh ref={flameMeshRef} position={[0, 0.21, 0]}>
        <coneGeometry args={[0.03, 0.1, 12]} />
        <meshBasicMaterial color="#ffcc44" transparent opacity={0.9} />
      </mesh>

      <mesh position={[0, 0.19, 0]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color="#ffaa22" transparent opacity={0.85} />
      </mesh>

      <mesh ref={emberRef} position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.5} />
      </mesh>

      <pointLight
        ref={flameRef}
        position={[0, 0.22, 0]}
        color="#ffbb55"
        intensity={2.5}
        distance={3}
        decay={2}
        castShadow
      />
    </group>
  );
}

/* ── 3D calligraphy text on cake top ── */

function CakeText() {
  const topY = 0.68; // top surface of top tier
  return (
    <group position={[0, topY + 0.005, 0]}>
      <Text
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.075}
        color="#e9b13a"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
        textAlign="center"
        outlineWidth={0.004}
        outlineColor="#b87d1c"
        letterSpacing={0.01}
      >
        Happy Birthday Kumkum
      </Text>
      <Text
        position={[0, 0, 0.12]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.04}
        color="#d4a045"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.6}
        textAlign="center"
        outlineWidth={0.002}
        outlineColor="#916018"
      >
        Made with Love
      </Text>
    </group>
  );
}

export function CakeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.01;
    }
  });

  // Candles arranged in oval around text — front & back rows, center clear
  const candlePositions: [number, number, number][] = useMemo(() => {
    const topY = 0.68;
    const candleBaseY = topY + 0.15; // half candle height
    const arr: [number, number, number][] = [
      // Front row
      [-0.22, candleBaseY, 0.22],
      [0, candleBaseY, 0.26],
      [0.22, candleBaseY, 0.22],
      // Back row
      [-0.22, candleBaseY, -0.22],
      [0, candleBaseY, -0.26],
      [0.22, candleBaseY, -0.22],
    ];
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Bottom tier */}
      <CakeTier radius={0.85} height={0.35} positionY={0} />
      <PearlRing radius={0.87} y={0} count={14} />
      <RoseCluster radius={0.83} y={0.2} count={4} />

      {/* Middle tier */}
      <CakeTier radius={0.62} height={0.28} positionY={0.32} />
      <PearlRing radius={0.64} y={0.32} count={10} />
      <RoseCluster radius={0.6} y={0.48} count={3} />

      {/* Top tier */}
      <CakeTier radius={0.42} height={0.22} positionY={0.57} />
      <PearlRing radius={0.44} y={0.57} count={8} />

      {/* 3D calligraphy on top surface */}
      <CakeText />

      {/* Candles around text */}
      {candlePositions.map((pos, i) => (
        <Candle key={i} position={pos} flameRef={flameLightRef} />
      ))}

      {/* Cake board */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.03, 64]} />
        <meshStandardMaterial
          color="#e9b13a"
          roughness={0.2}
          metalness={0.9}
          emissive="#916018"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
