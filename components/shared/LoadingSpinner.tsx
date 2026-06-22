import { Logo } from './Logo';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  label?: string;
}

export function LoadingSpinner({ fullScreen = false, label = 'Loading…' }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Logo variant="mark" size={56} animate />
      <p className="eyebrow" style={{ fontSize: '0.65rem' }}>{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: 'var(--midnight)' }}
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
      {content}
    </div>
  );
}
