
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo3D: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#1DA1F2" 
          metalness={0.5} 
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 1.2]}>
        <torusGeometry args={[0.5, 0.2, 16, 100]} />
        <meshStandardMaterial 
          color="#0B3D91" 
          metalness={0.8} 
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto", showText = true }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${className}`}>
        <Canvas className="w-full h-full">
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
          <Logo3D />
        </Canvas>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-heading font-bold tracking-tight text-brand-blue text-xl leading-none">
            CareerCraft AI
          </span>
          <span className="text-xs text-brand-teal font-semibold et-mark">
            ET Mark
          </span>
        </div>
      )}
    </div>
  );
};
