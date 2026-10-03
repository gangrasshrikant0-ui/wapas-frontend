import { useCallback, useRef, useState } from 'react';
import { transcribeAudio } from '../services/transcriptionService';
import { toUserMessage } from '../services/api';
import { getAudioDuration, validateFile } from '../utils/files';
import { ACCEPTED_AUDIO_EXT, MAX_AUDIO_MB } from '../utils/constants';

/**
 * State machine for one audio file: select -> transcribe -> transcript.
 * status: "idle" | "uploading" | "transcribing" | "ready" | "error"
 */
export function useTranscription({ caseId, onComplete } = {}) {
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const durationRef = useRef(null);
  const selectedRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const select = useCallback(async (next) => {
    const problem = validateFile(next, ACCEPTED_AUDIO_EXT, MAX_AUDIO_MB);
    if (problem) {
      setError(problem);
      return;
    }
    selectedRef.current = next;
    durationRef.current = null;
    setFile(next);
    setDuration(null);
    setResult(null);
    setError(null);
    setStatus('idle');
    const d = await getAudioDuration(next);
    if (selectedRef.current === next) {
      durationRef.current = d;
      setDuration(d);
    }
  }, []);

  const clear = useCallback(() => {
    selectedRef.current = null;
    setFile(null);
    setDuration(null);
    setResult(null);
    setError(null);
    setStatus('idle');
  }, []);

  const run = useCallback(async () => {
    if (!file) return;
    setError(null);
    setResult(null);
    setStatus('uploading');
    try {
      const transcript = await transcribeAudio(file, {
        caseId,
        duration: durationRef.current,
        onStatus: setStatus,
      });
      setResult(transcript);
      setStatus('ready');
      onCompleteRef.current?.(transcript);
    } catch (err) {
      setError(toUserMessage(err, "We couldn't transcribe this audio. Please try again."));
      setStatus('error');
    }
  }, [file, caseId]);

  return {
    file,
    duration,
    status,
    result,
    error,
    busy: status === 'uploading' || status === 'transcribing',
    select,
    clear,
    run,
  };
}
