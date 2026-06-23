export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface Team {
  id: string; // ISO 2-letter country code or generic ID
  nameEn: string;
  nameAr: string;
  flagCode: string; // Used for flag CDN or emoji
  emoji: string;    // Fallback emoji flag
}

export interface Group {
  id: string;     // e.g., 'A', 'B'
  nameEn: string; // e.g., 'Group A'
  nameAr: string; // e.g., 'المجموعة أ'
  teams: Team[];
}

export interface MatchPrediction {
  matchId: string;
  score1?: number;
  score2?: number;
  winnerId?: string; // Team ID of winner (especially for knockouts)
}

// Result of a match, either historical or predicted
export interface MatchResult {
  id: string; // e.g., 'R16_1'
  stage: 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  winner?: Team;
  isFakePlaceholder?: boolean;
  labelEn: string;
  labelAr: string;
  stadiumEn?: string;
  stadiumAr?: string;
  kickoffTime?: string;
}

export interface HistoricalKnockoutMatch {
  matchId: string;
  stage: 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';
  team1Id: string;
  team2Id: string;
  score1: number;
  score2: number;
  winnerId: string;
  penalties?: string; // e.g., "4-3"
  labelEn: string;
  labelAr: string;
}

export interface GroupResultForStanding {
  team: Team;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
}

export interface WorldCupEdition {
  year: string;
  hostEn: string;
  hostAr: string;
  winnerId: string; // Actual historical champion
  runnerUpId: string;
  teamsCount: number;
  systemType: '48-teams' | '32-teams' | '24-teams' | '16-teams' | '13-teams';
  groups: Group[];
  historicalWinnerEn: string;
  historicalWinnerAr: string;
  // Pre-determined historical group stage final standings (list of Team IDs in order, e.g., Group A: [qa, ec, sen, ned])
  historicalStandings: { [groupId: string]: string[] };
  // Historical knockouts data
  historicalKnockouts: HistoricalKnockoutMatch[];
}

export interface SavedPrediction {
  year: string;
  standings: { [groupId: string]: string[] }; // Group standings in order of array (0 is 1st, 1 is 2nd...)
  bestThirderKeys?: string[]; // IDs of selected best 3rd placed teams (for 2026 / 1994 / 1990 / 1986)
  knockoutWinners: { [matchId: string]: string }; // Map of matchId -> winning team id
  customScores?: { [matchId: string]: { score1: number; score2: number } };
  predictorName?: string;
  predictorSignature?: string;
}
