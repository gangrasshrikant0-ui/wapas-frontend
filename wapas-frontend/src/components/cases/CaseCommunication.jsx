import { useState } from 'react';
import Panel from '../common/Panel.jsx';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import AudioUploader from '../transcription/AudioUploader.jsx';
import TranscriptViewer from '../transcription/TranscriptViewer.jsx';
import TranscriptList from '../transcription/TranscriptList.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { useTranscription } from '../../hooks/useTranscription.js';
import { listTranscripts } from '../../services/transcriptionService.js';

export default function CaseCommunication({ caseData, version, onChanged }) {
  const [fresh, setFresh] = useState(null);
  const [viewing, setViewing] = useState(null);
  const history = useAsync(() => listTranscripts({ caseId: caseData.id }), [caseData.id, version]);

  const transcription = useTranscription({
    caseId: caseData.id,
    onComplete: (result) => {
      setFresh(result);
      onChanged();
    },
  });

  const previous = (history.data ?? []).filter((t) => t.id !== fresh?.id);

  return (
    <Panel title="Audio / Communication" description="Call recordings and voice notes related to this case.">
      <div className="space-y-5">
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

        {fresh && <TranscriptViewer transcript={fresh} />}

        {previous.length > 0 && (
          <div>
            <h3 className="mb-2 text-[13px] font-medium text-zinc-700">Previous transcripts</h3>
            <div className="overflow-hidden rounded-lg border border-zinc-200">
              <TranscriptList items={previous} selectedId={viewing?.id} onSelect={setViewing} />
            </div>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        size="xl"
        title={viewing?.fileName ?? 'Transcript'}
        footer={<Button onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && <TranscriptViewer transcript={viewing} caseTitle={caseData.title} />}
      </Modal>
    </Panel>
  );
}
