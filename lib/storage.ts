import type { SearchHistoryItem } from '@/types';

const SEARCH_HISTORY_KEY = 'rick-morty-search-history';
const MAX_HISTORY_ITEMS = 10;

export class SearchHistoryManager {
  static getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  static addSearchItem(location: string): void {
    if (typeof window === 'undefined' || !location.trim()) return;

    try {
      const currentHistory = this.getSearchHistory();
      
      // Remove existing entry if it exists (to avoid duplicates)
      const filteredHistory = currentHistory.filter(
        item => item.location.toLowerCase() !== location.toLowerCase()
      );

      // Add new item at the beginning
      const newHistory: SearchHistoryItem[] = [
        { location: location.trim(), timestamp: Date.now() },
        ...filteredHistory
      ].slice(0, MAX_HISTORY_ITEMS); // Keep only the most recent items

      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  static clearSearchHistory(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  static removeSearchItem(location: string): void {
    if (typeof window === 'undefined') return;

    try {
      const currentHistory = this.getSearchHistory();
      const updatedHistory = currentHistory.filter(
        item => item.location.toLowerCase() !== location.toLowerCase()
      );
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error removing search item:', error);
    }
  }
}