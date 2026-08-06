'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/lib/types'

const FORMAT_LABELS: Record<string, string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  ebook: 'Ebook',
  audiobook: 'Audiolibro',
}

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (bookId: string, quantity: number) => void
  onRemove: (bookId: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const price = item.book.formats.find((f) => f.type === item.format)?.price || item.book.price

  return (
    <div className="flex gap-[var(--space-4)] py-[var(--space-4)] border-b border-border-subtle group">
      <div className="w-16 h-[88px] shrink-0 rounded-[var(--radius-sm)] bg-bg-muted overflow-hidden relative">
        <Image
          src={item.book.coverImage}
          alt={`Portada de ${item.book.title}`}
          fill
          sizes="64px"
          className="object-contain p-1"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text-primary line-clamp-2 mb-[var(--space-1)]">
          {item.book.title}
        </h4>
        <p className="text-xs text-text-tertiary mb-[var(--space-2)]">
          {FORMAT_LABELS[item.format]}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center border border-border-subtle rounded-[var(--radius-sm)] overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.book.id, Math.max(1, item.quantity - 1))}
              className="w-7 h-7 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
              aria-label="Disminuir cantidad"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-text-primary">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.book.id, Math.min(10, item.quantity + 1))}
              className="w-7 h-7 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-muted transition-colors duration-[var(--duration-micro)]"
              aria-label="Aumentar cantidad"
              disabled={item.quantity >= 10}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-sm font-bold text-text-primary">
            ${(price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.book.id)}
        className="shrink-0 p-[var(--space-1)] text-text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-all duration-[var(--duration-micro)] self-start"
        aria-label={`Eliminar ${item.book.title} del carrito`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
