import { OrbitControls, Plane, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mesh } from "three";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

const X = 4;
const Y = 6;

function RouteComponent() {
  const cardAuthRef = useRef<Mesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!cardAuthRef.current) return;

    // Apply rotation based on mouse position
    // Using smaller multipliers for smoother rotation
    const rotationX = mousePosition.y * 0.01; // Vertical mouse movement affects X rotation
    const rotationY = mousePosition.x * 0.01; // Horizontal mouse movement affects Y rotation

    cardAuthRef.current.rotation.x = rotationX;
    cardAuthRef.current.rotation.y = rotationY;
  }, [mousePosition]);

  return (
    <div className="relative">
      <Canvas style={{ height: "100dvh" }}>
        <RoundedBox
          ref={cardAuthRef}
          position={[4, 0, 0]}
          rotateY={Math.PI / 2}
          scale={[X, Y, 0.1]}
          args={[1, 1, 1]}
          radius={0.01}
          smoothness={4}
          bevelSegments={4}
          creaseAngle={0.4}
          onPointerMove={(e) => {
            // Get local coordinates relative to the mesh
            // The mesh is 10 units wide and 6 units tall
            const x = (e.point.x / (X / 2)) * 2; // Divide by half width (5) to get -1 to 1
            const y = -(e.point.y / (Y / 2)) * 2; // Divide by half height (3) to get -1 to 1
            setMousePosition({ x, y });
          }}
          onPointerLeave={() => {
            // Reset rotation when mouse leaves the mesh
            setMousePosition({ x: 0, y: 0 });
          }}
        >
          <meshPhongMaterial color="hsl(0,0%,100%)" />
        </RoundedBox>
        <ambientLight intensity={6} />
      </Canvas>
      <div className="absolute top-1/2 left-1/2 text-black">test</div>
    </div>
  );
}
