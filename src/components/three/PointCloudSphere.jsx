import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Seeded random number generator for consistent results
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Pre-calculate particle data outside component
const PARTICLE_COUNT = 2000;
const RADIUS = 2.5;

// Core structure constants
const CORE_PARTICLE_COUNT = 100;
const CORE_RADIUS = 0.3;
const RAY_COUNT = 8;

// Create core particle data
const createCoreParticles = () => {
  const positions = new Float32Array(CORE_PARTICLE_COUNT * 3);

  for (let i = 0; i < CORE_PARTICLE_COUNT; i++) {
    const phi = Math.acos(-1 + (2 * i) / CORE_PARTICLE_COUNT);
    const theta = Math.sqrt(CORE_PARTICLE_COUNT * Math.PI) * phi;
    const r = CORE_RADIUS * (0.5 + seededRandom(i * 3.14) * 0.5);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  return positions;
};

// Create light rays emanating from core
const createRayPositions = () => {
  const positions = [];

  for (let i = 0; i < RAY_COUNT; i++) {
    const phi = Math.acos(-1 + (2 * i) / RAY_COUNT);
    const theta = (i / RAY_COUNT) * Math.PI * 2;

    // Ray start (at core surface)
    const startR = 0.15;
    positions.push(
      startR * Math.sin(phi) * Math.cos(theta),
      startR * Math.sin(phi) * Math.sin(theta),
      startR * Math.cos(phi)
    );

    // Ray end (extending outward)
    const endR = 0.6 + seededRandom(i * 5) * 0.3;
    positions.push(
      endR * Math.sin(phi) * Math.cos(theta),
      endR * Math.sin(phi) * Math.sin(theta),
      endR * Math.cos(phi)
    );
  }

  return new Float32Array(positions);
};

const coreParticlePositions = createCoreParticles();
const rayPositions = createRayPositions();

const createParticleData = (isDark = true) => {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
    const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
    const noiseRadius = RADIUS + (seededRandom(i * 1.5) - 0.5) * 0.5;

    positions[i * 3] = noiseRadius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = noiseRadius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = noiseRadius * Math.cos(phi);

    const brightness = isDark
      ? 0.3 + seededRandom(i * 2.7) * 0.3 // Gray particles for dark theme
      : 0; // Black particles for light theme
    colors[i * 3] = brightness;
    colors[i * 3 + 1] = brightness;
    colors[i * 3 + 2] = brightness;
  }

  const linePositions = [];
  const connectionDistance = 0.8;

  for (let i = 0; i < PARTICLE_COUNT; i += 10) {
    for (let j = i + 1; j < Math.min(i + 50, PARTICLE_COUNT); j += 5) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < connectionDistance) {
        linePositions.push(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2],
          positions[j * 3],
          positions[j * 3 + 1],
          positions[j * 3 + 2]
        );
      }
    }
  }

  return { positions, colors, linePositions: new Float32Array(linePositions) };
};

// Create data for both themes
const particleDataDark = createParticleData(true);
const particleDataLight = createParticleData(false);

