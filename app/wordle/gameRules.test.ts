import { describe, expect, test } from "vitest";
import {
    MAX_ATTEMPTS,
    MAX_WORD_LENGTH,
    MIN_WORD_LENGTH,
    isValidWordLength,
    resolveGameStatus,
} from "./gameRules";
import { GuessResponse, Result } from "./types";

function rowOf(word: string, result: Result): GuessResponse[] {
    return [...word].map((letter, slot) => ({ slot, guess: letter, result }));
}

describe("isValidWordLength", () => {
    test("accepts a whole number inside the supported range", () => {
        expect(isValidWordLength(MIN_WORD_LENGTH)).toBe(true);
        expect(isValidWordLength(MAX_WORD_LENGTH)).toBe(true);
    });

    test("rejects a fractional length that would make the game unwinnable", () => {
        expect(isValidWordLength(5.5)).toBe(false);
    });

    test("rejects zero, which would otherwise win on the first submit", () => {
        expect(isValidWordLength(0)).toBe(false);
    });

    test("rejects a length large enough to hang the browser when rendered", () => {
        expect(isValidWordLength(1e21)).toBe(false);
        expect(isValidWordLength(MAX_WORD_LENGTH + 1)).toBe(false);
    });

    test("rejects values that are not finite numbers", () => {
        expect(isValidWordLength(Number.NaN)).toBe(false);
        expect(isValidWordLength(Number.POSITIVE_INFINITY)).toBe(false);
        expect(isValidWordLength(-5)).toBe(false);
    });
});

describe("resolveGameStatus", () => {
    test("wins when every slot in the row is correct", () => {
        const status = resolveGameStatus({
            latestRow: rowOf("hello", "correct"),
            attemptsUsed: 1,
            wordLength: 5,
        });

        expect(status).toBe("won");
    });

    test("keeps playing while attempts remain and the guess is wrong", () => {
        const status = resolveGameStatus({
            latestRow: rowOf("hello", "absent"),
            attemptsUsed: 1,
            wordLength: 5,
        });

        expect(status).toBe("playing");
    });

    test("loses once the attempt limit is spent without a correct guess", () => {
        const status = resolveGameStatus({
            latestRow: rowOf("hello", "absent"),
            attemptsUsed: MAX_ATTEMPTS,
            wordLength: 5,
        });

        expect(status).toBe("lose");
    });

    test("wins on the final attempt rather than losing", () => {
        const status = resolveGameStatus({
            latestRow: rowOf("hello", "correct"),
            attemptsUsed: MAX_ATTEMPTS,
            wordLength: 5,
        });

        expect(status).toBe("won");
    });

    test("does not win on an empty row", () => {
        const status = resolveGameStatus({
            latestRow: [],
            attemptsUsed: 1,
            wordLength: 0,
        });

        expect(status).not.toBe("won");
    });

    test("does not win when the row is shorter than the word", () => {
        const status = resolveGameStatus({
            latestRow: rowOf("he", "correct"),
            attemptsUsed: 1,
            wordLength: 5,
        });

        expect(status).not.toBe("won");
    });
});
