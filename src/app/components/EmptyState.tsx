import { Card } from '../components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
