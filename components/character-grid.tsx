"use client";

import { Skeleton } from '@/components/ui/skeleton';
import { CharacterCard } from './character-card';
import { Rocket } from 'lucide-react';
import type { Character } from '@/types';

interface CharacterGridProps {
  characters: Character[];
  onMoreInfo: (character: Character) => void;
  isLoading?: boolean;
  hasSearched?: boolean;
}

export function CharacterGrid({ characters, onMoreInfo, isLoading = false, hasSearched = false }: CharacterGridProps) {
  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl text-neutral-900 mb-6">Searching Characters...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (hasSearched && characters.length === 0) {
    return (
      <section className="text-center py-20">
        <div className="mb-8">
          <div className="w-32 h-32 bg-neutral-300 rounded-full mx-auto flex items-center justify-center text-white text-2xl">
            <Rocket className="w-12 h-12" />
          </div>
        </div>
        <h3 className="text-2xl text-neutral-900 mb-4">No characters found</h3>
        <p className="text-neutral-600 text-lg">Try searching for another location!</p>
      </section>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl text-neutral-900 mb-6">
        Characters Found ({characters.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onMoreInfo={onMoreInfo}
          />
        ))}
      </div>
    </section>
  );
}