'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-[var(--height-btn-sm)] text-xs px-[var(--space-3)]',
  md: 'h-[var(--height-input)] text-sm px-[var(--space-4)]',
  lg: 'h-[var(--height-search)] text-base px-[var(--space-4)]',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      inputSize = 'md',
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-[var(--space-1)]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span
              className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 text-text-tertiary"
              aria-hidden="true"
            >
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'w-full rounded-[var(--radius-md)] bg-bg-surface border border-border-input text-text-primary placeholder:text-text-tertiary',
              'transition-all duration-[var(--duration-micro)]',
              'focus:border-brand-primary focus:border-[1.5px] focus:ring-4 focus:ring-brand-primary/12 focus:outline-none',
              'disabled:bg-bg-muted disabled:text-text-tertiary disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error/10',
              sizeStyles[inputSize],
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span
              className="absolute right-[var(--space-3)] top-1/2 -translate-y-1/2 text-text-tertiary"
              aria-hidden="true"
            >
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
