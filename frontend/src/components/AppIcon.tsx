import React from 'react'

interface AppIconProps {
  children: React.ReactNode  // SVG element (24x24 viewBox, white stroke/fill)
  gradient: string           // CSS gradient string
  size?: number              // default 52
  shadowColor?: string       // rgba color for drop shadow, default rgba(0,0,0,0.4)
  className?: string
  style?: React.CSSProperties
}

export default function AppIcon({ children, gradient, size = 52, shadowColor = 'rgba(0,0,0,0.4)', className, style }: AppIconProps) {
  const r = Math.round(size * 0.225)  // Apple's icon corner radius ratio
  return (
    <div
      className={className}
      style={{
        width: size, height: size,
        borderRadius: r,
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        boxShadow: `0 4px 16px ${shadowColor}, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.18)`,
        ...style,
      }}
    >
      <div style={{ width: size * 0.52, height: size * 0.52, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

export const GRADIENTS = {
  saffron:  'linear-gradient(145deg, #FF8F5F 0%, #E84E1A 100%)',
  blue:     'linear-gradient(145deg, #6BB5FF 0%, #1565C0 100%)',
  green:    'linear-gradient(145deg, #5DD6A3 0%, #1B7C55 100%)',
  purple:   'linear-gradient(145deg, #C084FC 0%, #6D28D9 100%)',
  indigo:   'linear-gradient(145deg, #818CF8 0%, #3730A3 100%)',
  teal:     'linear-gradient(145deg, #2DD4BF 0%, #0F766E 100%)',
  rose:     'linear-gradient(145deg, #FB7185 0%, #BE123C 100%)',
  amber:    'linear-gradient(145deg, #FCD34D 0%, #B45309 100%)',
  slate:    'linear-gradient(145deg, #94A3B8 0%, #334155 100%)',
  navy:     'linear-gradient(145deg, #60A5FA 0%, #1E3A8A 100%)',
}
