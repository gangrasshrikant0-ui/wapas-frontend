import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export default function Dropzone({ accept, multiple = false, disabled = false, onFiles, title, hint, icon: Icon = Upload }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const open = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const dropped = [...e.dataTransfer.files];
        if (dropped.length) onFiles(multiple ? dropped : dropped.slice(0, 1));
      }}
      className={`flex flex-col items-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors ${
        disabled
          ? 'cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400'
          : dragging
            ? 'cursor-pointer border-accent-600 bg-accent-50'
            : 'cursor-pointer border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const picked = [...e.target.files];
          e.target.value = '';
          if (picked.length) onFiles(picked);
        }}
      />
      <Icon className="h-5 w-5 text-zinc-400" aria-hidden />
      <p className="mt-2 text-sm font-medium text-zinc-800">{title}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
