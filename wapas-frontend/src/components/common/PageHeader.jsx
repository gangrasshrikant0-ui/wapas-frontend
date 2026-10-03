import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PageHeader({ title, description, actions, backTo, backLabel, meta }) {
  useEffect(() => {
    if (typeof title === 'string') document.title = `${title} | WAPAS`;
  }, [title]);

  return (
    <div className="mb-6">
      {backTo && (
        <Link to={backTo} className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-zinc-500 hover:text-zinc-900">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">{title}</h1>
          {meta && <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-zinc-500">{meta}</div>}
          {description && <p className="mt-1.5 max-w-2xl text-sm text-zinc-500">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
