import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { feature as topojsonFeature } from "topojson-client";

// Use a smaller, lighter GeoJSON source for better performance
const COUNTRIES_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Indian cities data (constant, no need to recreate)
const INDIAN_CITIES = [
  { name: "New Delhi", lat: 28.6139, lng: 77.209, size: 0.8 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, size: 0.7 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, size: 0.5 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, size: 0.6 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, size: 0.6 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, size: 0.5 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, size: 0.4 },
  { name: "Pune", lat: 18.5204, lng: 73.8567, size: 0.4 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, size: 0.4 },
];

// Theme-aware colors - stylized/abstract look
const getThemeColors = (isDark) => ({
  pointColor: isDark ? "#22d3ee" : "#dc2626",
  ringColor: isDark ? "#a855f7" : "#dc2626",
  arcColors: isDark ? ["#22d3ee", "#a855f7"] : ["#ea580c", "#dc2626"],
  atmosphereColor: isDark ? "#6366f1" : "#fdba74",
  globeColor: isDark ? "#0f172a" : "#e7e5e4",
  emissiveColor: isDark ? "#1e1b4b" : "#d6d3d1",
  ambientIntensity: isDark ? 0.5 : 1.0,
  directionalIntensity: isDark ? 0.8 : 0.5,
  pointLightColor: isDark ? "#a855f7" : "#f97316",
  // Country polygon colors
  polygonColor: isDark ? "#334155" : "#60564fff",
  polygonSideColor: isDark
    ? "rgba(51, 65, 85, 0.8)"
    : "rgba(168, 162, 158, 0.8)",
  polygonStrokeColor: isDark ? "#475569" : "#78716c",
});

// Configure globe with points, arcs, and grid lines
const configureGlobe = (globe, isDark = true) => {
  if (!globe) return;

  const colors = getThemeColors(isDark);

  // Fetch and add country polygons
  fetch("https://unpkg.com/world-atlas@2/countries-110m.json")
    .then((res) => res.json())
    .then((topoData) => {
      // Convert TopoJSON to GeoJSON features
      const countries = topojsonFeature(
        topoData,
        topoData.objects.countries
      ).features;

      globe
        .polygonsData(countries)
        .polygonCapColor(() => colors.polygonColor)
        .polygonSideColor(() => colors.polygonSideColor)
        .polygonStrokeColor(() => colors.polygonStrokeColor)
        .polygonAltitude(0.01);
    })
    .catch((err) => console.warn("Error loading countries:", err));

  // Add city points
  globe
    .pointsData(INDIAN_CITIES)
    .pointAltitude(0.03)
    .pointColor(() => colors.pointColor)
    .pointRadius("size")
    .pointResolution(12);

  // Add pulsing rings
  globe
    .ringsData(INDIAN_CITIES)
    .ringColor(() => colors.ringColor)
    .ringMaxRadius(3)
    .ringPropagationSpeed(2)
    .ringRepeatPeriod(1500);

  // Add arcs from Delhi to other cities
  const arcsData = INDIAN_CITIES.slice(1).map((city) => ({
    startLat: 28.6139,
    startLng: 77.209,
    endLat: city.lat,
    endLng: city.lng,
    color: colors.arcColors,
  }));

  globe
    .arcsData(arcsData)
    .arcColor("color")
    .arcAltitude(0.1)
    .arcStroke(0.5)
    .arcDashLength(0.5)
    .arcDashGap(0.2)
    .arcDashAnimateTime(2000);

  // Add grid lines (graticules)
  globe.showGraticules(true);

  // Update atmosphere
  globe
    .atmosphereColor(colors.atmosphereColor)
    .atmosphereAltitude(isDark ? 0.15 : 0.12);
};

// Dispose of Three.js objects properly
const disposeGlobe = (globe) => {
  if (!globe) return;

  try {
    // Clear all data first
    globe.pointsData([]);
    globe.ringsData([]);
    globe.arcsData([]);
    globe.polygonsData([]);

    // Traverse and dispose geometries/materials
    globe.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  } catch (e) {
    console.warn("Error disposing globe:", e);
  }
};

