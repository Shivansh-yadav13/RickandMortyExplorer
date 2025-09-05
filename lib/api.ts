import type { Character, Episode, APIResponse } from '@/types';

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

const API_BASE_URL = 'https://rickandmortyapi.com/api';

export class RickAndMortyAPI {
  static async getAllCharacters(): Promise<Character[]> {
    const characters: Character[] = [];
    let nextUrl: string | null = `${API_BASE_URL}/character`;

    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data: APIResponse<Character> = await response.json();
      characters.push(...data.results);
      nextUrl = data.info.next;
    }

    return characters;
  }

  static async getCharactersByLocation(location: string): Promise<Character[]> {
    try {
      const allCharacters = await this.getAllCharacters();
      
      const filteredCharacters = allCharacters.filter(character =>
        character.location.name.toLowerCase().includes(location.toLowerCase())
      );

      return filteredCharacters;
    } catch (error) {
      console.error('Error fetching characters by location:', error);
      throw error;
    }
  }

  static async getCharacterById(id: number): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/character/${id}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  static async getEpisodeById(id: number): Promise<Episode> {
    const response = await fetch(`${API_BASE_URL}/episode/${id}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  static async getEpisodesByIds(ids: number[]): Promise<Episode[]> {
    if (ids.length === 0) return [];
    
    const idsString = ids.join(',');
    const response = await fetch(`${API_BASE_URL}/episode/${idsString}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  static extractEpisodeIds(episodeUrls: string[]): number[] {
    return episodeUrls.map(url => {
      const match = url.match(/\/episode\/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }).filter(id => id > 0);
  }

  static sortEpisodesByNumber(episodes: Episode[]): Episode[] {
    return episodes.sort((a, b) => {
      const aNum = parseInt(a.episode.match(/\d+/)?.[0] || '0', 10);
      const bNum = parseInt(b.episode.match(/\d+/)?.[0] || '0', 10);
      return aNum - bNum;
    });
  }

  static async getAllLocations(): Promise<Location[]> {
    const locations: Location[] = [];
    let nextUrl: string | null = `${API_BASE_URL}/location`;

    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data: APIResponse<Location> = await response.json();
      locations.push(...data.results);
      nextUrl = data.info.next;
    }

    return locations;
  }

  static async getLocationSuggestions(query: string): Promise<string[]> {
    try {
      const allLocations = await this.getAllLocations();
      
      if (!query.trim()) {
        // Return popular locations when no query
        return [
          'Earth (C-137)',
          'Citadel of Ricks', 
          'Earth (Replacement Dimension)',
          'Anatomy Park',
          'Interdimensional Cable',
          'Cronenberg Earth',
          'Gazorpazorp',
          'Birdperson\'s Planet'
        ];
      }

      // Filter locations that match the query
      const filtered = allLocations
        .filter(location => 
          location.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(location => location.name)
        .slice(0, 8); // Limit to 8 suggestions

      return filtered;
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return [];
    }
  }
}