import { useCallback, useRef, useState } from 'react';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import DocumentPreviewModal from '../components/documents/DocumentPreviewModal.jsx';
import { NO_FILE, downloadDocument, replaceDocument } from '../services/documentService.js';
import { useToast } from './useToast.js';
import { validateFile } from '../utils/files.js';
import { ACCEPTED_DOC_EXT, MAX_DOC_MB, toAcceptAttr } from '../utils/constants.js';

/**
 * Shared View / Download / Replace behaviour for any document list.
 * Render `dialogs` once somewhere in the page.
 */
export function useDocumentActions({ caseTitles = {}, onChanged } = {}) {
  const toast = useToast();
  const [previewDoc, setPreviewDoc] = useState(null);
  const [pendingReplace, setPendingReplace] = useState(null);
  const targetRef = useRef(null);
  const inputRef = useRef(null);

  const onView = useCallback((doc) => setPreviewDoc(doc), []);

  const onDownload = useCallback(
    async (doc) => {
      try {
        await downloadDocument(doc);
      } catch (err) {
        if (err?.code === NO_FILE) {
          toast.push({ title: 'No file attached', description: 'This sample record has no file to download.', tone: 'info' });
        } else {
          toast.push({ title: "We couldn't download this document", description: 'Please try again.', tone: 'error' });
        }
      }
    },
    [toast],
  );

  const onReplace = useCallback((doc) => {
    targetRef.current = doc;
    inputRef.current?.click();
  }, []);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !targetRef.current) return;
    const problem = validateFile(file, ACCEPTED_DOC_EXT, MAX_DOC_MB);
    if (problem) {
      toast.push({ title: "This file can't be used", description: problem, tone: 'error' });
      return;
    }
    setPendingReplace({ doc: targetRef.current, file });
  };

  const confirmReplace = async () => {
    const { doc, file } = pendingReplace;
    try {
      await replaceDocument(doc.id, file);
      toast.push({ title: 'Document replaced', description: `${doc.name} was replaced with ${file.name}.`, tone: 'success' });
      setPendingReplace(null);
      onChanged?.();
    } catch {
      toast.push({ title: "We couldn't replace this document", description: 'Please try again.', tone: 'error' });
    }
  };

  const dialogs = (
    <>
      <input ref={inputRef} type="file" className="sr-only" tabIndex={-1} aria-hidden="true" accept={toAcceptAttr(ACCEPTED_DOC_EXT)} onChange={handleFile} />
      <DocumentPreviewModal
        doc={previewDoc}
        caseTitle={previewDoc ? caseTitles[previewDoc.caseId] ?? previewDoc.caseId : ''}
        onClose={() => setPreviewDoc(null)}
        onDownload={onDownload}
      />
      <ConfirmationDialog
        open={Boolean(pendingReplace)}
        title="Replace this document?"
        description={pendingReplace ? `${pendingReplace.doc.name} will be replaced with ${pendingReplace.file.name}. The new file will be processed again.` : ''}
        confirmLabel="Replace document"
        onCancel={() => setPendingReplace(null)}
        onConfirm={confirmReplace}
      />
    </>
  );

  return { onView, onDownload, onReplace, dialogs };
}
