// components/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  addon?: React.ReactNode; // for icons, buttons, etc.
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  addon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-3">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}

      {/* Input with Optional Addon */}
      <div className={addon ? 'input-group' : ''}>
        {addon && <span className="input-group-text">{addon}</span>}

        <input
          id={inputId}
          className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          {...props}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback">
          {error}
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <div id={`${inputId}-help`} className="form-text text-muted">
          {helpText}
        </div>
      )}
    </div>
  );
};