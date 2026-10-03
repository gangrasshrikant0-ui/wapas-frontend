import { useMemo, useState } from 'react';
import { AudioLines } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import Panel from '../components/common/Panel.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { ListSkeleton } from '../components/common/LoadingState.jsx';
import AudioUploader from '../components/transcription/AudioUploader.jsx';
import TranscriptViewer from '../components/transcription/TranscriptViewer.jsx';
import TranscriptList from '../components/transcription/TranscriptList.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useTranscription } from '../hooks/useTranscription.js';
import { listTranscripts } from '../services/transcriptionService.js';
import { listCases } from '../services/caseService.js';

export default function Transcription() {
  const [caseId, setCaseId] = useState('');
  const [viewing, setViewing] = useState(null);
  const history = useAsync(() => listTranscripts(), []);
  const cases = useAsync(listCases, []);
  const caseTitles = useMemo(() => Object.fromEntries((cases.data ?? []).map((c) => [c.id, c.title])), [cases.data]);

  const transcription = useTranscription({
    caseId: caseId || undefined,
    onComplete: (result) => {
      setViewing(result);
      history.reload();
    },
  });

  return (
    <>
      <PageHeader title="Transcriptions" description="Turn call recordings and voice notes into text you can review, copy and keep." />

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Audio file">
            <div className="space-y-4">
              <div className="sm:max-w-xs">
                <label htmlFor="link-case" className="label">Link to a case (optional)</label>
                <select id="link-case" className="input" value={caseId} onChange={(e) => setCaseId(e.target.value)} disabled={transcription.busy}>
                  <option value="">Not linked</option>
                  {(cases.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <AudioUploader
                file={transcription.file}
                duration={transcription.duration}
                status={transcription.status}
                error={transcription.error}
                busy={transcription.busy}
                onSelect={transcription.select}
                onClear={transcription.clear}
                onTranscribe={transcription.run}
              />
            </div>
          </Panel>

          {viewing ? (
            <TranscriptViewer transcript={viewing} caseTitle={viewing.caseId ? caseTitles[viewing.caseId] : undefined} />
          ) : (
            <Panel>
              <EmptyState icon={AudioLines} title="No transcript selected" description="Upload an audio file and choose Transcribe Audio, or open a previous transcript from the list." />
            </Panel>
          )}
        </div>

        <Panel title="Previous transcriptions" padded={false}>
          {history.initialLoading ? (
            <ListSkeleton rows={3} />
          ) : history.failed ? (
            <ErrorState title="We couldn't load transcripts" onRetry={history.reload} />
          ) : history.data.length === 0 ? (
            <EmptyState icon={AudioLines} title="Nothing here yet" description="Finished transcripts are listed here." />
          ) : (
            <TranscriptList items={history.data} selectedId={viewing?.id} onSelect={setViewing} caseTitles={caseTitles} />
          )}
        </Panel>
      </div>
    </>
  );
}
