import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import DentureScene from './components/DentureScene'
import ContentPanel from './components/ContentPanel'
import RotationControl from './components/RotationControl'
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
  }
]

function App() {
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const selectedItem = portfolioData.find(item => item.id === selectedTooth)

  const handleToothPull = (toothId: string) => {
    if (toothId === '') {
      // Auto-retract - close the panel
      setSelectedTooth(null)
    } else {
      // Toggle selection
      setSelectedTooth(selectedTooth === toothId ? null : toothId)
    }
  }

  return (
    <div className="app-container">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        shadows
        style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.1} />
        <pointLight position={[-10, 10, 10]} intensity={0.9} />
        <directionalLight 
          position={[4, 9, 6.5]} 
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-radius={8}
          shadow-bias={-0.0001}
        />
        <DentureScene
          rotation={rotation}
          onToothPull={handleToothPull}
          selectedTooth={selectedTooth}
          portfolioData={portfolioData}
        />
      </Canvas>
      
      <div className="instruction-text">Pull a tooth to explore</div>
      
      <RotationControl
        rotation={rotation}
        onRotationChange={setRotation}
        isDragging={isDragging}
        onDragChange={setIsDragging}
      />

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
