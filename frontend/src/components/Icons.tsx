import React from 'react'

interface IconProps { size?: number; color?: string; style?: React.CSSProperties }

export const MapPinIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export const ShieldCheckIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

export const AccessibilityIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="4" r="1.5" fill={color} stroke="none"/>
    <path d="M6 9.5l6-1.5 6 1.5"/>
    <path d="M12 8v5"/>
    <path d="M7.5 22l2-8M16.5 22l-2-8"/>
  </svg>
)

export const AlertIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <circle cx="12" cy="17" r="0.5" fill={color}/>
  </svg>
)

export const VoteIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
)

export const MonitorIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

export const MailIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

export const BarChartIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)

export const ChecklistIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
)

export const CompassIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
)

export const FileSearchIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <circle cx="10" cy="14" r="2.5"/>
    <path d="M16 16l-2-2"/>
  </svg>
)

export const KeyboardIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <line x1="6" y1="10" x2="6" y2="10" strokeWidth="2.5"/>
    <line x1="10" y1="10" x2="10" y2="10" strokeWidth="2.5"/>
    <line x1="14" y1="10" x2="14" y2="10" strokeWidth="2.5"/>
    <line x1="18" y1="10" x2="18" y2="10" strokeWidth="2.5"/>
    <line x1="8" y1="14" x2="16" y2="14" strokeWidth="2"/>
  </svg>
)

export const BotIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="9" width="18" height="12" rx="3"/>
    <path d="M8 9V7a4 4 0 1 1 8 0v2"/>
    <circle cx="9" cy="15" r="0.8" fill={color}/>
    <circle cx="15" cy="15" r="0.8" fill={color}/>
    <path d="M9.5 18.5h5"/>
    <line x1="12" y1="3" x2="12" y2="5" strokeWidth="1.5"/>
  </svg>
)

export const SearchCheckIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
    <path d="M8.5 11l2 2 3.5-3.5"/>
  </svg>
)

export const InfoCircleIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.5"/>
  </svg>
)

export const CalendarIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

export const BookOpenIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)

export const ScaleIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="12" y1="3" x2="12" y2="21"/>
    <path d="M3 6l9-3 9 3"/>
    <path d="M3 6L6 14a3 3 0 0 0 6 0L9 6"/>
    <path d="M15 6l3 8a3 3 0 0 0 6 0l-3-8"/>
  </svg>
)

export const BellIcon = ({ size = 24, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
