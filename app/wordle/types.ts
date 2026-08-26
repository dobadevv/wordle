export type Result = 'absent' | 'present' | 'correct';

export type Mode = 'daily' | 'random' | 'custom'

export type GameStatus = 'playing' | 'won' | 'lose';

export type GuessResponse = {
    slot: number;
    guess: string;
    result: Result;
}
