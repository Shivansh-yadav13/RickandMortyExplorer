"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RickAndMortyAPI } from '@/lib/api';
import { AIInsightsGenerator } from '@/lib/ai-insights';
import type { Character, Episode, CharacterInsights } from '@/types';

interface CharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CharacterModal({ character, isOpen, onClose }: CharacterModalProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [insights, setInsights] = useState<CharacterInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!character || !isOpen) {
      setEpisodes([]);
      setInsights(null);
      return;
    }

    const fetchCharacterDetails = async () => {
      setIsLoading(true);
      try {
        // Extract episode IDs from URLs
        const episodeIds = RickAndMortyAPI.extractEpisodeIds(character.episode);
        
        // Fetch episodes
        const episodeData = await RickAndMortyAPI.getEpisodesByIds(episodeIds);
        const sortedEpisodes = RickAndMortyAPI.sortEpisodesByNumber(episodeData);
        setEpisodes(sortedEpisodes);
        
        // Generate AI insights
        const characterInsights = AIInsightsGenerator.generateInsights(character, sortedEpisodes);
        setInsights(characterInsights);
      } catch (error) {
        console.error('Error fetching character details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [character, isOpen]);

  if (!character) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{character.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Character Info */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-xl overflow-hidden">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className={`${getStatusColor(character.status)}`}>
                  {character.status}
                </Badge>
                <Badge variant="outline">{character.species}</Badge>
                <Badge variant="outline">{character.gender}</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Origin:</strong> {character.origin.name}</p>
                <p><strong>Current Location:</strong> {character.location.name}</p>
                <p><strong>Episodes:</strong> {character.episode.length}</p>
              </div>
            </div>
          </div>

          {/* Episodes & Insights */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Character Insights</h3>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : insights ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Arc Type:</strong>
                    <Badge variant="secondary" className="ml-2">
                      {insights.arcType}
                    </Badge>
                  </div>
                  <div>
                    <strong>Role:</strong> {insights.role}
                  </div>
                  <div>
                    <strong>Notable Events:</strong>
                    <ul className="mt-1 space-y-1">
                      {insights.notableEvents.map((event, index) => (
                        <li key={index} className="text-neutral-600">
                          • {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Episode Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Episode Timeline</h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {episodes.map((episode) => (
                    <div key={episode.id} className="p-3 border rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="font-medium text-sm">{episode.name}</div>
                      <div className="text-xs text-neutral-600 flex justify-between">
                        <span>{episode.episode}</span>
                        <span>{episode.air_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}