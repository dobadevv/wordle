import { api } from "@/lib/api";
import { GuessResponse } from "./types";

export async function guessDaily(guess: string, size = 5): Promise<GuessResponse[]> {
    const response = await api.get<GuessResponse[]>("/daily", {
        params: { guess, size },
    });
    return response.data;
}

export async function guessRandom(guess: string, size = 5, seed?: number): Promise<GuessResponse[]> {
    const response = await api.get<GuessResponse[]>("/random", {
        params: { guess, size, seed },
    });
    return response.data;
}

export async function guessCustomWord(word: string, guess: string): Promise<GuessResponse[]> {
    const response = await api.get<GuessResponse[]>(`/word/${encodeURIComponent(word)}`, {
        params: { guess },
    });
    return response.data;
}
