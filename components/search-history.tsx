"use client";

import { Badge } from '@/components/ui/badge';
import type { SearchHistoryItem } from '@/types';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onHistoryItemClick: (location: string) => void;
}

export function SearchHistory({ history, onHistoryItemClick }: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="flex gap-3 flex-wrap justify-center max-w-4xl">
        {history.map((item, index) => (
          <Badge
            key={`${item.location}-${index}`}
            variant="secondary"
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 cursor-pointer transition-colors"
            onClick={() => onHistoryItemClick(item.location)}
          >
            {item.location}
          </Badge>
        ))}
      </div>
    </div>
  );
}