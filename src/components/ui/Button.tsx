import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  as?: 'button' | 'span'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  as: Tag = 'button',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-body font-medium tracking-widest uppercase text-xs transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2'

  const variants = {
    primary:
      'bg-brand-amber text-white hover:bg-[#a0693a] active:scale-95 shadow-sm hover:shadow-md',
    outline:
      'border border-brand-amber text-brand-amber hover:bg-brand-amber hover:text-white active:scale-95',
    ghost:
      'text-brand-amber hover:text-[#a0693a] underline underline-offset-4 decoration-brand-amber/50 hover:decoration-brand-amber',
    dark:
      'bg-brand-dark text-brand-cream hover:bg-[#2d1a0e] active:scale-95 shadow-sm hover:shadow-md',
  }

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-7 py-3.5',
    lg: 'px-10 py-4 text-[11px]',
  }

  return (
    <Tag
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </Tag>
  )
}
