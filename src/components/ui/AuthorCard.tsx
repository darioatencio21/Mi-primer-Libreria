import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AuthorAvatar } from './AuthorAvatar'
import type { Author } from '@/lib/types'

interface AuthorCardProps {
  author: Author
  className?: string
  avatarClassName?: string
  nameClassName?: string
  sizes?: string
}

export function AuthorCard({
  author,
  className,
  avatarClassName,
  nameClassName,
  sizes = '112px',
}: AuthorCardProps) {
  return (
    <Link
      href={`/autores/${author.slug}`}
      className={cn('flex flex-col items-center text-center group', className)}
    >
      <div
        className={cn(
          'rounded-full bg-bg-muted border-2 border-border-subtle overflow-hidden mb-[var(--space-4)] group-hover:border-brand-primary transition-colors duration-200',
          avatarClassName ?? 'w-28 h-28'
        )}
      >
        <AuthorAvatar name={author.name} photo={author.photo} variant="circle" sizes={sizes} />
      </div>
      <h3
        className={cn(
          'text-base font-semibold text-text-primary mb-[var(--space-1)] group-hover:text-brand-primary transition-colors duration-[var(--duration-micro)] line-clamp-2',
          nameClassName
        )}
      >
        {author.name}
      </h3>
      <p className="text-xs text-text-tertiary">
        {author.bookCount} {author.bookCount === 1 ? 'libro' : 'libros'}
      </p>
    </Link>
  )
}