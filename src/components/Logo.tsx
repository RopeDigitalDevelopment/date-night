interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="32" r="30" fill="#1a0a2e" stroke="#ff3c6e" strokeWidth="2" />
      {/* Fork */}
      <line x1="20" y1="14" x2="20" y2="28" stroke="#ff3c6e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="17" y1="14" x2="17" y2="20" stroke="#ff3c6e" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="14" x2="23" y2="20" stroke="#ff3c6e" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="28" x2="20" y2="50" stroke="#ff3c6e" strokeWidth="2.5" strokeLinecap="round" />
      {/* Heart */}
      <path
        d="M32 25 C32 25 28 20 24.5 22 C21 24 21.5 29 25 31 L32 38 L39 31 C42.5 29 43 24 39.5 22 C36 20 32 25 32 25Z"
        fill="#ff3c6e"
      />
      {/* Champagne glass */}
      <path d="M44 14 L48 14 L46.5 24 L43.5 24 Z" fill="#ffd700" opacity="0.9" />
      <line x1="46" y1="24" x2="46" y2="34" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <line x1="43" y1="34" x2="49" y2="34" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      {/* Stars */}
      <circle cx="12" cy="12" r="1.5" fill="#ffd700" />
      <circle cx="52" cy="10" r="1" fill="#ff3c6e" />
      <circle cx="8" cy="40" r="1" fill="#ffd700" />
      <circle cx="56" cy="45" r="1.5" fill="#ff3c6e" />
    </svg>
  );
}
