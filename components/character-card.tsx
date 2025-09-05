"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
  onMoreInfo: (character: Character) => void;
}

export function CharacterCard({ character, onMoreInfo }: CharacterCardProps) {
  const getStatusColor = (status: Character['status']) => {
    switch (status) {
      case 'Alive':
        return 'bg-green-100 text-green-800';
      case 'Dead':
        return 'bg-red-100 text-red-800';
      case 'unknown':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">
          {character.name}
        </h3>
        <p className="text-sm text-neutral-600 mb-3">
          {character.species} • {character.gender}
        </p>
        <div className="flex items-center justify-between">
          <Badge className={`px-3 py-1 text-xs rounded-full ${getStatusColor(character.status)}`}>
            {character.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoreInfo(character)}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm"
          >
            More Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}