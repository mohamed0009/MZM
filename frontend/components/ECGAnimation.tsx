"use client"

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ECGAnimationProps {
  width?: number
  height?: number
  color?: string
  speed?: number
  className?: string
  showBackground?: boolean
  strokeWidth?: number
  isAnimating?: boolean
}

const ECGAnimation = ({
  width = 300,
  height = 80,
  color = "#06b6d4",
  speed = 1.5,
  className = "",
  showBackground = true,
  strokeWidth = 2,
  isAnimating = true
}: ECGAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate ECG path data
  const generateECGPath = () => {
    // Starting with a flat line
    let path = `M0,${height / 2} `
    
    // Heartbeat patterns - repeating 3 times across the width
    const segment = width / 3
    
    // First pattern
    path += `L${segment * 0.1},${height / 2} ` // Flat line
    path += `L${segment * 0.15},${height / 2 - height * 0.05} ` // Small bump up
    path += `L${segment * 0.2},${height / 2 + height * 0.05} ` // Small bump down
    path += `L${segment * 0.25},${height / 2} ` // Back to middle
    
    // Main spike (P wave, QRS complex, T wave)
    path += `L${segment * 0.3},${height / 2} ` // Flat line
    path += `L${segment * 0.35},${height / 2 - height * 0.1} ` // Small P wave
    path += `L${segment * 0.4},${height / 2} ` // Back to baseline
    path += `L${segment * 0.43},${height / 2} ` // Flat line
    path += `L${segment * 0.45},${height / 2 + height * 0.05} ` // Q wave dip
    path += `L${segment * 0.47},${height / 2 - height * 0.4} ` // R wave spike up
    path += `L${segment * 0.5},${height / 2 + height * 0.2} ` // S wave dip
    path += `L${segment * 0.53},${height / 2} ` // Back to baseline
    path += `L${segment * 0.6},${height / 2} ` // Flat line
    path += `L${segment * 0.65},${height / 2 - height * 0.1} ` // T wave
    path += `L${segment * 0.7},${height / 2} ` // Back to baseline
    
    // Repeat the pattern with slight offset
    path += `L${segment + segment * 0.1},${height / 2} ` // Flat line
    path += `L${segment + segment * 0.15},${height / 2 - height * 0.05} ` // Small bump up
    path += `L${segment + segment * 0.2},${height / 2 + height * 0.05} ` // Small bump down
    path += `L${segment + segment * 0.25},${height / 2} ` // Back to middle
    
    // Main spike (P wave, QRS complex, T wave) - second pattern
    path += `L${segment + segment * 0.3},${height / 2} ` // Flat line
    path += `L${segment + segment * 0.35},${height / 2 - height * 0.1} ` // Small P wave
    path += `L${segment + segment * 0.4},${height / 2} ` // Back to baseline
    path += `L${segment + segment * 0.43},${height / 2} ` // Flat line
    path += `L${segment + segment * 0.45},${height / 2 + height * 0.05} ` // Q wave dip
    path += `L${segment + segment * 0.47},${height / 2 - height * 0.4} ` // R wave spike up
    path += `L${segment + segment * 0.5},${height / 2 + height * 0.2} ` // S wave dip
    path += `L${segment + segment * 0.53},${height / 2} ` // Back to baseline
    path += `L${segment + segment * 0.6},${height / 2} ` // Flat line
    path += `L${segment + segment * 0.65},${height / 2 - height * 0.1} ` // T wave
    path += `L${segment + segment * 0.7},${height / 2} ` // Back to baseline
    
    // Third pattern
    path += `L${2 * segment + segment * 0.1},${height / 2} ` // Flat line
    path += `L${2 * segment + segment * 0.15},${height / 2 - height * 0.05} ` // Small bump up
    path += `L${2 * segment + segment * 0.2},${height / 2 + height * 0.05} ` // Small bump down
    path += `L${2 * segment + segment * 0.25},${height / 2} ` // Back to middle
    
    // Main spike (P wave, QRS complex, T wave) - third pattern
    path += `L${2 * segment + segment * 0.3},${height / 2} ` // Flat line
    path += `L${2 * segment + segment * 0.35},${height / 2 - height * 0.1} ` // Small P wave
    path += `L${2 * segment + segment * 0.4},${height / 2} ` // Back to baseline
    path += `L${2 * segment + segment * 0.43},${height / 2} ` // Flat line
    path += `L${2 * segment + segment * 0.45},${height / 2 + height * 0.05} ` // Q wave dip
    path += `L${2 * segment + segment * 0.47},${height / 2 - height * 0.4} ` // R wave spike up
    path += `L${2 * segment + segment * 0.5},${height / 2 + height * 0.2} ` // S wave dip
    path += `L${2 * segment + segment * 0.53},${height / 2} ` // Back to baseline
    path += `L${2 * segment + segment * 0.6},${height / 2} ` // Flat line
    path += `L${2 * segment + segment * 0.65},${height / 2 - height * 0.1} ` // T wave
    path += `L${2 * segment + segment * 0.7},${height / 2} ` // Back to baseline
    
    // End with a flat line
    path += `L${width},${height / 2}`
    
    return path
  }

  // Draw grid background on canvas
  useEffect(() => {
    if (!showBackground || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Set grid style
    ctx.strokeStyle = '#e2e8f0' // Light gray color
    ctx.lineWidth = 0.5
    
    // Draw horizontal lines (5px apart)
    for (let y = 0; y <= height; y += 10) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    // Draw vertical lines (5px apart)
    for (let x = 0; x <= width; x += 10) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
  }, [width, height, showBackground])

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Grid background */}
      {showBackground && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute top-0 left-0 w-full h-full"
        />
      )}
      
      {/* ECG Line Animation */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute top-0 left-0"
      >
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          
          {/* Add a mask to create a fade effect at the edges */}
          <mask id="edgeFadeMask">
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.7" />
              <stop offset="10%" stopColor="white" stopOpacity="1" />
              <stop offset="90%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0.7" />
            </linearGradient>
            <rect x="0" y="0" width={width} height={height} fill="url(#fadeGradient)" />
          </mask>
        </defs>
        
        {/* Primary ECG Path - Moving left to right */}
        <motion.path
          d={generateECGPath()}
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#edgeFadeMask)"
          animate={isAnimating ? {
            x: [0, width],
          } : { x: 0 }}
          transition={isAnimating ? {
            duration: speed * 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            times: [0, 1],
          } : {}}
        />
        
        {/* Secondary ECG Path (offset) for continuous flow */}
        <motion.path
          d={generateECGPath()}
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#edgeFadeMask)"
          initial={{ x: isAnimating ? -width : 0 }}
          animate={isAnimating ? {
            x: [-width, 0],
          } : { x: 0 }}
          transition={isAnimating ? {
            duration: speed * 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            times: [0, 1],
          } : {}}
        />
        
        {/* Tertiary ECG Path (additional offset) for extra smoothness */}
        <motion.path
          d={generateECGPath()}
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#edgeFadeMask)"
          initial={{ x: isAnimating ? -width * 2 : 0 }}
          animate={isAnimating ? {
            x: [-width * 2, -width],
          } : { x: 0 }}
          transition={isAnimating ? {
            duration: speed * 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            times: [0, 1],
          } : {}}
        />
      </svg>
      
      {/* Enhanced Glow Line (Scan Effect) with dual elements for continuous flow */}
      <div className="relative w-full h-full">
        {isAnimating && (
          <>
            <motion.div
              className="absolute top-0 h-full w-1.5 bg-gradient-to-b from-transparent via-teal-400/60 to-transparent"
              style={{ filter: 'blur(4px)' }}
              initial={{ left: "105%" }}
              animate={{ left: "-5%" }}
              transition={{
                duration: speed * 6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute top-0 h-full w-1.5 bg-gradient-to-b from-transparent via-teal-400/30 to-transparent"
              style={{ filter: 'blur(6px)' }}
              initial={{ left: "135%" }}
              animate={{ left: "-35%" }}
              transition={{
                duration: speed * 6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: speed * 2,
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ECGAnimation 