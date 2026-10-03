import { FileImage, FileText } from 'lucide-react';
import { getExtension } from '../../utils/files.js';

export default function FileTypeIcon({ name }) {
  const ext = getExtension(name);
  const Icon = ['jpg', 'jpeg', 'png'].includes(ext) ? FileImage : FileText;
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">
      <Icon className="h-[18px] w-[18px]" aria-hidden />
    </span>
  );
}
