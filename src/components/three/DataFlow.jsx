import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DataFlow = ({ isDark = true }) => {
  const groupRef = useRef(null);
  const particlesRef = useRef(null);
  const linesRef = useRef(null);

  // Create flowing particles representing data
  const { positions, colors, linePositions } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Create 3 layers representing the design framework
    const layers = [
      {
        y: 1.5,
        color: isDark ? [0.2, 0.8, 0.9] : [0.9, 0.3, 0.2],
        name: "Primary Frame",
      },
      {
        y: 0,
        color: isDark ? [0.6, 0.3, 0.9] : [0.9, 0.5, 0.1],
        name: "Material Layer",
      },
      {
        y: -1.5,
        color: isDark ? [0.3, 0.9, 0.5] : [0.2, 0.6, 0.4],
        name: "Measurement Layer",
      },
    ];

    for (let i = 0; i < count; i++) {
      const layerIndex = i % 3;
      const layer = layers[layerIndex];

      // Position in a circular flow pattern
      const angle = (i / count) * Math.PI * 6;
      const radius = 2 + Math.sin(angle * 0.5) * 0.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = layer.y + Math.sin(angle * 2) * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      colors[i * 3] = layer.color[0];
      colors[i * 3 + 1] = layer.color[1];
      colors[i * 3 + 2] = layer.color[2];
    }

    // Create connecting lines between layers
    const linePositions = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const z = Math.sin(angle) * 2;

      // Vertical connections
      linePositions.push(x, 1.5, z, x, 0, z);
      linePositions.push(x, 0, z, x, -1.5, z);
    }

    return {
      positions,
      colors,
      linePositions: new Float32Array(linePositions),
    };
  }, [isDark]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !particlesRef.current) return;

    const time = clock.getElapsedTime();

    // Rotate the entire structure
    groupRef.current.rotation.y = time * 0.1;

    // Animate particles
    const posArray = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < 500; i++) {
      const baseAngle = (i / 500) * Math.PI * 6;
      const angle = baseAngle + time * 0.3;
      const radius = 2 + Math.sin(angle * 0.5 + time) * 0.5;

      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={500}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isDark ? "#4a5568" : "#a8a29e"}
          transparent
          opacity={0.3}
        />
      </lineSegments>

      {/* Layer rings */}
      {[1.5, 0, -1.5].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.2, 64]} />
          <meshBasicMaterial
            color={
              isDark
                ? idx === 0
                  ? "#22d3ee"
                  : idx === 1
                  ? "#a855f7"
                  : "#22c55e"
                : idx === 0
                ? "#dc2626"
                : idx === 1
                ? "#ea580c"
                : "#16a34a"
            }
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default DataFlow;
