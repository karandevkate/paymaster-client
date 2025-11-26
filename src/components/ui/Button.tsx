// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-danger' | 'outline-secondary';
  size?: 'sm' | 'lg';
  isLoading?: boolean;
  block?: boolean; // full width
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size,
  isLoading = false,
  block = false,
  disabled,
  className = '',
  ...props
}) => {
  const btnClasses = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    block && 'w-100',
    isLoading && 'disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={btnClasses}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      )}
      {children}
    </button>
  );
};