"use client";

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search-bar';
import { SearchHistory } from '@/components/search-history';
import { CharacterGrid } from '@/components/character-grid';
import { CharacterModal } from '@/components/character-modal';
import { RickAndMortyAPI } from '@/lib/api';
import { SearchHistoryManager } from '@/lib/storage';
import type { Character, SearchHistoryItem } from '@/types';

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearchHistory(SearchHistoryManager.getSearchHistory());
  }, []);

  const handleSearch = async (location: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const results = await RickAndMortyAPI.getCharactersByLocation(location);
      setCharacters(results);
      
      // Update search history
      SearchHistoryManager.addSearchItem(location);
      setSearchHistory(SearchHistoryManager.getSearchHistory());
    } catch (err) {
      setError('Failed to search characters. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (location: string) => {
    handleSearch(location);
  };

  const handleMoreInfo = (character: Character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Rick & Morty Explorer</h1>
        <p className="text-neutral-600 text-lg">Search characters by their location in the multiverse</p>
      </header>

      {/* Search Section */}
      <section className="mb-10">
        <div className="flex justify-center mb-6">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <SearchHistory
            history={searchHistory}
            onHistoryItemClick={handleHistoryItemClick}
          />
        )}
      </section>

      {/* Error Message */}
      {error && (
        <div className="text-center mb-6">
          <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg inline-block">
            {error}
          </p>
        </div>
      )}

      {/* Results Section */}
      <CharacterGrid
        characters={characters}
        onMoreInfo={handleMoreInfo}
        isLoading={isLoading}
        hasSearched={hasSearched}
      />

      {/* Character Modal */}
      <CharacterModal
        character={selectedCharacter}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="mt-20 py-6 text-center border-t border-neutral-200">
        <p className="text-neutral-600 text-sm">
          Powered by{' '}
          <a
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 hover:underline font-medium"
          >
            Rick and Morty API
          </a>
          {' '} + AI Insights
        </p>
      </footer>
    </div>
  );
}