const Globe = ({ isDark = true }) => {
  const groupRef = useRef();
  const controlsRef = useRef();
  const isReadyRef = useRef(false);

  const colors = getThemeColors(isDark);

  // Create globe instance once with useMemo
  const globeInstance = useMemo(() => {
    try {
      const initColors = getThemeColors(isDark);
      const globe = new ThreeGlobe({ animateIn: false })
        .showAtmosphere(true)
        .atmosphereColor(initColors.atmosphereColor)
        .atmosphereAltitude(isDark ? 0.12 : 0.08);

      // Use solid color material instead of texture
      const globeMaterial = globe.globeMaterial();
      if (globeMaterial) {
        globeMaterial.color = new THREE.Color(initColors.globeColor);
        globeMaterial.emissive = new THREE.Color(initColors.emissiveColor);
        globeMaterial.emissiveIntensity = isDark ? 0.2 : 0.05;
        globeMaterial.shininess = 10;
        globeMaterial.transparent = false;
      }

      return globe;
    } catch (e) {
      console.error("Error creating globe:", e);
      return null;
    }
  }, []);

  // Configure globe once on mount
  useEffect(() => {
    if (!globeInstance) return;

    // Configure with points/arcs (lightweight)
    configureGlobe(globeInstance, isDark);
    isReadyRef.current = true;

    // Cleanup on unmount
    return () => {
      isReadyRef.current = false;
      disposeGlobe(globeInstance);
    };
  }, [globeInstance]);

  // Update globe colors when theme changes
  useEffect(() => {
    if (!globeInstance || !isReadyRef.current) return;

    const colors = getThemeColors(isDark);

    // Update atmosphere
    globeInstance
      .atmosphereColor(colors.atmosphereColor)
      .atmosphereAltitude(isDark ? 0.12 : 0.08);

    // Update polygon colors
    globeInstance
      .polygonCapColor(() => colors.polygonColor)
      .polygonSideColor(() => colors.polygonSideColor)
      .polygonStrokeColor(() => colors.polygonStrokeColor);

    // Update points color
    globeInstance.pointColor(() => colors.pointColor);

    // Update rings color
    globeInstance.ringColor(() => colors.ringColor);

    // Update arcs
    const arcsData = INDIAN_CITIES.slice(1).map((city) => ({
      startLat: 28.6139,
      startLng: 77.209,
      endLat: city.lat,
      endLng: city.lng,
      color: colors.arcColors,
    }));
    globeInstance.arcsData(arcsData);

    // Update material colors for theme
    const globeMaterial = globeInstance.globeMaterial();
    if (globeMaterial) {
      globeMaterial.color = new THREE.Color(colors.globeColor);
      globeMaterial.emissive = new THREE.Color(colors.emissiveColor);
      globeMaterial.emissiveIntensity = isDark ? 0.2 : 0.05;
    }
  }, [isDark, globeInstance]);

  // Animation frame - only rotate when ready
  useFrame((state, delta) => {
    if (groupRef.current && isReadyRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Initial rotation to show India
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -Math.PI * 0.43;
    }
  }, []);

  if (!globeInstance) {
    return null;
  }

  return (
    <>
      {/* Lighting - OUTSIDE the scaled group */}
      <ambientLight intensity={colors.ambientIntensity} color="#ffffff" />
      <directionalLight
        position={[2, 1, 2]}
        intensity={colors.directionalIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-2, -1, -2]}
        intensity={isDark ? 0.3 : 0.4}
        color={isDark ? "#4a90d9" : "#0ea5e9"}
      />
      <pointLight
        position={[4, 2, 4]}
        intensity={isDark ? 0.5 : 0.3}
        color={colors.pointLightColor}
      />

      {/* Globe group with smaller scale to fit in container */}
      <group ref={groupRef} scale={[0.015, 0.015, 0.015]}>
        <primitive object={globeInstance} />
      </group>

      {/* Orbit controls - OUTSIDE the rotating group */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

export default Globe;
