import { cn } from '@/lib/utils'

type SkeletonVariant = 'card' | 'text' | 'circle' | 'rect'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  className?: string
  lines?: number
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  lines = 1,
}: SkeletonProps) {
  const baseStyles =
    'bg-bg-muted rounded-[var(--radius-md)] relative overflow-hidden'

  const shimmerStyle = {
    backgroundImage:
      'linear-gradient(90deg, var(--color-bg-muted) 25%, #FFFFFF 50%, var(--color-bg-muted) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer var(--duration-shimmer) linear infinite',
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-[var(--radius-lg)] border border-border-subtle overflow-hidden', className)}>
        <div
          className={cn(baseStyles, 'aspect-[3/4]')}
          style={shimmerStyle}
          aria-hidden="true"
        />
        <div className="p-[var(--space-4)] flex flex-col gap-[var(--space-3)]">
          <div className={cn(baseStyles, 'h-3 w-2/3')} style={shimmerStyle} aria-hidden="true" />
          <div className={cn(baseStyles, 'h-4 w-full')} style={shimmerStyle} aria-hidden="true" />
          <div className={cn(baseStyles, 'h-4 w-4/5')} style={shimmerStyle} aria-hidden="true" />
          <div className={cn(baseStyles, 'h-3 w-1/3 mt-1')} style={shimmerStyle} aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (variant === 'circle') {
    return (
      <div
        className={cn(baseStyles, 'rounded-full')}
        style={{
          width: width || 48,
          height: height || width || 48,
          ...shimmerStyle,
        }}
        aria-hidden="true"
      />
    )
  }

  if (variant === 'text') {
    return (
      <div className="flex flex-col gap-[var(--space-2)]" aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseStyles, 'h-4')}
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              ...shimmerStyle,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseStyles, className)}
      style={{
        width: width || '100%',
        height: height || 20,
        ...shimmerStyle,
      }}
      aria-hidden="true"
    />
  )
}
