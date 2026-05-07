export type GamePhase = 'LOBBY' | 'IN_PROGRESS' | 'FINISHED';

export type GameFlowState = 'LOBBY' | 'TURN_ACTIVE' | 'TURN_RESULT' | 'FINISHED';

export type PlayerId = string;

export type GameId = string;

export type Player = {
  id: PlayerId;
  username: string;
  avatar: number;
  totalScore?: number;
};

export type GameState = {
  id: GameId;
  createdAt: string;
  currentPlayerIndex: number | null;
  phase: GamePhase;
  pendingTurnResult: TurnResult | null;
  players: Player[];
  preferences: GamePreferences;
  settings: GameSettings;
  turns: Turn[];
  updatedAt: string;
};

export type Turn = {
  id: string;
  createdAt: string;
  gameId: GameId;
  playerId: PlayerId;
  score: number;
  turnIndex: number;
};

export type TurnResult = {
  isGameWinner: boolean;
  newTotal: number;
  nextPlayerId: PlayerId | null;
  playerId: PlayerId;
  previousTotal: number;
  score: number;
};

export type GameSummary = {
  isTargetReached: boolean;
  leadingPlayerId: PlayerId | null;
  players: Player[];
  winnerId: PlayerId | null;
};

export type DiceStyle = 'default' | 'medieval';
export type GameMode = 'dice' | 'manual';
export type ThemePreference = 'system' | 'light' | 'dark';
export type LocalePreference = 'en' | 'es';

export type GameSettings = {
  autoAdvanceTurns: boolean;
  diceStyle: DiceStyle;
  mode: GameMode;
  targetScore: number;
  showComboSuggestions: boolean;
};

export type GamePreferences = {
  locale: LocalePreference;
  motionEnabled: boolean;
  tableFeedback: boolean;
  theme: ThemePreference;
};
