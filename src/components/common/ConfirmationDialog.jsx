import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

/** `onConfirm` may be async. The dialog stays open if it throws. */
export default function ConfirmationDialog({ open, title, description, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'primary', confirmDisabled = false, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onCancel}
      title={title}
      footer={
        <>
          <Button onClick={onCancel} disabled={busy}>{cancelLabel}</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={handleConfirm} loading={busy} disabled={confirmDisabled}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description && <p className="text-sm text-zinc-600">{description}</p>}
      {children}
    </Modal>
  );
}
