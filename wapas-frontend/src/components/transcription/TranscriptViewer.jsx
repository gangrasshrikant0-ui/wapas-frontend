import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import Button from '../common/Button.jsx';
import { useToast } from '../../hooks/useToast.js';
import { copyText, triggerDownload } from '../../utils/files.js';
import { formatDateTime, formatDuration, formatTimestamp } from '../../utils/format.js';

/**
 * Renders { text, segments?: [{ start, end, text }] }.
 * Timestamps are offered only when the backend provides segments.
 */
export default function TranscriptViewer({ transcript, caseTitle }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);

  const segments = transcript.segments ?? [];
  const hasSegments = segments.length > 0;
  const timestamped = hasSegments && showTimestamps;

  const handleCopy = async () => {
    const ok = await copyText(transcript.text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.push({ title: "We couldn't copy the transcript", description: 'Select the text and copy it manually.', tone: 'error' });
    }
  };

  const handleDownload = () => {
    const base = (transcript.fileName ?? 'transcript').replace(/\.[^.]+$/, '');
    triggerDownload(new Blob([transcript.text], { type: 'text/plain;charset=utf-8' }), `${base}-transcript.txt`);
  };

  const meta = [
    transcript.fileName,
    transcript.duration != null && `Duration ${formatDuration(transcript.duration)}`,
    caseTitle,
    transcript.createdAt && formatDateTime(transcript.createdAt),
  ].filter(Boolean);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white" aria-label="Transcript">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900">Transcript</h3>
          <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-zinc-500">
            {meta.map((m) => <span key={m}>{m}</span>)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasSegments && (
            <label className="mr-1 flex cursor-pointer items-center gap-2 text-[13px] text-zinc-600">
              <input type="checkbox" checked={showTimestamps} onChange={(e) => setShowTimestamps(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 accent-accent-600" />
              Timestamps
            </label>
          )}
          <Button size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</Button>
          <Button size="sm" icon={Download} onClick={handleDownload}>Download .txt</Button>
        </div>
      </header>

      <div className="max-h-[28rem] overflow-y-auto px-4 py-5 sm:px-8">
        {timestamped ? (
          <ol className="space-y-4">
            {segments.map((s, i) => (
              <li key={`${s.start}-${i}`} className="grid grid-cols-[3.25rem_1fr] gap-3">
                <span className="pt-0.5 text-xs tabular-nums text-zinc-400">{formatTimestamp(s.start)}</span>
                <p className="max-w-prose text-[15px] leading-7 text-zinc-800">{s.text}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="max-w-prose whitespace-pre-line text-[15px] leading-7 text-zinc-800">{transcript.text}</p>
        )}
      </div>
    </section>
  );
}
