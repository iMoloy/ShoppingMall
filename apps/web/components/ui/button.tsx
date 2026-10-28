import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  asChild?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] disabled:opacity-60',
  secondary:
    'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-60',
  destructive: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-60',
  ghost:
    'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] disabled:opacity-60',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

function buildClassName(variant: Variant, size: Size, extra = '') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}

// When asChild=true, we clone the single child element and spread button-like
// classes onto it (e.g. <Link>). This avoids invalid <button><a> nesting.
interface AsChildProps {
  variant?: Variant
  size?: Size
  asChild: true
  children: React.ReactElement<{ className?: string }>
  className?: string
}

export function Button(props: AsChildProps): React.ReactElement
export function Button(props: ButtonProps): React.ReactElement
export function Button(props: ButtonProps | AsChildProps): React.ReactElement {
  const { variant = 'primary', size = 'md', className = '' } = props
  const builtClass = buildClassName(variant, size, className)

  if ('asChild' in props && props.asChild) {
    const child = props.children as React.ReactElement<{ className?: string }>
    return {
      ...child,
      props: {
        ...child.props,
        className: [child.props.className, builtClass].filter(Boolean).join(' '),
      },
    } as React.ReactElement
  }

  const { loading = false, children, disabled, ...rest } =
    props as ButtonProps
  delete (rest as { asChild?: boolean }).asChild

  return (
    <ButtonInner
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled || loading}
      className={className}
      {...rest}
    >
      {children}
    </ButtonInner>
  )
}

const ButtonInner = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'asChild'> & { variant: Variant; size: Size }
>(({ variant, size, loading = false, className = '', children, ...props }, ref) => (
  <button ref={ref} className={buildClassName(variant, size, className)} {...props}>
    {loading && <SpinnerIcon />}
    {children}
  </button>
))
ButtonInner.displayName = 'ButtonInner'

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}
