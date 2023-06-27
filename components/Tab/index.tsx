'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Tabs({ items }: { items: { name: string; href: string }[] }) {
  const pathname = usePathname()

  return (
    <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
      {items.map((item) => {
        return (
          <Link
            key={item.name}
            className={`rounded py-1 px-2 ${
              pathname === item.href
                ? 'bg-white shadow text-slate-700'
                : 'bg-transparent text-slate-500 hover:text-slate-600'
            }`}
            href={item.href}
          >
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}
