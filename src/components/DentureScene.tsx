import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3, Group, MeshStandardMaterial } from 'three'
import { useGLTF } from '@react-three/drei'

interface ToothProps {
  position: [number, number, number]
  id: string
  onPull: (id: string) => void
  isSelected: boolean
  size: number
}

function Tooth({ position, id, onPull, isSelected, size }: ToothProps) {
  const meshRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const originalPosition = new Vector3(...position)
  const pullDistance = 0.8

  useFrame(() => {
    if (meshRef.current) {
      const targetZ = isSelected ? originalPosition.z + pullDistance : originalPosition.z
      meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.1
      
      if (isHovered && !isSelected) {
        meshRef.current.rotation.y += 0.02
      }
    }
  })

  const handleClick = () => {
    if (!isSelected) {
      onPull(id)
    }
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={isHovered && !isSelected ? 1.1 : 1}
      >
        <boxGeometry args={[size, size * 1.2, size]} />
        <meshStandardMaterial
          color={isSelected ? '#ff00ff' : isHovered ? '#00ff00' : '#ff0000'}
          metalness={0.3}
          roughness={0.2}
          transparent={true}
          opacity={0}
        />
      </mesh>
      {isSelected && (
        <mesh position={[0, 0, pullDistance + 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      )}
    </group>
  )
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  content: string
  tags?: string[]
}

interface DentureSceneProps {
  rotation: number
  onToothPull: (id: string) => void
  selectedTooth: string | null
  portfolioData: PortfolioItem[]
}

export default function DentureScene({ rotation, onToothPull, selectedTooth, portfolioData }: DentureSceneProps) {
  const groupRef = useRef<Group>(null)
  
  // Load full mouth model (always available)
  const { scene: fullMouthScene } = useGLTF('/models/Full_mouth.glb')
  
  // Optional: Load separate jaw models if they exist
  // Convert your STL files to GLB and name them: upper_jaw.glb and lower_jaw.glb
  // Place them in public/models/ folder
  let upperJaw: any = null
  let lowerJaw: any = null
  
  // Uncomment these when you have converted the STL files to GLB:
  // const upperScene = useGLTF('/models/upper_jaw.glb')
  // upperJaw = upperScene.scene.clone()
  // const lowerScene = useGLTF('/models/lower_jaw.glb')
  // lowerJaw = lowerScene.scene.clone()
  
  const fullMouth = fullMouthScene.clone()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation
    }
  })

  // Apply gum material to jaw models
  const applyGumMaterial = (scene: any) => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        // Apply gum material to all meshes in jaw models
        child.material = new MeshStandardMaterial({
          color: '#c96b6b',
          roughness: 0.45,
          metalness: 0
        })
        child.castShadow = true
        child.receiveShadow = true
        child.raycast = () => {} // Disable raycasting so clicks pass through
      }
    })
  }

  if (upperJaw) applyGumMaterial(upperJaw)
  if (lowerJaw) applyGumMaterial(lowerJaw)
  
  // If using full mouth, apply materials based on mesh names
  if (fullMouth) {
    fullMouth.traverse((child: any) => {
      if (child.isMesh) {
        const meshName = (child.name || '').toLowerCase()
        // Check for teeth - anything with "tooth" or "teeth" in name, or upper/lower without jaw/gum
        const isTooth = meshName.includes('tooth') || meshName.includes('teeth') || 
                        (meshName.includes('upper') && !meshName.includes('jaw') && !meshName.includes('gum') && !meshName.includes('base')) ||
                        (meshName.includes('lower') && !meshName.includes('jaw') && !meshName.includes('gum') && !meshName.includes('base'))
        
        if (isTooth) {
          // Tooth material - off-white
          child.material = new MeshStandardMaterial({
            color: '#f5f5f2',
            roughness: 0.2,
            metalness: 0
          })
        } else {
          // Gum material - pink/reddish (for jaws, bases, denture base, etc.)
          child.material = new MeshStandardMaterial({
            color: '#c96b6b',
            roughness: 0.45,
            metalness: 0
          })
        }
        child.castShadow = true
        child.receiveShadow = true
        child.raycast = () => {}
      }
    })
  }

  // EASY TO ADJUST: Edit each tooth position individually [x, y, z]
  // Move them around to match your model - just change the numbers!
  const toothSize = 0.25        // Adjust this to make clickable zones bigger/smaller
  
  // Create teeth based on portfolio data - only create as many as we have content for
  const teeth: Array<{ id: string; position: [number, number, number] }> = portfolioData.map((item, index) => {
    // Default positions in an arch - adjust these to match your model
    // Comments show which content each position corresponds to
    const positions: [number, number, number][] = [
      [.7, 1.1, .43],    // About Me
      [.45, 1.1, .52],  // Projects
      [0.18, 1.1, .6],  // Experience
      [-0.18, 1.1, .6],  // Education
      [-0.45, 1.1, .5], // Contact
    ]
    
    return {
      id: item.id,
      position: positions[index] || [0, 1.0, 0] // Default position if more than 5
    }
  })
  
  // To adjust: Change the numbers in the positions array above
  // [x, y, z] where:
  //   x = left (-) to right (+)
  //   y = down (-) to up (+)
  //   z = back (-) to front (+)

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {/* 3D Models - Use separate jaws if available, otherwise use full mouth */}
      {upperJaw && (
        <primitive 
          object={upperJaw} 
          scale={2.5} 
          position={[0, -0.5, 0]}
          rotation={[0, 0, 0]}
        />
      )}
      {lowerJaw && (
        <primitive 
          object={lowerJaw} 
          scale={2.5} 
          position={[0, -0.5, 0]}
          rotation={[0, 0, 0]}
        />
      )}
      {fullMouth && (
        <primitive 
          object={fullMouth} 
          scale={2.5} 
          position={[0, -0.5, 0]}
          rotation={[0, 0, 0]}
        />
      )}

      {/* Interactive Teeth Overlay - VISIBLE for adjustment (red = normal, green = hover, pink = selected) */}
      {teeth.map((tooth) => (
        <Tooth
          key={tooth.id}
          position={tooth.position}
          id={tooth.id}
          onPull={onToothPull}
          isSelected={selectedTooth === tooth.id}
          size={toothSize}
        />
      ))}
    </group>
  )
}

