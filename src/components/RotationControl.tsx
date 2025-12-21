import { useRef, useState, useEffect } from 'react'
import './RotationControl.css'

interface RotationControlProps {
  rotation: number
  onRotationChange: (rotation: number) => void
  isDragging: boolean
  onDragChange: (isDragging: boolean) => void
}

export default function RotationControl({
  rotation,
  onRotationChange,
  onDragChange
}: RotationControlProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true)
    onDragChange(true)
    updateRotation(e)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      updateRotation(e)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
    onDragChange(false)
  }

  const updateRotation = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const normalizedX = Math.max(0, Math.min(1, x / rect.width))
    // Map slider 0-100% to rotation -π/3 to π/3 (60 degrees each way), so slider at 50% (middle) = rotation 0 (forward)
    const newRotation = (normalizedX - 0.5) * (Math.PI * 2 / 3)
    onRotationChange(newRotation)
  }

  useEffect(() => {
    if (isMouseDown) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isMouseDown])

  // Map rotation -π/3 to π/3 to slider 0-100%, so rotation 0 (forward) = slider 50% (middle)
  const rotationPercent = ((rotation / (Math.PI * 2 / 3)) + 0.5) * 100

  return (
    <div className="rotation-control-wrapper">
      <div className="rotation-control-label-box">
        <div className="rotation-control-label">Rotate Model</div>
      </div>
      <div className="rotation-control">
        <div
          ref={sliderRef}
          className="rotation-slider"
          onMouseDown={handleMouseDown}
        >
          <div className="rotation-track">
          <div
            className="rotation-thumb"
            style={{ left: `${rotationPercent}%` }}
          />
          </div>
        </div>
      </div>
    </div>
  )
}

