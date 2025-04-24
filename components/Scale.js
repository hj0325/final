import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export function Scale({ rotation = [0, 0, 0] }) {
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.x = rotation[0] + Math.sin(t / 4) / 8
    group.current.rotation.y = rotation[1] + Math.sin(t / 4) / 8
    group.current.rotation.z = rotation[2] + Math.sin(t / 4) / 8
  })

  return (
    <group ref={group} dispose={null}>
      {/* Base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[2, 0.2, 1]} />
        <meshStandardMaterial color="#8ccec1" />
      </mesh>

      {/* Arm */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#00adbd" />
      </mesh>

      {/* Left Pan */}
      <mesh position={[-1, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#e60012" />
      </mesh>

      {/* Right Pan */}
      <mesh position={[1, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#e60012" />
      </mesh>
    </group>
  )
} 