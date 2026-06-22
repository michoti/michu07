import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
  size?: number;
  animate?: boolean;
}

export function Logo({ variant = 'full', className, size = 40, animate = false }: LogoProps) {
  const Mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animate && 'logo-spinner', className)}
      aria-label="Michu07 logo mark"
    >
      {/* Outer ring */}
      <circle cx="40" cy="40" r="38" stroke="#C5A059" strokeWidth="1.5" />
      {/* Crown (watch crown element) */}
      <rect x="36" y="4" width="8" height="5" rx="1" fill="#C5A059" />
      {/* Dial face */}
      <circle cx="40" cy="40" r="28" fill="#0B0C10" stroke="#C5A059" strokeWidth="1" />
      {/* Hour markers */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const isMain = i % 3 === 0;
        const r1 = isMain ? 22 : 23;
        const r2 = isMain ? 26 : 25;
        return (
          <line
            key={deg}
            x1={40 + r1 * Math.sin(rad)}
            y1={40 - r1 * Math.cos(rad)}
            x2={40 + r2 * Math.sin(rad)}
            y2={40 - r2 * Math.cos(rad)}
            stroke="#C5A059"
            strokeWidth={isMain ? 2 : 1}
            opacity={isMain ? 1 : 0.5}
          />
        );
      })}
      {/* Hour hand */}
      <line x1="40" y1="40" x2="40" y2="22" stroke="#C5C6C7" strokeWidth="2.5" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1="40" y1="40" x2="52" y2="35" stroke="#C5C6C7" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center jewel */}
      <circle cx="40" cy="40" r="3" fill="#C5A059" />
      <circle cx="40" cy="40" r="1.5" fill="#0B0C10" />
      {/* M brand mark */}
      <text
        x="40"
        y="56"
        textAnchor="middle"
        fontSize="7"
        fontFamily="'Playfair Display', serif"
        fill="#C5A059"
        letterSpacing="1"
      >
        M07
      </text>
    </svg>
  );

  if (variant === 'mark') return Mark;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {Mark}
      <div className="flex flex-col leading-none">
        <span
          style={{ fontFamily: 'var(--font-display)', color: 'var(--platinum)', fontSize: '1.1rem', letterSpacing: '0.1em' }}
        >
          MICHU
        </span>
        <span
          style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1.1rem', letterSpacing: '0.25em' }}
        >
          07
        </span>
      </div>
    </div>
  );
}
