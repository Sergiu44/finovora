import { Center, OrbitControls, RoundedBox, Text3D, useFont } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { Mesh } from "three";

const X = 4;
const Y = 6;

export default function Auth3DModels() {
  const font = useFont("../../../../public/nunito.json");

  const cardAuthRef = useRef<Mesh>(null);
  const fontRef = useRef<Mesh>(null);
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", (e) => handleMouseMove);
    };
  }, []);

  return (
    <Canvas style={{ height: "100%" }}>
      <Center>
        <RoundedBox
          ref={cardAuthRef}
          position={[0, 0, 0]}
          scale={[X, Y, 0.1]}
          args={[1, 1, 1]}
          radius={0.01}
          smoothness={4}
          bevelSegments={4}
          creaseAngle={0.4}
        >
          <meshPhongMaterial color="hsl(0,0%,100%)" />
        </RoundedBox>

        <group position={[-1.5, -1.2, 0.08]}>
          <RoundedBox scale={[X / 30, Y / 2, 0.05]} position={[0, 0.75, 0]}>
            <meshPhongMaterial color="red" />
          </RoundedBox>

          <RoundedBox scale={[X / 30, Y / 4, 0.05]} position={[0.2, 0, 0]}>
            <meshPhongMaterial color="green" />
          </RoundedBox>
        </group>

        <group position={[-1, -1.2, 0.08]}>
          <RoundedBox scale={[X / 30, Y / 2, 0.05]} position={[0, 0.75, 0]}>
            <meshPhongMaterial color="red" />
          </RoundedBox>

          <RoundedBox scale={[X / 30, Y / 4, 0.05]} position={[0.2, 0, 0]}>
            <meshPhongMaterial color="green" />
          </RoundedBox>
        </group>

        <group position={[-0.5, -1.2, 0.08]}>
          <RoundedBox scale={[X / 30, Y / 2, 0.05]} position={[0, 0.75, 0]}>
            <meshPhongMaterial color="red" />
          </RoundedBox>

          <RoundedBox scale={[X / 30, Y / 4, 0.05]} position={[0.2, 0, 0]}>
            <meshPhongMaterial color="green" />
          </RoundedBox>
        </group>

        <group position={[0, -1.2, 0.08]}>
          <RoundedBox scale={[X / 30, Y / 2, 0.05]} position={[0, 0.75, 0]}>
            <meshPhongMaterial color="red" />
          </RoundedBox>

          <RoundedBox scale={[X / 30, Y / 4, 0.05]} position={[0.2, 0, 0]}>
            <meshPhongMaterial color="green" />
          </RoundedBox>
        </group>
        <ambientLight intensity={6} />
        <OrbitControls />
      </Center>
    </Canvas>
  );
}
