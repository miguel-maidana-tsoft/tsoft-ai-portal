import { useEffect, useRef } from 'react'

const COLORS = ['#C8102E', '#FFFFFF', '#88C8F0', '#F0A030', '#4DC990']

export default function Confetti({ count = 90 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: count }, (_, i) => ({
      x:     Math.random() * canvas.width,
      y:     -20 - Math.random() * 160,
      w:     7  + Math.random() * 7,
      h:     3  + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:    -1.5 + Math.random() * 3,
      vy:    2.5  + Math.random() * 3.5,
      rot:   Math.random() * Math.PI * 2,
      rotV:  -0.08 + Math.random() * 0.16,
      alpha: 1,
      delay: i * 2, // stagger spawn
    }))

    let frame
    let tick = 0

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick++

      particles.forEach((p) => {
        if (tick < p.delay) return
        p.x   += p.vx
        p.y   += p.vy
        p.rot += p.rotV
        if (tick > 100) p.alpha -= 0.007

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })

      if (particles.some((p) => p.alpha > 0)) {
        frame = requestAnimationFrame(draw)
      }
    }

    draw()
    return () => cancelAnimationFrame(frame)
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 200,
      }}
    />
  )
}
