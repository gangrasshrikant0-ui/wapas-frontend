import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-accent-600 text-white hover:bg-accent-700 disabled:bg-accent-600/50',
  secondary: 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 disabled:text-zinc-400 disabled:hover:bg-white',
  ghost: 'text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-400 disabled:hover:bg-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50',
};
const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-[13px]',
  md: 'h-9 gap-2 px-3.5 text-sm',
};

export const buttonClasses = ({ variant = 'secondary', size = 'md', className = '' } = {}) =>
  `inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

export default function Button({ variant, size, icon: Icon, loading = false, className, children, disabled, type = 'button', ...rest }) {
  return (
    <button type={type} disabled={disabled || loading} className={buttonClasses({ variant, size, className })} {...rest}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, icon: Icon, className, children, ...rest }) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...rest}>
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
    </Link>
  );
}

export function IconButton({ label, icon: Icon, className = '', ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...rest}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