const PointCloudSphere = ({ mouse, isDark = true }) => {
  const groupRef = useRef(null);
  const pointsRef = useRef(null);
  const linesRef = useRef(null);
  const glowRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });

  // Core refs
  const coreRef = useRef(null);
  const coreGlowRef = useRef(null);
  const coreOuterGlowRef = useRef(null);
  const coreParticlesRef = useRef(null);
  const coreRaysRef = useRef(null);

  // Store mouse values in ref to avoid re-renders affecting animation
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mouseRef.current = { x: mouse?.x || 0, y: mouse?.y || 0 };
  }, [mouse?.x, mouse?.y]);

  // Update colors when theme changes
  useEffect(() => {
    const particleData = isDark ? particleDataDark : particleDataLight;

    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      geometry.attributes.color.array.set(particleData.colors);
      geometry.attributes.color.needsUpdate = true;
    }

    if (linesRef.current) {
      linesRef.current.material.color.set(isDark ? "#666666" : "#000000");
      linesRef.current.material.opacity = isDark ? 0.2 : 0.3;
    }

    if (glowRef.current) {
      glowRef.current.material.color.set(isDark ? "#888888" : "#333333");
      glowRef.current.material.opacity = isDark ? 0.15 : 0.1;
    }
  }, [isDark]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    const time = clock.getElapsedTime();
    const targetRotationX = mouseRef.current.y * 0.3;
    const targetRotationY = mouseRef.current.x * 0.3 + time * 0.1;

    // Smooth interpolation
    rotationRef.current.x += (targetRotationX - rotationRef.current.x) * 0.05;
    rotationRef.current.y += (targetRotationY - rotationRef.current.y) * 0.05;

    group.rotation.x = rotationRef.current.x;
    group.rotation.y = rotationRef.current.y;

    // Breathing scale effect
    const scale = 1 + Math.sin(time * 0.5) * 0.03;
    group.scale.set(scale, scale, scale);

    // Core animations
    if (coreRef.current) {
      // Pulsing core
      const coreScale = 1 + Math.sin(time * 2) * 0.15;
      coreRef.current.scale.set(coreScale, coreScale, coreScale);

      // Update core emissive intensity
      const intensity = 0.5 + Math.sin(time * 2) * 0.3;
      coreRef.current.material.emissiveIntensity = intensity;
    }

    if (coreGlowRef.current) {
      // Inner glow pulsing (opposite phase)
      const glowScale = 1 + Math.sin(time * 2 + Math.PI) * 0.1;
      coreGlowRef.current.scale.set(glowScale, glowScale, glowScale);
      coreGlowRef.current.material.opacity = isDark
        ? 0.3 + Math.sin(time * 2) * 0.15
        : 0.2 + Math.sin(time * 2) * 0.1;
    }

    if (coreOuterGlowRef.current) {
      // Outer glow subtle pulse
      const outerScale = 1 + Math.sin(time * 1.5) * 0.08;
      coreOuterGlowRef.current.scale.set(outerScale, outerScale, outerScale);
      coreOuterGlowRef.current.material.opacity = isDark
        ? 0.15 + Math.sin(time * 1.5) * 0.08
        : 0.1 + Math.sin(time * 1.5) * 0.05;
    }

    if (coreParticlesRef.current) {
      // Rotate core particles independently
      coreParticlesRef.current.rotation.y = time * 0.5;
      coreParticlesRef.current.rotation.x = time * 0.3;
    }

    if (coreRaysRef.current) {
      // Rotate rays slowly
      coreRaysRef.current.rotation.y = -time * 0.2;
      coreRaysRef.current.rotation.z = time * 0.15;
      // Pulse ray opacity
      coreRaysRef.current.material.opacity = isDark
        ? 0.4 + Math.sin(time * 3) * 0.2
        : 0.3 + Math.sin(time * 3) * 0.15;
    }
  });

  const particleData = isDark ? particleDataDark : particleDataLight;

  return (
    <group ref={groupRef}>
      {/* Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={particleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={particleData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={1.0}
          sizeAttenuation
          blending={THREE.NormalBlending}
        />
      </points>

      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.linePositions.length / 3}
            array={particleData.linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isDark ? "#666666" : "#333333"}
          transparent
          opacity={isDark ? 0.2 : 0.3}
          blending={THREE.NormalBlending}
        />
      </lineSegments>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color={isDark ? "#666666" : "#333333"}
          transparent
          opacity={isDark ? 0.15 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ===== CORE STRUCTURE ===== */}

      {/* Core outer glow - largest, most diffuse */}
      <mesh ref={coreOuterGlowRef}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial
          color={isDark ? "#ff9500" : "#cc7700"}
          transparent
          opacity={isDark ? 0.2 : 0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core inner glow */}
      <mesh ref={coreGlowRef}>
        <sphereGeometry args={[0.25, 20, 20]} />
        <meshBasicMaterial
          color={isDark ? "#ffcc00" : "#daa520"}
          transparent
          opacity={isDark ? 0.4 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core solid center */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.12, 1]} />
        <meshStandardMaterial
          color={isDark ? "#ffd700" : "#daa520"}
          emissive={isDark ? "#ff8c00" : "#b8860b"}
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Core orbiting particles */}
      <points ref={coreParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={CORE_PARTICLE_COUNT}
            array={coreParticlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color={isDark ? "#ffd700" : "#daa520"}
          transparent
          opacity={isDark ? 0.9 : 0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core light rays */}
      <lineSegments ref={coreRaysRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={rayPositions.length / 3}
            array={rayPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isDark ? "#ffaa00" : "#cc8800"}
          transparent
          opacity={isDark ? 0.5 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

export default PointCloudSphere;
