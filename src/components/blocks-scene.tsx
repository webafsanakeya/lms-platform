"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Outlines } from "@react-three/drei";
import type { Group } from "three";

const books = [
  { color: "#2f6bff", y: -0.9, size: [2.6, 0.6, 1.8], rot: 0 },
  { color: "#19d58b", y: -0.3, size: [2.2, 0.6, 1.6], rot: 0.3 },
  { color: "#ffe53b", y: 0.3, size: [2.4, 0.6, 1.7], rot: -0.25 },
  { color: "#ffffff", y: 0.9, size: [2.0, 0.6, 1.5], rot: 0.15 },
] as const;

function Books() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.4; // slow spin
    g.rotation.x = state.pointer.y * 0.2; // leans toward the mouse
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.25} floatIntensity={0.8}>
        {books.map((b) => (
          <mesh key={b.color} position={[0, b.y, 0]} rotation={[0, b.rot, 0]}>
            <boxGeometry args={[b.size[0], b.size[1], b.size[2]]} />
            <meshStandardMaterial color={b.color} />
            <Outlines thickness={0.04} color="#111111" />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

export default function BlocksScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6.5], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <Books />
    </Canvas>
  );
}