"use client"

import { useEffect, useRef } from "react"

export default function FireAnimation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const particles = []
    const particleCount = 40

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 10
        this.radius = Math.random() * 2 + 1
        this.color = `hsl(${Math.random() * 30 + 10}, 100%, 50%)`
        this.velocity = {
          x: Math.random() * 2 - 1,
          y: Math.random() * -3 - 1,
        }
        this.life = Math.random() * 100 + 100
        this.opacity = Math.random() * 0.5 + 0.5
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }

      update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.life -= 1
        this.opacity -= 0.005

        if (this.opacity < 0) {
          this.opacity = 0
        }
      }
    }

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        // Replace dead particles
        if (particles[i].life <= 0 || particles[i].opacity <= 0) {
          particles[i] = new Particle()
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />
}

