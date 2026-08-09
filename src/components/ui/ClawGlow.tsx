type Props = {
  className?: string;
};

/**
 * Three glowing claw-mark slashes — JungleX's one signature element.
 * Raw and predatory (claw marks), bioluminescent (soft glow via blur),
 * used sparingly: under the wordmark and as a card accent. The opacity
 * pulse never moves or resizes anything, so it can't cause layout shift.
 */
const ClawGlow = ({ className = '' }: Props) => {
  return (
    <svg
      viewBox="0 0 120 40"
      preserveAspectRatio="xMidYMid meet"
      className={`glow-pulse ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="clawGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-glow)" />
          <stop offset="100%" stopColor="var(--color-glow-cyan)" />
        </linearGradient>
        <filter id="clawBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      <g stroke="url(#clawGradient)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M8 6 L36 34" filter="url(#clawBlur)" opacity="0.9" />
        <path d="M18 2 L52 36" filter="url(#clawBlur)" />
        <path d="M28 0 L68 38" filter="url(#clawBlur)" opacity="0.9" />
      </g>
    </svg>
  );
};

export default ClawGlow;
