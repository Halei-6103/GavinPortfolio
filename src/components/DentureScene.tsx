import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3, Group, MeshStandardMaterial, Shape } from 'three'
import { useGLTF, Text } from '@react-three/drei'

interface ToothTextPosition {
  distance?: number // Distance from tooth along the curve
  y?: number // Height above tooth
  xOffset?: number // Left/right offset
  zOffset?: number // Forward/back offset
  rotationOffset?: number // Rotation offset in radians
}

interface ToothProps {
  position: [number, number, number]
  id: string
  onPull: (id: string) => void
  isSelected: boolean
  size: number
  title: string // Title to show in popup
  textPosition?: ToothTextPosition // Individual text position adjustments
}

function Tooth({ position, id, onPull, isSelected, size, title, textPosition }: ToothProps) {
  const meshRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [textOpacity, setTextOpacity] = useState(0)
  const originalPosition = new Vector3(...position)
  const pullDistance = 0.8

  // Change cursor when hovering over tooth
  useEffect(() => {
    if (isHovered && !isSelected) {
      // Use grab hand cursor for pulling action
      document.body.style.cursor = 'grab'
      return () => {
        document.body.style.cursor = 'default'
      }
    } else {
      document.body.style.cursor = 'default'
    }
  }, [isHovered, isSelected])

  // Smooth fade in/out for text opacity
  useEffect(() => {
    if (isHovered && !isSelected) {
      setTextOpacity(0.7)
    } else {
      setTextOpacity(0)
    }
  }, [isHovered, isSelected])

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetZ = isSelected ? originalPosition.z + pullDistance : originalPosition.z
      meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.1
      
      if (isHovered && !isSelected) {
        meshRef.current.rotation.y += 0.02
      }
    }
    
    // Smooth opacity transition for embedded feel
    const targetOpacity = (isHovered && !isSelected) ? 0.7 : 0
    setTextOpacity(prev => {
      const diff = targetOpacity - prev
      return prev + diff * delta * 8 // Smooth transition speed
    })
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
      
      {/* Text popup that appears on hover */}
      {isHovered && !isSelected && (() => {
        // Calculate angle based on position to follow the arch curvature
        // Teeth on the left have negative X, teeth on the right have positive X
        const angle = Math.atan2(position[0], position[2]) // Angle from center
        
        // Use individual text position adjustments if provided, otherwise use defaults
        const textDistance = (textPosition?.distance ?? size * 2.5) // Distance from tooth along the curve
        const textY = (textPosition?.y ?? size * 0.8) // Height above tooth
        const textXOffset = textPosition?.xOffset ?? 0 // Left/right offset
        const textZOffset = textPosition?.zOffset ?? 0 // Forward/back offset
        const textRotationOffset = textPosition?.rotationOffset ?? 0 // Rotation offset
        
        // Position text along the arch curve, extending outward in front of the tooth
        const textX = Math.sin(angle) * textDistance + textXOffset
        const textZ = Math.cos(angle) * textDistance + textZOffset
        
        // Rotate text to be parallel to the arch (same direction as the curve)
        const textRotation = angle + textRotationOffset // Parallel to the arch, extending outward
        
        // Only render if opacity > 0
        if (textOpacity <= 0) return null

        return (
          <group>
            {/* Subtle shadow behind for depth */}
            <Text
              key={`text-shadow-${id}`}
              position={[textX, textY - 0.005, textZ - 0.005]}
              rotation={[0, textRotation, 0]}
              fontSize={0.08}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              font="/fonts/FiraSansCondensed-Black.ttf"
            >
              {title}
            </Text>
            {/* Main text with reduced opacity for embedded feel */}
            <Text
              key={`text-${id}`}
              position={[textX, textY, textZ]}
              rotation={[0, textRotation, 0]}
              fontSize={0.08}
              color={`rgba(255, 255, 255, ${textOpacity})`}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.002}
              outlineColor={`rgba(0, 0, 0, ${textOpacity * 0.5})`}
              font="/fonts/FiraSansCondensed-Black.ttf"
            >
              {title}
            </Text>
          </group>
        )
      })()}
    </group>
  )
}

// Custom shadow component that matches denture shape
function DentureShadow() {
  const shape = new Shape()
  
  // Create an arch shape that matches the denture (wider in middle, narrower at ends)
  // Start from left side
  shape.moveTo(-2.5, 0)
  // Upper arch curve (left to center)
  shape.quadraticCurveTo(-1.5, 1.2, 0, 1.5)
  // Upper arch curve (center to right)
  shape.quadraticCurveTo(1.5, 1.2, 2.5, 0)
  // Lower arch curve (right to center)
  shape.quadraticCurveTo(1.5, -1.2, 0, -1.5)
  // Lower arch curve (center to left)
  shape.quadraticCurveTo(-1.5, -1.2, -2.5, 0)
  shape.closePath()
  
  const extrudeSettings = {
    depth: 0.01,
    bevelEnabled: false
  }
  
  return (
    <mesh 
      position={[0, -1.2, 0]} 
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#000000"
        transparent
        opacity={0.15}
        roughness={1}
        metalness={0}
      />
    </mesh>
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
          // Tooth material - off-white with increased specular
          child.material = new MeshStandardMaterial({
            color: '#f5f5f2',
            roughness: 0.15,
            metalness: 0.1
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
  
  // ===== INDIVIDUAL TEXT POSITION ADJUSTMENTS =====
  // Adjust each tooth's text position separately by editing the values below
  // Each tooth can have its own distance, y, xOffset, zOffset, and rotationOffset
  // Leave values as undefined to use defaults
  const textPositions: Record<string, ToothTextPosition> = {
    'tooth-1': { // About Me
      distance: undefined, // Uses default: size * 2.5 (or set a number like 0.6)
      y: .02, // Uses default: size * 0.8 (or set a number like 0.2)
      xOffset: -.45, // Left/right offset (positive = right, negative = left)
      zOffset: .288, // Forward/back offset (positive = forward, negative = back)
      rotationOffset: -.3 // Rotation offset in radians
    },
    'tooth-2': { // Projects
      distance: undefined,
      y: .02,
      xOffset: -.35,
      zOffset: .24,
      rotationOffset: -.25
    },
    'tooth-3': { // Experience
      distance: undefined,
      y: .02,
      xOffset: -.18,
      zOffset: .21,
      rotationOffset: -.13
    },
    'tooth-4': { // Education
      distance: undefined,
      y: .02,
      xOffset: .18,
      zOffset: .21,
      rotationOffset: .05
    },
    'tooth-5': { // Contact
      distance: undefined,
      y: .02,
      xOffset: .35,
      zOffset: .24,
      rotationOffset: .05
    }
  }
  // ================================================
  
  // Create teeth based on portfolio data - only create as many as we have content for
  const teeth: Array<{ id: string; position: [number, number, number], title: string, textPosition?: ToothTextPosition }> = portfolioData.map((item, index) => {
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
      position: positions[index] || [0, 1.0, 0], // Default position if more than 5
      title: item.title, // Use the title from portfolio data
      textPosition: textPositions[item.id] // Individual text position for this tooth
    }
  })
  
  // To adjust: Change the numbers in the positions array above
  // [x, y, z] where:
  //   x = left (-) to right (+)
  //   y = down (-) to up (+)
  //   z = back (-) to front (+)

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {/* Soft denture-shaped shadow beneath the model */}
      <DentureShadow />

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
          title={tooth.title}
          textPosition={tooth.textPosition}
        />
      ))}
    </group>
  )
}

