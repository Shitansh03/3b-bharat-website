import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { feature as topojsonFeature } from "topojson-client";
import { getCountryByName, isCountryMatch } from "../../data/countriesData";

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

const ConnectGlobe = ({ selectedCountry = null, isDark = true, zoomSignal = 0 }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const controlsRef = useRef();
  const [countriesFeatures, setCountriesFeatures] = useState([]);
  
  // Interactive state
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const isUserInteracting = useRef(false);
  const isFocusingCountry = useRef(false);
  const targetCameraPos = useRef(null);
  const autoResumeTimer = useRef(null);

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

  // Sync country polygons and camera focus whenever activeCountryData changes
  useEffect(() => {
    if (!globeInstance || countriesFeatures.length === 0) return;

    // 1. Update polygon colors and altitudes
    globeInstance
      .polygonsData(countriesFeatures)
      .polygonCapColor((feat) => {
        const featName = feat.properties?.name;
        const isSelected = isCountryMatch(featName, activeCountryData);
        return isSelected ? colors.highlightPolygonColor : colors.polygonColor;
      })
      .polygonSideColor((feat) => {
        const featName = feat.properties?.name;
        const isSelected = isCountryMatch(featName, activeCountryData);
        return isSelected ? colors.highlightSideColor : colors.polygonSideColor;
      })
      .polygonStrokeColor((feat) => {
        const featName = feat.properties?.name;
        const isSelected = isCountryMatch(featName, activeCountryData);
        return isSelected ? colors.highlightStrokeColor : colors.polygonStrokeColor;
      })
      .polygonAltitude((feat) => {
        const featName = feat.properties?.name;
        const isSelected = isCountryMatch(featName, activeCountryData);
        return isSelected ? 0.09 : 0.01;
      });

    // 2. Add glowing pin point and smooth camera auto-rotation to chosen country
    if (activeCountryData) {
      const pinPoint = [{
        lat: activeCountryData.lat,
        lng: activeCountryData.lng,
        size: 1.2,
      }];

      globeInstance
        .pointsData(pinPoint)
        .pointAltitude(0.09)
        .pointColor(() => "#10b981")
        .pointRadius(0.8)
        .ringsData(pinPoint)
        .ringColor(() => "#34d399")
        .ringMaxRadius(4.2)
        .ringPropagationSpeed(2.6)
        .ringRepeatPeriod(1200);

      // Compute 3D target coordinates for the camera to look directly at this country
      try {
        const clampedLat = Math.max(-85, Math.min(85, activeCountryData.lat));
        const coords = globeInstance.getCoords(clampedLat, activeCountryData.lng, 0);
        if (coords) {
          const dir = new THREE.Vector3(coords.x, coords.y, coords.z).normalize();
          const currentDist = camera.position.length() || 6.2;
          const targetDist = Math.max(3.8, Math.min(currentDist, 6.2));
          targetCameraPos.current = dir.multiplyScalar(targetDist);
          isFocusingCountry.current = true;
          setIsAutoSpinning(false);

          if (autoResumeTimer.current) clearTimeout(autoResumeTimer.current);
          autoResumeTimer.current = setTimeout(() => {
            if (!isUserInteracting.current) {
              setIsAutoSpinning(true);
            }
          }, 4500);
        }
      } catch (e) {
        console.warn("[ConnectGlobe] Coordinate calculation error:", e);
      }
    } else {
      globeInstance.pointsData([]);
      globeInstance.ringsData([]);
      setIsAutoSpinning(true);
    }
  }, [globeInstance, countriesFeatures, activeCountryData, colors, camera]);

  // Handle external on-screen Zoom buttons (+ / -)
  useEffect(() => {
    if (!zoomSignal || !controlsRef.current) return;
    const currentDist = camera.position.length();
    // Negative distance moves closer to target = Zoom In; positive moves away = Zoom Out
    const step = zoomSignal > 0 ? -1.0 : 1.0;
    const newDist = Math.max(2.6, Math.min(currentDist + step, 9.2));
    const dir = camera.position.clone().normalize();
    targetCameraPos.current = dir.multiplyScalar(newDist);
    isFocusingCountry.current = true;
    setIsAutoSpinning(false);

    if (autoResumeTimer.current) clearTimeout(autoResumeTimer.current);
    autoResumeTimer.current = setTimeout(() => {
      if (!isUserInteracting.current) {
        setIsAutoSpinning(true);
      }
    }, 3000);
  }, [zoomSignal, camera]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoResumeTimer.current) clearTimeout(autoResumeTimer.current);
    };
  }, []);

  // Smooth animation frame loop for camera transition & damping
  useFrame((state, delta) => {
    if (isFocusingCountry.current && targetCameraPos.current && !isUserInteracting.current) {
      state.camera.position.lerp(targetCameraPos.current, Math.min(1, delta * 3.5));
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
      if (state.camera.position.distanceTo(targetCameraPos.current) < 0.05) {
        isFocusingCountry.current = false;
      }
    } else if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  if (!globeInstance) return null;

  return (
    <>
      <ambientLight intensity={colors.ambientIntensity} color="#ffffff" />
      <directionalLight position={[4, 3, 4]} intensity={colors.directionalIntensity} color="#ffffff" />
      <directionalLight position={[-4, -3, -4]} intensity={0.4} color={isDark ? "#059669" : "#10b981"} />
      <pointLight position={[6, 4, 6]} intensity={0.6} color={colors.pointLightColor} />

      <group ref={groupRef} scale={[0.015, 0.015, 0.015]}>
        <primitive object={globeInstance} />
      </group>

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={2.5}
        maxDistance={9.5}
        rotateSpeed={0.7}
        zoomSpeed={0.85}
        enableDamping={true}
        dampingFactor={0.06}
        autoRotate={isAutoSpinning && !isUserInteracting.current}
        autoRotateSpeed={0.75}
        onStart={() => {
          isUserInteracting.current = true;
          isFocusingCountry.current = false;
          setIsAutoSpinning(false);
          if (autoResumeTimer.current) clearTimeout(autoResumeTimer.current);
        }}
        onEnd={() => {
          isUserInteracting.current = false;
          if (autoResumeTimer.current) clearTimeout(autoResumeTimer.current);
          autoResumeTimer.current = setTimeout(() => {
            if (!isUserInteracting.current) {
              setIsAutoSpinning(true);
            }
          }, 3000);
        }}
      />
    </>
  );
};

export default ConnectGlobe;

