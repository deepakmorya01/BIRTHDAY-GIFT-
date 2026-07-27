import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'solid' | 'outline' | 'ghost';

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium tracking-wide transition-all duration-500 ease-cinematic disabled:opacity-50 disabled:pointer-events-none';

const variantStyles: Record<Variant, string> = {
  solid:
    'bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 text-void-950 shadow-[0_0_20px_rgba(233,177,58,0.3)] hover:shadow-[0_0_30px_rgba(233,177,58,0.5)] hover:scale-[1.03] active:scale-[0.97]',
  outline:
    'border border-gold-300/40 text-gold-200 hover:border-gold-300/70 hover:bg-gold-300/5 hover:shadow-[0_0_20px_rgba(233,177,58,0.15)] active:scale-[0.97]',
  ghost:
    'text-void-200 hover:text-gold-200 hover:bg-gold-300/5 active:scale-[0.97]',
};

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ variant = 'solid', className = '', children, ...rest }, ref) => (
    <button ref={ref} className={`${base} ${variantStyles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  ),
);
GoldButton.displayName = 'GoldButton';
