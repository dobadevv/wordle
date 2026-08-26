import { GameStatus, GuessResponse } from "./types";

export const MIN_WORD_LENGTH = 3;
export const MAX_WORD_LENGTH = 10;
export const MAX_ATTEMPTS = 6;

export function isValidWordLength(value: number): boolean {
    return Number.isInteger(value) && value >= MIN_WORD_LENGTH && value <= MAX_WORD_LENGTH;
}

type GameStatusInput = {
    latestRow: GuessResponse[];
    attemptsUsed: number;
    wordLength: number;
};

function isWinningRow(row: GuessResponse[], wordLength: number): boolean {
    if (row.length === 0 || row.length !== wordLength) {
        return false;
    }
    return row.every(({ result }) => result === 'correct');
}

export function resolveGameStatus({ latestRow, attemptsUsed, wordLength }: GameStatusInput): GameStatus {
    if (isWinningRow(latestRow, wordLength)) {
        return 'won';
    }
    return attemptsUsed >= MAX_ATTEMPTS ? 'lose' : 'playing';
}
