import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import DentureScene from './components/DentureScene'
import ContentPanel from './components/ContentPanel'
import ArrowBar from './components/ArrowBar'
import './App.css'

export interface PortfolioItem {
  id: string
  title: string
  description: string
  content: string
  tags?: string[]
}

const portfolioData: PortfolioItem[] = [
  {
    id: 'tooth-1',
    title: 'Contact',
    description: 'Get in touch',
    content: `# Contact

    Feel free to reach out if you'd like to collaborate or have any questions!

    ## Email
    your.email@example.com

    ## LinkedIn
    linkedin.com/in/yourprofile

    ## GitHub
    github.com/yourusername`,
    tags: ['Contact', 'Social']
  },
  {
    id: 'tooth-2',
    title: 'Projects',
    description: 'Check out my latest work',
    content: `# Projects

    ## Featured Projects

    ### Interactive 3D Portfolio
    A unique portfolio website featuring interactive 3D elements built with React Three Fiber.

    ### E-Commerce Platform
    Full-stack e-commerce solution with payment integration and admin dashboard.

    ### Mobile App
    Cross-platform mobile application with real-time features.`,
    tags: ['Projects', 'Portfolio']
  },
  {
    id: 'tooth-3',
    title: 'About Me',
    description: 'Learn about my background and experience',
    content: `# About Me

    I'm a passionate developer with expertise in modern web technologies. I love creating interactive and engaging user experiences.

    ## Skills
    - React & TypeScript
    - 3D Graphics & WebGL
    - Full-Stack Development
    - UI/UX Design`,
    tags: ['About', 'Background']
  },
  {
    id: 'tooth-4',
    title: 'Education',
    description: 'Academic background',
    content: `# Education

    ## Bachelor of Science in Computer Science
    **University Name** | 2016 - 2020
    - Graduated with honors
    - Relevant coursework: Data Structures, Algorithms, Web Development

    ## Certifications
    - AWS Certified Developer
    - React Advanced Patterns`,
    tags: ['Education', 'Certifications']
  },
  {
    id: 'tooth-5',
    title: 'Experience',
    description: 'My professional journey',
    content: `# Experience

    ## Software Developer
    **Company Name** | 2022 - Present
    - Developed and maintained web applications
    - Collaborated with cross-functional teams
    - Implemented responsive designs

    ## Junior Developer
    **Previous Company** | 2020 - 2022
    - Built user interfaces with React
    - Participated in code reviews
    - Fixed bugs and improved performance`,
    tags: ['Work', 'Experience']
  }
]

function App() {
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isRotatingRef = useRef(false)
  const startMouseXRef = useRef(0)
  const startRotationRef = useRef(0)

  const selectedItem = portfolioData.find(item => item.id === selectedTooth)

  const handleToothPull = (toothId: string) => {
    // Mark that user has interacted after first tooth click
    if (!hasInteracted) {
      setHasInteracted(true)
    }
    
    setIsInteracting(true)
    if (toothId === '') {
      // Auto-retract - close the panel
      setSelectedTooth(null)
      setTimeout(() => setIsInteracting(false), 1000)
    } else {
      // Toggle selection
      const newSelected = selectedTooth === toothId ? null : toothId
      setSelectedTooth(newSelected)
      // Keep faded if a tooth is selected, fade back in if closed
      if (!newSelected) {
        setTimeout(() => setIsInteracting(false), 1000)
      }
    }
  }

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Only start rotation if clicking on the canvas (not on UI elements)
      const target = e.target as HTMLElement
      if (target.tagName === 'CANVAS' && e.button === 0) {
        isRotatingRef.current = true
        startMouseXRef.current = e.clientX
        startRotationRef.current = rotation
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isRotatingRef.current) {
        const deltaX = e.clientX - startMouseXRef.current
        const rotationSpeed = 0.005
        const newRotation = startRotationRef.current + deltaX * rotationSpeed
        
        // Limit rotation to 120 degrees (60 degrees each way from center)
        const maxRotation = Math.PI * 2 / 3
        const clampedRotation = Math.max(-maxRotation / 2, Math.min(maxRotation / 2, newRotation))
        
        setRotation(clampedRotation)
      }
    }

    const handleMouseUp = () => {
      isRotatingRef.current = false
      // Fade text back in after a short delay
      setTimeout(() => {
        setIsInteracting(false)
      }, 1000)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [rotation])

  // Keep text faded when a tooth is selected
  useEffect(() => {
    if (selectedTooth) {
      setIsInteracting(true)
    } else {
      setIsInteracting(false)
    }
  }, [selectedTooth])

  return (
    <div className="app-container" ref={containerRef}>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.1} />
        <pointLight position={[-10, 10, 10]} intensity={0.9} />
        {/* Main directional light from front - positioned to cast shadows from upper to lower teeth */}
        <directionalLight 
          position={[3, 8, 7]} 
          intensity={1.1}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-radius={12}
          shadow-bias={-0.0001}
        />
        {/* Rim light from behind - creates depth and edge definition */}
        <directionalLight 
          position={[-2, 5, -8]} 
          intensity={0.4}
          color="#ffffff"
        />
        {/* Additional rim light from side-back for more depth */}
        <pointLight 
          position={[-5, 8, -6]} 
          intensity={0.3}
          color="#ffffff"
        />
        <DentureScene
          rotation={rotation}
          onToothPull={handleToothPull}
          selectedTooth={selectedTooth}
          portfolioData={portfolioData}
        />
      </Canvas>
      
      <div className={`gavin-text ${isInteracting ? 'fade-out' : ''}`}>Gavin</div>
      <div className={`hale-text ${isInteracting ? 'fade-out' : ''}`}>Hale</div>
      
      {!hasInteracted && (
        <div className="instruction-text">Pull a tooth to explore my work</div>
      )}
      
      <div className={`arrow-bar-wrapper ${hasInteracted ? 'reduced-chrome' : ''}`}>
        <ArrowBar />
      </div>

      {selectedItem && (
        <ContentPanel
          item={selectedItem}
          onClose={() => setSelectedTooth(null)}
        />
      )}
    </div>
  )
}

export default App
