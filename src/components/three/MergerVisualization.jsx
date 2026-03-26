import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Seeded random for deterministic results
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Point cloud road component
const PointCloudRoad = ({ startPosition, endPosition, color, isDark, roadWidth = 0.15, density = 200 }) => {
  const pointsRef = useRef(null);

  const { positions, colors, count } = useMemo(() => {
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);
    
    // Create a smooth curve with control points
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2 + 0.2,
      (start.z + end.z) / 2
    );
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const curvePoints = curve.getPoints(density);
    
    // Generate points across the road width
    const pointsPerSegment = 5; // Points across width
    const count = curvePoints.length * pointsPerSegment;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < curvePoints.length; i++) {
      const point = curvePoints[i];
      let tangent;
      
      if (i < curvePoints.length - 1) {
        tangent = curvePoints[i + 1].clone().sub(point).normalize();
      } else {
        tangent = point.clone().sub(curvePoints[i - 1]).normalize();
      }

      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      
      for (let j = 0; j < pointsPerSegment; j++) {
        const idx = i * pointsPerSegment + j;
        const offset = (j / (pointsPerSegment - 1) - 0.5) * roadWidth;
        const offsetPoint = point.clone().add(right.clone().multiplyScalar(offset));
        
        // Add slight random variation for natural look
        offsetPoint.x += (seededRandom(idx * 1.1) - 0.5) * 0.01;
        offsetPoint.y += (seededRandom(idx * 2.2) - 0.5) * 0.01;
        offsetPoint.z += (seededRandom(idx * 3.3) - 0.5) * 0.01;
        
        positions[idx * 3] = offsetPoint.x;
        positions[idx * 3 + 1] = offsetPoint.y;
        positions[idx * 3 + 2] = offsetPoint.z;
        
        // Edge points are brighter
        const edgeFactor = Math.abs(j / (pointsPerSegment - 1) - 0.5) * 2;
        const brightness = 0.7 + edgeFactor * 0.3;
        
        colors[idx * 3] = colorObj.r * brightness;
        colors[idx * 3 + 1] = colorObj.g * brightness;
        colors[idx * 3 + 2] = colorObj.b * brightness;
      }
    }
    
    return { positions, colors, count };
  }, [startPosition, endPosition, color, roadWidth, density]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
};

// Merged output road - wider point cloud
const MergedPointCloudRoad = ({ startPosition, endPosition, color, isDark }) => {
  const pointsRef = useRef(null);
  const glowRef = useRef(null);

  const { positions, colors, count } = useMemo(() => {
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);
    
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2 - 0.15,
      (start.z + end.z) / 2
    );
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const curvePoints = curve.getPoints(150);
    
    const roadWidth = 0.22;
    const pointsPerSegment = 8;
    const count = curvePoints.length * pointsPerSegment;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < curvePoints.length; i++) {
      const point = curvePoints[i];
      let tangent;
      
      if (i < curvePoints.length - 1) {
        tangent = curvePoints[i + 1].clone().sub(point).normalize();
      } else {
        tangent = point.clone().sub(curvePoints[i - 1]).normalize();
      }

      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      
      for (let j = 0; j < pointsPerSegment; j++) {
        const idx = i * pointsPerSegment + j;
        const offset = (j / (pointsPerSegment - 1) - 0.5) * roadWidth;
        const offsetPoint = point.clone().add(right.clone().multiplyScalar(offset));
        
        offsetPoint.x += (seededRandom(idx * 1.5) - 0.5) * 0.008;
        offsetPoint.y += (seededRandom(idx * 2.5) - 0.5) * 0.008;
        offsetPoint.z += (seededRandom(idx * 3.5) - 0.5) * 0.008;
        
        positions[idx * 3] = offsetPoint.x;
        positions[idx * 3 + 1] = offsetPoint.y;
        positions[idx * 3 + 2] = offsetPoint.z;
        
        const edgeFactor = Math.abs(j / (pointsPerSegment - 1) - 0.5) * 2;
        const brightness = 0.8 + edgeFactor * 0.2;
        
        colors[idx * 3] = colorObj.r * brightness;
        colors[idx * 3 + 1] = colorObj.g * brightness;
        colors[idx * 3 + 2] = colorObj.b * brightness;
      }
    }
    
    return { positions, colors, count };
  }, [startPosition, endPosition, color]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.12 + Math.sin(time * 2) * 0.04;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

