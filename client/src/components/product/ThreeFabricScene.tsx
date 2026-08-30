import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

// An interactive floating luxury fabric cloth mesh
function FabricCloth({ mousePos }: { mousePos: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const { viewport } = useThree();

  // Target rotations for parallax tilt
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Calculate target tilt rotation from normalized cursor position
      // Reacting to mouse movement
      targetRotX.current = -mousePos.y * 0.4;
      targetRotY.current = mousePos.x * 0.4;

      // Smoothly interpolate rotation (lerp) for 60fps organic feel
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX.current + 0.2, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY.current - 0.2, 0.05);
      
      // Gentle floating weave motion (base breeze)
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.15;
    }

    // Dynamic wave ripple simulation over the plane's vertices
    if (geomRef.current) {
      const posAttr = geomRef.current.attributes.position;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);

        // Wave formulas combining wind and cursor proximity
        const distFromMouse = Math.sqrt(
          Math.pow(x - mousePos.x * 3, 2) + 
          Math.pow(y - mousePos.y * 3, 2)
        );
        const rippleEffect = Math.sin(distFromMouse * 2.0 - time * 2.0) * 0.15 * Math.max(0, 1 - distFromMouse / 4.0);
        
        // Base fluttering wind wave
        const windWave = Math.sin(x * 1.5 + time * 1.5) * 0.12 * Math.cos(y * 1.2 + time * 1.0);
        
        // Displace along Z-axis (height/depth)
        posAttr.setZ(i, windWave + rippleEffect);
      }
      
      posAttr.needsUpdate = true;
      geomRef.current.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} scale={1.2}>
      <planeGeometry ref={geomRef} args={[4.2, 3.2, 24, 24]} />
      <meshPhysicalMaterial
        color="#143D30" // Deep rubta emerald green
        roughness={0.65}
        metalness={0.15}
        clearcoat={0.3}
        clearcoatRoughness={0.5}
        sheen={1.0}
        sheenColor={new THREE.Color('#C5A059')} // Golden sheen highlighting embroidery
        side={THREE.DoubleSide}
        flatShading={false}
      />
    </mesh>
  );
}

// Gold embroidered thread particles floating in the background
function ThreadParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 40;
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const positionsArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        // Drift particles gently over time
        positionsArr[i * 3 + 1] -= 0.003; // fall slowly
        positionsArr[i * 3] += Math.sin(time + i) * 0.002; // wobble
        
        // Reset if they fall out of viewport
        if (positionsArr[i * 3 + 1] < -3) {
          positionsArr[i * 3 + 1] = 3;
          positionsArr[i * 3] = (Math.random() - 0.5) * 8;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C5A059"
        size={0.06}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export default function ThreeFabricScene() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setIsWebGLSupported(supported);
    } catch (e) {
      setIsWebGLSupported(false);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePos({ x, y });
  };

  if (!isWebGLSupported) {
    // Elegant static CSS-animated fallback for compatibility
    return (
      <div 
        id="fabric-fallback"
        className="w-full h-full relative overflow-hidden rounded-2xl flex items-center justify-center bg-brand-emerald"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col justify-end p-8 text-white">
          <p className="font-serif text-2xl text-brand-gold tracking-wide">Zariha Handloom Weave</p>
          <p className="font-sans text-xs opacity-80 mt-1">Interactive 3D preview requires WebGL enabled.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="fabric-3d-container"
      className="w-full h-[380px] md:h-[500px] relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing bg-radial from-[#1A4C3C] to-[#0A2219] shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      <Canvas 
        camera={{ position: [0, 0, 3.2], fov: 65 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0c1f19']} />
        
        {/* Intricate lighting designed for textiles */}
        <ambientLight intensity={1.2} />
        
        {/* Soft fill light */}
        <directionalLight position={[0, -2, 2]} intensity={0.4} color="#C5A059" />
        
        {/* Highlights the zari embroidery (gold sheen) */}
        <spotLight 
          position={[3, 4, 3]} 
          intensity={3.5} 
          angle={0.4} 
          penumbra={0.8} 
          color="#FFF2D4" 
          castShadow
        />
        
        {/* Accent rim light */}
        <pointLight position={[-4, 2, -2]} intensity={1.5} color="#5C9D88" />

        <Center>
          <FabricCloth mousePos={mousePos} />
        </Center>
        
        <ThreadParticles />
      </Canvas>

      {/* Floating interactive tooltip */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-center text-white/60 bg-black/30 backdrop-blur-xs px-4 py-2 rounded-lg text-xs font-mono">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
          WebGL Active Simulation
        </span>
        <span>Drag / Hover to wave threads</span>
      </div>
    </div>
  );
}
