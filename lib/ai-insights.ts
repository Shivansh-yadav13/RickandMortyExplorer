import type { Character, Episode, CharacterInsights } from '@/types';

export class AIInsightsGenerator {
  private static readonly MAIN_CHARACTERS = [
    'Rick Sanchez', 'Morty Smith', 'Beth Smith', 'Jerry Smith', 'Summer Smith'
  ];

  private static readonly RECURRING_CHARACTERS = [
    'Birdperson', 'Mr. Meeseeks', 'Squanch', 'Unity', 'Evil Morty', 'Mr. Poopybutthole',
    'Scary Terry', 'Abradolf Lincler', 'Tammy Guetermann', 'Pickle Rick'
  ];

  private static readonly CHARACTER_ROLES: Record<string, string> = {
    'Rick Sanchez': 'Mad scientist protagonist and grandfather',
    'Morty Smith': 'Reluctant sidekick and grandson',
    'Beth Smith': 'Horse surgeon and conflicted daughter/mother',
    'Jerry Smith': 'Insecure husband and father',
    'Summer Smith': 'Teenage daughter seeking acceptance',
    'Birdperson': "Rick's best friend and warrior",
    'Mr. Meeseeks': 'Helpful but unstable assistance entity',
    'Unity': "Rick's hive-mind ex-girlfriend",
    'Evil Morty': 'Malicious alternate version of Morty',
    'Mr. Poopybutthole': 'Mysterious family friend',
    'Scary Terry': 'Dream-invading monster',
    'Squanch': "Rick's alien friend",
    'Tammy Guetermann': 'Galactic Federation agent and traitor'
  };

  private static readonly NOTABLE_EVENTS: Record<string, string[]> = {
    'Rick Sanchez': [
      'Turned himself into a pickle to avoid family therapy',
      'Started the Citadel of Ricks and later destroyed it'
    ],
    'Morty Smith': [
      'Cronenberged his original dimension',
      'Had to bury his own corpse from another dimension'
    ],
    'Beth Smith': [
      'Discovered she might be a clone',
      'Nearly divorced Jerry multiple times'
    ],
    'Jerry Smith': [
      'Got divorced and remarried to Beth',
      'Briefly worked at an unemployment agency'
    ],
    'Summer Smith': [
      'Learned she was an unwanted pregnancy',
      'Helped Rick escape from prison'
    ],
    'Birdperson': [
      'Married Tammy who was a Federation agent',
      'Was resurrected as Phoenixperson'
    ],
    'Unity': [
      'Controlled an entire planet',
      'Broke up with Rick to protect themselves'
    ],
    'Evil Morty': [
      'Controlled the Citadel of Ricks',
      'Escaped the Central Finite Curve'
    ]
  };

  static generateInsights(character: Character, episodes: Episode[]): CharacterInsights {
    const episodeCount = episodes.length;
    const characterName = character.name;
    
    // Determine arc type based on episode appearances
    let arcType: CharacterInsights['arcType'];
    if (this.MAIN_CHARACTERS.includes(characterName)) {
      arcType = 'Main Character';
    } else if (this.RECURRING_CHARACTERS.includes(characterName) || episodeCount >= 3) {
      arcType = 'Recurring Character';
    } else if (episodeCount >= 1) {
      arcType = 'Supporting Character';
    } else {
      arcType = 'Cameo';
    }

    // Get role description
    const role = this.CHARACTER_ROLES[characterName] || this.generateGenericRole(character);

    // Get notable events
    const notableEvents = this.NOTABLE_EVENTS[characterName] || this.generateGenericEvents(character, episodes);

    return {
      arcType,
      role,
      notableEvents
    };
  }

  private static generateGenericRole(character: Character): string {
    const { species, status, gender } = character;
    
    if (species === 'Human') {
      if (status === 'Dead') {
        return 'Deceased human character';
      }
      return gender === 'Male' ? 'Human male character' : gender === 'Female' ? 'Human female character' : 'Human character';
    }
    
    if (species === 'Alien') {
      return `${species} being from the multiverse`;
    }
    
    if (species.includes('Robot') || species.includes('android')) {
      return 'Artificial intelligence entity';
    }
    
    return `${species} character in the Rick and Morty universe`;
  }

  private static generateGenericEvents(character: Character, episodes: Episode[]): string[] {
    const events: string[] = [];
    const episodeCount = episodes.length;
    
    if (episodeCount > 0) {
      const firstEpisode = episodes[0];
      events.push(`First appeared in ${firstEpisode.name} (${firstEpisode.episode})`);
    }
    
    if (episodeCount > 1) {
      const lastEpisode = episodes[episodes.length - 1];
      events.push(`Last appeared in ${lastEpisode.name} (${lastEpisode.episode})`);
    } else if (episodeCount === 1) {
      events.push('Single episode appearance');
    }
    
    if (character.status === 'Dead') {
      events.push('Character died during the series');
    }
    
    if (character.location.name !== 'unknown' && character.location.name !== '') {
      events.push(`Currently located at ${character.location.name}`);
    }
    
    return events.length > 0 ? events : ['Minor character with limited screen time'];
  }
}