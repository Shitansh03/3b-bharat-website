import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { feature as topojsonFeature } from "topojson-client";
import { getCountryByName } from "../../data/countriesData";

// Theme-aware colors for ConnectModal 3D Globe
const getThemeColors = (isDark) => ({
  pointColor: isDark ? "#10b981" : "#059669",
  ringColor: isDark ? "#34d399" : "#10b981",
  atmosphereColor: isDark ? "#10b981" : "#6ee7b7",
  globeColor: isDark ? "#0f172a" : "#e7e5e4",
  emissiveColor: isDark ? "#064e3b" : "#d1fae5",
  ambientIntensity: isDark ? 0.7 : 1.1,
  directionalIntensity: isDark ? 0.9 : 0.6,
  pointLightColor: "#10b981",
  // Country polygons
  polygonColor: isDark ? "#334155" : "#78716c",
  polygonSideColor: isDark ? "rgba(30, 41, 59, 0.85)" : "rgba(168, 162, 158, 0.85)",
  polygonStrokeColor: isDark ? "#475569" : "#a8a29e",
  // Active selected country highlight
  highlightPolygonColor: "#10b981",
  highlightSideColor: "rgba(16, 185, 129, 0.9)",
  highlightStrokeColor: "#34d399",
});

const ConnectGlobe = ({ selectedCountry = null, isDark = true }) => {
  const groupRef = useRef();
  const controlsRef = useRef();
  const [countriesFeatures, setCountriesFeatures] = useState([]);
  const targetRotationY = useRef(-Math.PI * 0.43); // Defaults to India
  const targetRotationX = useRef(0.18);
  const isAutoRotating = useRef(true);
  const autoRotateTimer = useRef(null);

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const activeCountryData = useMemo(() => getCountryByName(selectedCountry), [selectedCountry]);

  // Create globe instance once
  const globeInstance = useMemo(() => {
    try {
      const initColors = getThemeColors(isDark);
      const globe = new ThreeGlobe({ animateIn: false })
        .showAtmosphere(true)
        .atmosphereColor(initColors.atmosphereColor)
        .atmosphereAltitude(0.14);

      const globeMaterial = globe.globeMaterial();
      if (globeMaterial) {
        globeMaterial.color = new THREE.Color(initColors.globeColor);
        globeMaterial.emissive = new THREE.Color(initColors.emissiveColor);
        globeMaterial.emissiveIntensity = isDark ? 0.25 : 0.08;
        globeMaterial.shininess = 15;
        globeMaterial.transparent = false;
      }

      globe.showGraticules(true);
      return globe;
    } catch (e) {
      console.error("[ConnectGlobe] Error initializing globe:", e);
      return null;
    }
  }, []);

  // Fetch world-atlas TopoJSON once
  useEffect(() => {
    let isMounted = true;
    fetch("https://unpkg.com/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topoData) => {
        if (!isMounted) return;
        const features = topojsonFeature(topoData, topoData.objects.countries).features;
        setCountriesFeatures(features);
      })
      .catch((err) => console.warn("[ConnectGlobe] Error loading countries GeoJSON:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync country polygons whenever features, theme, or selectedCountry changes
  useEffect(() => {
    if (!globeInstance || countriesFeatures.length === 0) return;

    const targetGeoName = activeCountryData?.geoName?.toLowerCase();
    const targetName = activeCountryData?.name?.toLowerCase();

    globeInstance
      .polygonsData(countriesFeatures)
      .polygonCapColor((feat) => {
        const featName = feat.properties?.name?.toLowerCase();
        const isSelected =
          Boolean(targetGeoName || targetName) &&
          (featName === targetGeoName || featName === targetName);
        return isSelected ? colors.highlightPolygonColor : colors.polygonColor;
      })
      .polygonSideColor((feat) => {
        const featName = feat.properties?.name?.toLowerCase();
        const isSelected =
          Boolean(targetGeoName || targetName) &&
          (featName === targetGeoName || featName === targetName);
        return isSelected ? colors.highlightSideColor : colors.polygonSideColor;
      })
      .polygonStrokeColor((feat) => {
        const featName = feat.properties?.name?.toLowerCase();
        const isSelected =
          Boolean(targetGeoName || targetName) &&
          (featName === targetGeoName || featName === targetName);
        return isSelected ? colors.highlightStrokeColor : colors.polygonStrokeColor;
      })
      .polygonAltitude((feat) => {
        const featName = feat.properties?.name?.toLowerCase();
        const isSelected =
          Boolean(targetGeoName || targetName) &&
          (featName === targetGeoName || featName === targetName);
        return isSelected ? 0.08 : 0.01;
      });

    // If a country is selected, add a glowing focal point & pulsing ring at its coordinates
    if (activeCountryData) {
      const pinPoint = [{
        lat: activeCountryData.lat,
        lng: activeCountryData.lng,
        size: 1.2,
      }];

      globeInstance
        .pointsData(pinPoint)
        .pointAltitude(0.08)
        .pointColor(() => "#10b981")
        .pointRadius(0.8)
        .ringsData(pinPoint)
        .ringColor(() => "#34d399")
        .ringMaxRadius(4)
        .ringPropagationSpeed(2.5)
        .ringRepeatPeriod(1200);

      // Smoothly navigate camera/globe to face the selected country
      // Longitude maps directly to Y rotation: - (lng in radians)
      targetRotationY.current = -((activeCountryData.lng * Math.PI) / 180);
      targetRotationX.current = Math.max(-0.4, Math.min(0.4, (activeCountryData.lat * Math.PI) / 360));

      // Pause continuous spin for 5 seconds to let the user admire the selected country
      isAutoRotating.current = false;
      if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
      autoRotateTimer.current = setTimeout(() => {
        isAutoRotating.current = true;
      }, 5000);
    } else {
      // Clear points/rings if no country selected
      globeInstance.pointsData([]);
      globeInstance.ringsData([]);
      isAutoRotating.current = true;
    }
  }, [globeInstance, countriesFeatures, activeCountryData, colors]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
    };
  }, []);

  // Smooth frame loop for rotation and transition
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!isAutoRotating.current) {
      // Smoothly lerp to target orientation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY.current,
        Math.min(1, delta * 3.5)
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX.current,
        Math.min(1, delta * 3.5)
      );
    } else {
      // Idle continuous slow rotation
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.1,
        Math.min(1, delta * 2)
      );
    }
  });

  if (!globeInstance) return null;

  return (
    <>
      <ambientLight intensity={colors.ambientIntensity} color="#ffffff" />
      <directionalLight position={[3, 2, 3]} intensity={colors.directionalIntensity} color="#ffffff" />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} color={isDark ? "#059669" : "#10b981"} />
      <pointLight position={[5, 3, 5]} intensity={0.6} color={colors.pointLightColor} />

      <group ref={groupRef} scale={[0.015, 0.015, 0.015]}>
        <primitive object={globeInstance} />
      </group>

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
        rotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

export default ConnectGlobe;
