import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Seeded random for consistency
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// OPTIMIZED: Reduced particle count for better performance
const PARTICLE_COUNT = 500;
const FRAGMENT_COUNT = 15;
const SPHERE_RADIUS = 8;

// Pre-generate all data once (static)
const createStaticData = () => {
  // Particle positions
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const originalPositions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = seededRandom(i * 1.1) * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom(i * 2.2) - 1);
    const r = SPHERE_RADIUS * (0.3 + seededRandom(i * 3.3) * 0.7);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;
  }

  // Fragment data (static geometry positions)
  const fragments = [];
  for (let i = 0; i < FRAGMENT_COUNT; i++) {
    const theta = seededRandom(i * 10) * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom(i * 20) - 1);
    const r = 3 + seededRandom(i * 30) * 5;

    fragments.push({
      position: [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ],
      rotation: [
        seededRandom(i * 40) * Math.PI,
        seededRandom(i * 50) * Math.PI,
        seededRandom(i * 60) * Math.PI,
      ],
      scale: 0.15 + seededRandom(i * 70) * 0.25,
      type: Math.floor(seededRandom(i * 140) * 3),
    });
  }

  // Breaking lines (static)
  const linePositions = [];
  const lineCount = 20;
  for (let i = 0; i < lineCount; i++) {
    const angle1 = seededRandom(i * 200) * Math.PI * 2;
    const angle2 = seededRandom(i * 201) * Math.PI * 2;
    const r1 = 2 + seededRandom(i * 202) * 4;
    const r2 = 2 + seededRandom(i * 203) * 4;
    const y1 = (seededRandom(i * 204) - 0.5) * 8;
    const y2 = (seededRandom(i * 205) - 0.5) * 8;

    linePositions.push(
      Math.cos(angle1) * r1, y1, Math.sin(angle1) * r1,
      Math.cos(angle2) * r2, y2, Math.sin(angle2) * r2
    );
  }

  return {
    positions,
    originalPositions,
    fragments,
    linePositions: new Float32Array(linePositions),
  };
};

// Create static data once at module load
const staticData = createStaticData();

const ChaosParticles = ({ isDark = true, mouse = { x: 0, y: 0 } }) => {
  const groupRef = useRef();
  const particlesRef = useRef();
  const linesRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Clone positions for animation (only once)
  const animPositions = useMemo(
    () => new Float32Array(staticData.positions),
    []
  );

  useEffect(() => {
    mouseRef.current = { x: mouse?.x || 0, y: mouse?.y || 0 };
  }, [mouse?.x, mouse?.y]);

  // OPTIMIZED: Simplified animation loop
  useFrame(({ clock }) => {
    if (!particlesRef.current || !groupRef.current) return;

    const time = clock.getElapsedTime();

    // Simple rotation
    groupRef.current.rotation.y = time * 0.03;

    const posArray = particlesRef.current.geometry.attributes.position.array;
    const mouseX = mouseRef.current.x * 2;
    const mouseY = -mouseRef.current.y * 2;

    // OPTIMIZED: Update only every 3rd particle per frame for performance
    const startIdx = Math.floor(time * 100) % 3;

    for (let i = startIdx; i < PARTICLE_COUNT; i += 3) {
      const i3 = i * 3;

      // Get original position
      const ox = staticData.originalPositions[i3];
      const oy = staticData.originalPositions[i3 + 1];
      const oz = staticData.originalPositions[i3 + 2];

      // Simple sine-based displacement (much faster than noise)
      const offset = i * 0.01;
      const dx = Math.sin(time * 0.5 + offset) * 0.3;
      const dy = Math.cos(time * 0.4 + offset * 1.3) * 0.3;
      const dz = Math.sin(time * 0.6 + offset * 0.7) * 0.3;

      let x = ox + dx;
      let y = oy + dy;
      let z = oz + dz;

      // Simple mouse repulsion
      const distX = x - mouseX;
      const distY = y - mouseY;
      const dist = distX * distX + distY * distY;
      if (dist < 9) {
        const force = (3 - Math.sqrt(dist)) * 0.15;
        x += distX * force;
        y += distY * force;
      }

      posArray[i3] = x;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = z;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Animate line opacity
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.1 + Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={animPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={isDark ? "#ef4444" : "#b91c1c"}
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Static fragments (no per-frame animation) */}
      {staticData.fragments.map((frag, idx) => (
        <mesh
          key={idx}
          position={frag.position}
          rotation={frag.rotation}
          scale={frag.scale}
        >
          {frag.type === 0 ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : frag.type === 1 ? (
            <tetrahedronGeometry args={[1]} />
          ) : (
            <octahedronGeometry args={[1]} />
          )}
          <meshBasicMaterial
            color={isDark ? "#ef4444" : "#dc2626"}
            transparent
            opacity={0.12}
            wireframe
          />
        </mesh>
      ))}

      {/* Breaking connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={staticData.linePositions.length / 3}
            array={staticData.linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isDark ? "#f97316" : "#ea580c"}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Central warning indicator */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color={isDark ? "#f97316" : "#ea580c"}
          transparent
          opacity={0.25}
          wireframe
        />
      </mesh>

      {/* Orbiting rings (static) */}
      {[0, 1, 2].map((idx) => (
        <mesh
          key={`ring-${idx}`}
          rotation={[Math.PI / 2 + (idx * Math.PI) / 6, (idx * Math.PI) / 4, 0]}
        >
          <ringGeometry args={[3 + idx * 1.5, 3.08 + idx * 1.5, 48]} />
          <meshBasicMaterial
            color={isDark ? "#f97316" : "#c2410c"}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Ambient glow sphere */}
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS * 0.85, 24, 24]} />
        <meshBasicMaterial
          color={isDark ? "#7f1d1d" : "#991b1b"}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default ChaosParticles;
