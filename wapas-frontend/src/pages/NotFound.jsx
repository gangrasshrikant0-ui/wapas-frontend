import { Compass } from 'lucide-react';
import EmptyState from '../components/common/EmptyState.jsx';
import { ButtonLink } from '../components/common/Button.jsx';

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
      action={<ButtonLink to="/" variant="primary">Go to dashboard</ButtonLink>}
      className="py-24"
    />
  );
}
