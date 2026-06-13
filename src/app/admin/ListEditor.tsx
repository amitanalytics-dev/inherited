'use client'

import { ChevronUp, ChevronDown, X, Plus } from 'lucide-react'
import { clsx } from 'clsx'

type FieldDef<T> = {
  key: keyof T
  label: string
  multiline?: boolean
  hint?: string
  optional?: boolean
}

type ListEditorProps<T extends Record<string, string>> = {
  items: T[]
  fields: FieldDef<T>[]
  onChange: (items: T[]) => void
  disabled?: boolean
  defaultItem: T
  addLabel?: string
  maxItems?: number
}

export default function ListEditor<T extends Record<string, string>>({
  items,
  fields,
  onChange,
  disabled,
  defaultItem,
  addLabel = 'Add item',
  maxItems,
}: ListEditorProps<T>) {
  const update = (index: number, key: keyof T, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const next = [...items]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
  }

  const add = () => {
    onChange([...items, { ...defaultItem }])
  }

  const atMax = maxItems !== undefined && items.length >= maxItems

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <details
          key={index}
          className="group border border-brand-warm rounded-lg bg-white overflow-hidden"
          open
        >
          <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden bg-brand-warm/30 hover:bg-brand-warm/50 transition-colors">
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={(e) => { e.preventDefault(); moveUp(index) }}
                className="text-brand-muted hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                disabled={disabled || index === items.length - 1}
                onClick={(e) => { e.preventDefault(); moveDown(index) }}
                className="text-brand-muted hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown size={13} />
              </button>
            </div>
            <span className="w-5 h-5 rounded-full bg-brand-amber/20 text-brand-amber font-body text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </span>
            <span className="font-body text-sm text-brand-dark font-medium flex-1 truncate">
              {String(item[fields[0].key] || '—')}
            </span>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => { e.preventDefault(); remove(index) }}
              className="ml-2 text-brand-muted hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              title="Remove"
            >
              <X size={14} />
            </button>
          </summary>
          <div className="px-4 pb-4 pt-3 space-y-4">
            {fields.map((field) => (
              <label key={String(field.key)} className="block">
                <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
                  {field.label}
                  {field.optional && (
                    <span className="ml-1 normal-case tracking-normal font-normal text-brand-muted">
                      (optional)
                    </span>
                  )}
                </span>
                {field.hint && (
                  <span className="block font-body text-xs text-brand-muted mt-0.5">
                    {field.hint}
                  </span>
                )}
                {field.multiline ? (
                  <textarea
                    rows={3}
                    value={item[field.key] ?? ''}
                    disabled={disabled}
                    onChange={(e) => update(index, field.key, e.target.value)}
                    className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={item[field.key] ?? ''}
                    disabled={disabled}
                    onChange={(e) => update(index, field.key, e.target.value)}
                    className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted"
                  />
                )}
              </label>
            ))}
          </div>
        </details>
      ))}

      <button
        type="button"
        disabled={disabled || atMax}
        onClick={add}
        className={clsx(
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border font-body text-xs tracking-widest uppercase transition-colors',
          disabled || atMax
            ? 'border-brand-warm text-brand-muted cursor-not-allowed'
            : 'border-brand-amber text-brand-amber hover:bg-brand-amber/10'
        )}
      >
        <Plus size={13} />
        {addLabel}
        {maxItems !== undefined && (
          <span className="font-normal normal-case tracking-normal text-brand-muted ml-1">
            ({items.length}/{maxItems})
          </span>
        )}
      </button>
    </div>
  )
}
