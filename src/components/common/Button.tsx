import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'link' | 'neutral' | 'outline';
    size?: 'lg' | 'md' | 'sm' | 'xs';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant,
    size,
    isLoading,
    children,
    disabled,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'btn',
                variant && `btn-${variant}`,
                size && `btn-${size}`,
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
