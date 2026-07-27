import { forwardRef, type HTMLAttributes } from 'react';

type Variant = 'default' | 'gold';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default: 'glass-panel border-void-500/20',
  gold: 'glass-panel border-gold-400/25',
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ variant = 'default', className = '', children, ...rest }, ref) => (
    <div ref={ref} className={`rounded-2xl ${variantStyles[variant]} ${className}`} {...rest}>
      {children}
    </div>
  ),
);
GlassPanel.displayName = 'GlassPanel';
