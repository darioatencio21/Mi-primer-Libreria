'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    const el = tabRefs.current.get(activeTab)
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [activeTab])

  return (
    <div className={className}>
      <div className="relative border-b border-border-subtle" role="tablist">
        <div className="flex gap-[var(--space-6)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el)
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'pb-[var(--space-3)] text-sm transition-colors duration-[var(--duration-micro)]',
                activeTab === tab.id
                  ? 'text-text-primary font-semibold'
                  : 'text-text-secondary font-normal hover:text-text-primary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="absolute bottom-0 h-[2px] bg-brand-primary transition-all duration-200 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          aria-hidden="true"
        />
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={tab.id}
          hidden={activeTab !== tab.id}
          className="pt-[var(--space-6)]"
        >
          {activeTab === tab.id && tab.content}
        </div>
      ))}
    </div>
  )
}
