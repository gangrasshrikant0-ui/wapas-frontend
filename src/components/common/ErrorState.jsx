import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorState({ title = "We couldn't load this page", description = 'Check your connection and try again.', onRetry, className = '' }) {
  return (
    <div role="alert" className={`flex flex-col items-center px-6 py-12 text-center ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {onRetry && (
        <Button className="mt-4" icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
