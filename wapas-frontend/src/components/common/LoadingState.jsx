import { Loader2 } from 'lucide-react';

export const Skeleton = ({ className = '' }) => <div aria-hidden className={`animate-pulse rounded bg-zinc-200/70 ${className}`} />;

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="divide-y divide-zinc-200" role="status">
      <span className="sr-only">Loading</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="h-8 w-8" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-zinc-500">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}
