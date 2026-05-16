import React from 'react'

export default function Sparkline({ points = [] }: { points?: number[] }) {
  if (!points || points.length === 0) return <div className="h-6 w-24 bg-card rounded" />
  const width = 80, height = 24
  const max = Math.max(...points), min = Math.min(...points)
  const norm = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - ((p - min) / (max - min || 1)) * height
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={norm} stroke="#00FF9C" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </svg>
  )
}
