import { Download, Eye, RefreshCw } from 'lucide-react';
import { IconButton } from '../common/Button.jsx';

export default function DocumentActions({ doc, onView, onDownload, onReplace }) {
  return (
    <div className="flex items-center gap-0.5">
      <IconButton label={`View ${doc.name}`} icon={Eye} onClick={() => onView(doc)} />
      <IconButton label={`Download ${doc.name}`} icon={Download} onClick={() => onDownload(doc)} />
      {onReplace && <IconButton label={`Replace ${doc.name}`} icon={RefreshCw} onClick={() => onReplace(doc)} />}
    </div>
  );
}