// Central merger node - point cloud style
const MergerNode = ({ position, isDark }) => {
  const nodeRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  const coreColor = isDark ? "#6366f1" : "#dc2626";
  const accentColor = isDark ? "#8b5cf6" : "#ea580c";

  // Generate point cloud for the circular node
  const { positions, colors, count } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const coreColorObj = new THREE.Color(coreColor);
    const accentColorObj = new THREE.Color(accentColor);
    
    for (let i = 0; i < count; i++) {
      const angle = seededRandom(i * 1.1) * Math.PI * 2;
      const radius = seededRandom(i * 2.2) * 0.35;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (seededRandom(i * 3.3) - 0.5) * 0.1;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Color gradient from center to edge
      const t = radius / 0.35;
      const colorObj = coreColorObj.clone().lerp(accentColorObj, t);
      
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }
    
    return { positions, colors, count };
  }, [coreColor, accentColor]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (nodeRef.current) {
      // Subtle pulsing
      const scale = 1 + Math.sin(time * 2) * 0.05;
      nodeRef.current.scale.setScalar(scale);
    }
    
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.2 + Math.sin(time * 2) * 0.08;
    }
  });

  return (
    <group position={position}>
      {/* Point cloud node */}
      <points ref={nodeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// Flowing particles along the roads
const FlowingParticles = ({ roads, mergerPosition, isDark }) => {
  const particlesRef = useRef(null);
  
  const { positions, colors, velocities, count } = useMemo(() => {
    const particlesPerRoad = 30;
    const count = roads.length * particlesPerRoad;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];
    
    roads.forEach((road, roadIdx) => {
      const baseIdx = roadIdx * particlesPerRoad;
      const color = road.particleColor;
      
      for (let i = 0; i < particlesPerRoad; i++) {
        const idx = baseIdx + i;
        const t = seededRandom(idx * 1.5);
        
        const start = new THREE.Vector3(...road.start);
        const end = new THREE.Vector3(...mergerPosition);
        const mid = new THREE.Vector3(
          (start.x + end.x) / 2,
          (start.y + end.y) / 2 + 0.2,
          (start.z + end.z) / 2
        );
        
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const point = curve.getPoint(t);
        
        positions[idx * 3] = point.x;
        positions[idx * 3 + 1] = point.y + 0.02;
        positions[idx * 3 + 2] = point.z;
        
        colors[idx * 3] = color[0];
        colors[idx * 3 + 1] = color[1];
        colors[idx * 3 + 2] = color[2];
        
        velocities.push({
          speed: 0.12 + seededRandom(idx * 2.1) * 0.08,
          offset: seededRandom(idx * 3.2),
          roadIdx,
          start,
          mid,
          end
        });
      }
    });
    
    return { positions, colors, velocities, count };
  }, [roads, mergerPosition, isDark]);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const posArray = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      const t = (time * v.speed + v.offset) % 1;
      
      const curve = new THREE.QuadraticBezierCurve3(v.start, v.mid, v.end);
      const point = curve.getPoint(t);
      
      posArray[i * 3] = point.x;
      posArray[i * 3 + 1] = point.y + 0.02;
      posArray[i * 3 + 2] = point.z;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Output stream particles
const OutputParticles = ({ startPosition, endPosition, color, isDark }) => {
  const particlesRef = useRef(null);
  
  const { positions, velocities, count } = useMemo(() => {
    const count = 25;
    const positions = new Float32Array(count * 3);
    const velocities = [];
    
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2 - 0.15,
      (start.z + end.z) / 2
    );
    
    for (let i = 0; i < count; i++) {
      const t = seededRandom(i * 1.7);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const point = curve.getPoint(t);
      
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y + 0.02;
      positions[i * 3 + 2] = point.z;
      
      velocities.push({
        speed: 0.1 + seededRandom(i * 2.3) * 0.06,
        offset: seededRandom(i * 3.4),
        start,
        mid,
        end
      });
    }
    
    return { positions, velocities, count };
  }, [startPosition, endPosition]);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const time = clock.getElapsedTime();
    const posArray = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      const t = (time * v.speed + v.offset) % 1;
      
      const curve = new THREE.QuadraticBezierCurve3(v.start, v.mid, v.end);
      const point = curve.getPoint(t);
      
      posArray[i * 3] = point.x;
      posArray[i * 3 + 1] = point.y + 0.02;
      posArray[i * 3 + 2] = point.z;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Start point indicator - point cloud style
const StartNode = ({ position, color }) => {
  const pointsRef = useRef(null);
  const glowRef = useRef(null);

  const { positions, colors, count } = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      const phi = seededRandom(i * 1.1) * Math.PI * 2;
      const theta = seededRandom(i * 2.2) * Math.PI;
      const radius = 0.08 + seededRandom(i * 3.3) * 0.04;
      
      positions[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
      positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
      positions[i * 3 + 2] = Math.cos(theta) * radius;
      
      const brightness = 0.7 + seededRandom(i * 4.4) * 0.3;
      colors[i * 3] = colorObj.r * brightness;
      colors[i * 3 + 1] = colorObj.g * brightness;
      colors[i * 3 + 2] = colorObj.b * brightness;
    }
    
    return { positions, colors, count };
  }, [color]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 2.5 + position[0]) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// End point indicator - point cloud style
const EndNode = ({ position, color }) => {
  const pointsRef = useRef(null);
  const glowRef = useRef(null);

  const { positions, colors, count } = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      const phi = seededRandom(i * 1.2) * Math.PI * 2;
      const theta = seededRandom(i * 2.3) * Math.PI;
      const radius = 0.1 + seededRandom(i * 3.4) * 0.05;
      
      positions[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
      positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
      positions[i * 3 + 2] = Math.cos(theta) * radius;
      
      const brightness = 0.8 + seededRandom(i * 4.5) * 0.2;
      colors[i * 3] = colorObj.r * brightness;
      colors[i * 3 + 1] = colorObj.g * brightness;
      colors[i * 3 + 2] = colorObj.b * brightness;
    }
    
    return { positions, colors, count };
  }, [color]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
        />
      </points>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const MergerVisualization = ({ isDark = true }) => {
  const groupRef = useRef(null);

  // Road configurations - positioned so all roads are clearly visible
  // Roads spread out more in Z direction for better visibility
  const mergerPosition = [0, 0, 0];
  const outputEnd = [2, -0.3, 0];
  
  const inputRoads = useMemo(() => [
    {
      start: [-2.2, 0.8, -1.2],  // Top-back road
      color: isDark ? "#22d3ee" : "#dc2626", // Cyan / Red
      particleColor: isDark ? [0.13, 0.83, 0.93] : [0.86, 0.15, 0.15],
    },
    {
      start: [-2.2, 0, 0],       // Middle road
      color: isDark ? "#a855f7" : "#ea580c", // Purple / Orange
      particleColor: isDark ? [0.66, 0.33, 0.97] : [0.92, 0.35, 0.05],
    },
    {
      start: [-2.2, -0.8, 1.2],  // Bottom-front road
      color: isDark ? "#22c55e" : "#16a34a", // Green
      particleColor: isDark ? [0.13, 0.77, 0.37] : [0.09, 0.64, 0.29],
    },
  ], [isDark]);

  const outputColor = isDark ? "#6366f1" : "#dc2626";

  // NO ROTATION - static view
  // Remove the useFrame rotation

  return (
    <group ref={groupRef} position={[0, 0, 1]}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight 
        position={[3, 3, 3]} 
        intensity={0.7} 
        color={isDark ? "#818cf8" : "#fcd34d"}
      />
      <pointLight 
        position={[-3, 2, -2]} 
        intensity={0.4} 
        color={isDark ? "#22d3ee" : "#fb923c"}
      />

      {/* Input roads - point cloud style */}
      {inputRoads.map((road, idx) => (
        <PointCloudRoad
          key={`road-${idx}`}
          startPosition={road.start}
          endPosition={mergerPosition}
          color={road.color}
          isDark={isDark}
        />
      ))}

      {/* Central merger node */}
      <MergerNode position={mergerPosition} isDark={isDark} />

      {/* Merged output road */}
      <MergedPointCloudRoad
        startPosition={mergerPosition}
        endPosition={outputEnd}
        color={outputColor}
        isDark={isDark}
      />

      {/* Flowing particles on input roads */}
      <FlowingParticles
        roads={inputRoads}
        mergerPosition={mergerPosition}
        isDark={isDark}
      />

      {/* Output stream particles */}
      <OutputParticles
        startPosition={mergerPosition}
        endPosition={outputEnd}
        color={outputColor}
        isDark={isDark}
      />

      {/* Start point indicators */}
      {inputRoads.map((road, idx) => (
        <StartNode
          key={`start-${idx}`}
          position={road.start}
          color={road.color}
        />
      ))}

      {/* End point indicator */}
      <EndNode position={outputEnd} color={outputColor} />
    </group>
  );
};

export default MergerVisualization;
