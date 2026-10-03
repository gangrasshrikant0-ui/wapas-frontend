import { AudioLines, FileAudio, X } from 'lucide-react';
import Dropzone from '../common/Dropzone.jsx';
import Button from '../common/Button.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { ACCEPTED_AUDIO_EXT, MAX_AUDIO_MB, toAcceptAttr } from '../../utils/constants.js';
import { formatBytes, formatDuration } from '../../utils/format.js';

/** Controlled by useTranscription(). Handles selection and shows file and job status. */
export default function AudioUploader({ file, duration, status, error, busy, onSelect, onClear, onTranscribe }) {
  if (!file) {
    return (
      <div className="space-y-3">
        <Dropzone
          icon={AudioLines}
          accept={toAcceptAttr(ACCEPTED_AUDIO_EXT)}
          onFiles={([f]) => onSelect(f)}
          title="Drop an audio file here or click to browse"
          hint={`MP3, WAV, M4A or WEBM, up to ${MAX_AUDIO_MB} MB`}
        />
        {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
      </div>
    );
  }

  const transcriptKey = status === 'ready' ? 'ready' : status === 'error' ? 'error' : 'pending';

  return (
    <div className="rounded-lg border border-zinc-200">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">
            <FileAudio className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">{file.name}</p>
            <p className="text-xs text-zinc-500">{formatBytes(file.size)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={X} onClick={onClear} disabled={busy}>Remove</Button>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-4 py-4 md:grid-cols-4">
        <div className="min-w-0">
          <dt className="text-xs text-zinc-500">File name</dt>
          <dd className="mt-1 truncate text-sm font-medium text-zinc-900" title={file.name}>{file.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Duration</dt>
          <dd className="mt-1 text-sm font-medium tabular-nums text-zinc-900">{formatDuration(duration)}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Processing status</dt>
          <dd className="mt-1"><StatusBadge kind="job" status={status} /></dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Transcript status</dt>
          <dd className="mt-1"><StatusBadge kind="transcript" status={transcriptKey} /></dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 px-4 py-3">
        <Button variant={status === 'ready' ? 'secondary' : 'primary'} onClick={onTranscribe} loading={busy}>
          {status === 'ready' ? 'Transcribe again' : 'Transcribe Audio'}
        </Button>
        {busy && <p className="text-[13px] text-zinc-500" role="status">{status === 'uploading' ? 'Uploading audio…' : 'Transcribing… this can take a minute.'}</p>}
        {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}
