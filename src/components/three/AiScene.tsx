import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Stars,
  Torus,
  Icosahedron,
  MeshDistortMaterial,
  AdaptiveDpr,
} from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { PerfTier } from "@/hooks/usePerfTier";

// Semantic scene palette, mirroring the --primary / --violet / --background
// design tokens in src/styles.css (WebGL materials can't read CSS variables).
const ACCENT = "#6EE7FF";
const VIOLET = "#7C3AED";
const SCENE_BG = "#050505";
const SCENE_SURFACE = "#07171d";
const SCENE_LIGHT = "#ffffff";

/**
 * Per-tier workload budget. Composition and colours stay identical across
 * tiers — only resolution, geometry detail, particle counts and the
 * post-processing stack change.
 */
type Budget = {
  dpr: [number, number];
  antialias: boolean;
  particles: number;
  stars: number;
  coreDetail: number;
  shards: boolean;
  spotlight: boolean;
  rings: number;
  post: "none" | "bloom" | "full";
  pointerRig: boolean;
};

const BUDGETS: Record<PerfTier, Budget> = {
  "very-low": {
    dpr: [1, 1],
    antialias: false,
    particles: 180,
    stars: 0,
    coreDetail: 6,
    shards: false,
    spotlight: false,
    rings: 1,
    post: "none",
    pointerRig: false,
  },
  low: {
    dpr: [1, 1],
    antialias: false,
    particles: 300,
    stars: 300,
    coreDetail: 8,
    shards: false,
    spotlight: false,
    rings: 2,
    post: "none",
    pointerRig: false,
  },
  mid: {
    dpr: [1, 1.25],
    antialias: false,
    particles: 550,
    stars: 800,
    coreDetail: 14,
    shards: false,
    spotlight: false,
    rings: 3,
    post: "bloom",
    pointerRig: false,
  },
  high: {
    dpr: [1, 1.75],
    antialias: true,
    particles: 950,
    stars: 1800,
    coreDetail: 24,
    shards: true,
    spotlight: true,
    rings: 3,
    post: "full",
    pointerRig: true,
  },
};

function AiCore({ intensity = 1, detail = 24 }: { intensity?: number; detail?: number }) {
  const core = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y += delta * 0.16;
      core.current.rotation.x = Math.sin(t * 0.24) * 0.16;
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.1;
      wire.current.rotation.z += delta * 0.04;
      const s = 1.22 + Math.sin(t * 1.2) * 0.02;
      wire.current.scale.setScalar(s);
    }
    if (halo.current) {
      const s = 1.6 + Math.sin(t * 0.9) * 0.05;
      halo.current.scale.setScalar(s);
    }
  });

  return (
    <group scale={0.62}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1, detail]} />
        <MeshDistortMaterial
          color={SCENE_SURFACE}
          emissive={ACCENT}
          emissiveIntensity={0.22 * intensity}
          roughness={0.1}
          metalness={0.95}
          distort={0.34}
          speed={1.4}
        />
      </mesh>

      <mesh ref={wire}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.22} />
      </mesh>

      <mesh ref={halo}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function EnergyRings({ count = 3 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.08;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.25;
  });

  return (
    <group ref={group}>
      {[1.9, 2.35, 2.9].slice(0, count).map((r, i) => (
        <Torus key={r} args={[r, 0.006, 8, 96]} rotation={[Math.PI / 2.6 + i * 0.35, i * 0.4, 0]}>
          <meshBasicMaterial color={i % 2 ? VIOLET : ACCENT} transparent opacity={0.5 - i * 0.1} />
        </Torus>
      ))}
    </group>
  );
}

function DataParticles({ count = 900 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.4 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.035;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color={ACCENT}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingShards() {
  return (
    <>
      {[
        [-3.4, 1.4, -1.2],
        [3.6, -1.1, -0.6],
        [2.4, 2.1, -2.4],
        [-2.8, -1.8, -1.8],
      ].map((p, i) => (
        <Float key={i} speed={1.2 + i * 0.2} rotationIntensity={1.1} floatIntensity={1.4}>
          <Icosahedron args={[0.16 + i * 0.04, 0]} position={p as [number, number, number]}>
            <meshStandardMaterial
              color={i % 2 ? VIOLET : ACCENT}
              emissive={i % 2 ? VIOLET : ACCENT}
              emissiveIntensity={1.1}
              roughness={0.2}
              metalness={0.8}
            />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

function CameraRig({ enabled = true }: { enabled?: boolean }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((_, delta) => {
    if (!enabled) return;
    const k = 1 - Math.pow(0.001, delta);
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * k;
    camera.position.y += (pointer.y * 0.9 - camera.position.y) * k;
    camera.lookAt(target);
  });
  return null;
}

/** Stop rendering entirely while the tab is in the background. */
function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    onChange();
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}

export default function AiScene({
  compact = false,
  tier = "high",
}: {
  compact?: boolean;
  tier?: PerfTier;
}) {
  const budget = BUDGETS[tier];
  const pageVisible = usePageVisible();
  const particles = compact ? Math.round(budget.particles * 0.7) : budget.particles;
  const stars = compact ? Math.round(budget.stars * 0.55) : budget.stars;

  return (
    <Canvas
      frameloop={pageVisible ? "always" : "never"}
      dpr={budget.dpr}
      performance={{ min: 0.5 }}
      gl={{
        antialias: budget.antialias,
        powerPreference: tier === "high" ? "high-performance" : "default",
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, compact ? 5.6 : 6.4], fov: 45 }}
    >
      <color attach="background" args={[SCENE_BG]} />
      <fog attach="fog" args={[SCENE_BG, 6, 16]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={26} color={ACCENT} distance={22} />
      <pointLight position={[-4, -2, 2]} intensity={20} color={VIOLET} distance={20} />
      {budget.spotlight && (
        <spotLight
          position={[0, 6, 2]}
          angle={0.5}
          penumbra={1}
          intensity={30}
          color={SCENE_LIGHT}
        />
      )}

      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.7}>
        <AiCore detail={budget.coreDetail} />
      </Float>
      <EnergyRings count={budget.rings} />
      <DataParticles count={particles} />
      {budget.shards && <FloatingShards />}
      {stars > 0 && <Stars radius={60} depth={40} count={stars} factor={3} fade speed={0.6} />}

      <CameraRig enabled={budget.pointerRig} />
      <AdaptiveDpr pixelated={false} />

      {budget.post !== "none" && (
        <EffectComposer>
          <Bloom
            intensity={budget.post === "full" ? 1.15 : 0.85}
            luminanceThreshold={0.16}
            luminanceSmoothing={0.5}
            mipmapBlur={budget.post === "full"}
          />
          {budget.post === "full" ? <Noise opacity={0.035} /> : <></>}
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
