"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  PerspectiveCamera,
  ContactShadows,
  Text,
  useGLTF,
} from "@react-three/drei";
import { useRef, Suspense, Component, ReactNode } from "react";
import * as THREE from "three";

// --- Error Boundary for missing models ---
class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn(
      "Real Hand Model failed to load (likely missing /models/hand.glb). Showing procedural fallback.",
      error,
    );
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Material mimicking the Green Grainy/Velvet texture from the image
const HandMaterial = () => (
  <meshStandardMaterial
    color="#1e5940" // Deep Jade/Forest Green
    roughness={0.9} // High roughness for matte/stone look
    metalness={0.1}
    emissive="#0d2b1d" // Subtle inner glow
    emissiveIntensity={0.2}
  />
);

function ProceduralHand({ side = "right" }: { side?: "left" | "right" }) {
  const groupRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.5 + (isLeft ? 0 : 2)) * 0.1;
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    const baseRotX = isLeft ? 0.5 : -0.5;
    const baseRotY = isLeft ? 1.5 : -1.5;
    const baseRotZ = isLeft ? -0.5 : 0.5;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      baseRotX + -mouseY * 0.1,
      0.1,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotY + mouseX * 0.1,
      0.1,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      baseRotZ,
      0.1,
    );
  });

  return (
    <group ref={groupRef} dispose={null}>
      <group scale={[isLeft ? -1 : 1, 1, 1]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 1.2, 0.4]} />
          <HandMaterial />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.5, 16]} />
          <HandMaterial />
        </mesh>
        <group position={[0.7, -0.3, 0.2]} rotation={[0, -0.5, -0.8]}>
          <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.22, 0.8, 8, 16]} />
            <HandMaterial />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <sphereGeometry args={[0.23]} />
            <HandMaterial />
          </mesh>
        </group>
        <Finger
          position={[0.4, 0.7, 0]}
          length={1.0}
          width={0.19}
          angle={-0.1}
          curl={isLeft ? 0.5 : 0.2}
        />
        <Finger
          position={[0.1, 0.75, 0]}
          length={1.1}
          width={0.2}
          angle={0}
          curl={isLeft ? 0.6 : 0.3}
        />
        <Finger
          position={[-0.2, 0.7, 0]}
          length={1.0}
          width={0.19}
          angle={0.05}
          curl={isLeft ? 0.7 : 0.4}
        />
        <Finger
          position={[-0.5, 0.6, 0]}
          length={0.8}
          width={0.17}
          angle={0.15}
          curl={isLeft ? 0.8 : 0.5}
        />
      </group>
    </group>
  );
}

function Finger({
  position,
  length,
  width,
  angle,
  curl,
}: {
  position: [number, number, number];
  length: number;
  width: number;
  angle: number;
  curl: number;
}) {
  return (
    <group position={position} rotation={[curl, 0, angle]}>
      <mesh position={[0, length * 0.3, 0]}>
        <capsuleGeometry args={[width, length * 0.6, 8, 16]} />
        <HandMaterial />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[width * 1.05]} />
        <HandMaterial />
      </mesh>
      <group position={[0, length * 0.6, 0]} rotation={[curl * 0.5, 0, 0]}>
        <mesh position={[0, length * 0.3, 0]}>
          <capsuleGeometry args={[width * 0.9, length * 0.5, 8, 16]} />
          <HandMaterial />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[width]} />
          <HandMaterial />
        </mesh>
      </group>
    </group>
  );
}

function RealHand({ side = "right" }: { side?: "left" | "right" }) {
  const isLeft = side === "left";
  // Load local model - User must provide public/models/hand.glb
  const { scene } = useGLTF("/models/hand.glb");
  const clone = scene.clone();

  // Apply our custom Green Material to the loaded mesh
  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: "#1e5940",
        roughness: 0.9,
        metalness: 0.1,
        emissive: "#0d2b1d",
        emissiveIntensity: 0.2,
      });
    }
  });

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.5 + (isLeft ? 0 : 2)) * 0.1;

    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    // Adjust these based on your specific model's default orientation
    const baseRotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotY + mouseX * 0.3,
      0.1,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouseY * 0.2,
      0.1,
    );
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive
        object={clone}
        scale={[4, 4, 4]} // Adjusted scale assumption
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

function Headline() {
  return (
    <Text
      position={[0, 0.5, -3]}
      fontSize={0.8}
      maxWidth={20}
      lineHeight={1}
      letterSpacing={0.05}
      textAlign="center"
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      CONNECTIONS
      <meshStandardMaterial
        color="#ffffff"
        emissive="#2ecc71"
        emissiveIntensity={0.2}
        toneMapped={false}
      />
    </Text>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
      <ambientLight intensity={0.2} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={200}
        color="#cceeff"
        castShadow
      />
      <spotLight
        position={[-5, 2, -5]}
        angle={0.5}
        penumbra={1}
        intensity={300}
        color="#2ecc71"
      />
      <pointLight position={[0, -2, 2]} intensity={50} color="#ffaa88" />

      {/* 3D Hands with Error Boundary for fallback */}
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <group position={[-1.8, 0, 0]}>
            <ModelErrorBoundary fallback={<ProceduralHand side="left" />}>
              <RealHand side="left" />
            </ModelErrorBoundary>
          </group>
        </Float>

        <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
          <group position={[1.8, 0, 0]}>
            <ModelErrorBoundary fallback={<ProceduralHand side="right" />}>
              <RealHand side="right" />
            </ModelErrorBoundary>
          </group>
        </Float>
      </Suspense>

      <Headline />
      <Environment preset="night" blur={0.8} />
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={4.5}
        color="#000000"
      />
    </>
  );
}

export default function ThreeDHands() {
  return (
    <div className="w-full h-screen bg-[#0a0a0a]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
