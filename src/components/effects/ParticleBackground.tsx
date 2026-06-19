import { useRef, useEffect } from 'react'

interface Cell {
  bx: number
  py: number
  vx: number
  vy: number
  type: number
}

export default function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number

    let cells: Cell[] = []
    let mouseX = -9999
    let mouseY = -9999
    let genCenter = 0

    const s = 100
    const gapX = s * 0.65
    const gapY = s * 0.56
    const collideDist = gapX * 0.7

    const build = (centerY?: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      const cy = centerY ?? window.scrollY
      genCenter = cy
      const cols = Math.ceil(w / gapX) + 4
      const rows = Math.ceil(h / gapY) * 3 + 8
      cells = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          cells.push({
            bx: col * gapX + (row % 2) * gapX * 0.5,
            py: cy + (row - rows / 2) * gapY,
            vx: (Math.random() - 0.5) * 0.17,
            vy: (Math.random() - 0.5) * 0.17,
            type: Math.floor(Math.random() * 3),
          })
        }
      }
    }

    build()
    window.addEventListener('resize', () => build(window.scrollY))

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY + window.scrollY
    }
    const handleLeave = () => {
      mouseX = -9999
      mouseY = -9999
    }

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('mouseleave', handleLeave)

    const drawIcon = (cx: number, cy: number, type: number, size: number) => {
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.15)'
      ctx.lineWidth = 2
      ctx.beginPath()

      if (type === 0) {
        ctx.moveTo(cx - size * 0.3, cy)
        ctx.lineTo(cx + size * 0.3, cy - size * 0.35)
        ctx.lineTo(cx + size * 0.3, cy + size * 0.35)
        ctx.closePath()
      } else if (type === 1) {
        ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2)
      } else {
        const h = size * 0.35
        ctx.rect(cx - h, cy - h, h * 2, h * 2)
      }

      ctx.stroke()
    }

    const animate = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const scrollY = window.scrollY

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      if (Math.abs(scrollY - genCenter) > window.innerHeight * 1.5) {
        build(scrollY)
      }

      ctx.clearRect(0, 0, w, h)

      for (const cell of cells) {
        let fx = cell.vx
        let fy = cell.vy

        const dx = cell.bx - mouseX
        const dy = cell.py - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 60 && dist > 1) {
          const force = (60 - dist) / 60 * 0.4
          fx += (dx / dist) * force
          fy += (dy / dist) * force
        }

        cell.vx += (fx - cell.vx) * 0.1
        cell.vy += (fy - cell.vy) * 0.1
        cell.bx += cell.vx
        cell.py += cell.vy

        if (cell.bx < -s * 2) cell.bx += w + s * 4
        if (cell.bx > w + s * 2) cell.bx -= w + s * 4
      }

      for (let iter = 0; iter < 2; iter++) {
        for (let i = 0; i < cells.length; i++) {
          for (let j = i + 1; j < cells.length; j++) {
            const a = cells[i]
            const b = cells[j]
            const dx = b.bx - a.bx
            const dy = b.py - a.py
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < collideDist && dist > 0.001) {
              const overlap = (collideDist - dist) / 2
              const nx = dx / dist
              const ny = dy / dist
              a.bx -= nx * overlap
              a.py -= ny * overlap
              b.bx += nx * overlap
              b.py += ny * overlap
            }
          }
        }
      }

      for (const cell of cells) {
        const drawY = cell.py - scrollY
        if (drawY < -s || drawY > h + s) continue

        drawIcon(cell.bx, drawY, cell.type, s * 0.5)
      }

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: -1, opacity: 1 }}
    />
  )
}
