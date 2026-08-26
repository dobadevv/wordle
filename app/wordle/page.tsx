'use client';

import { Alert, Button, Card, Flex, Input, InputNumber, Select } from "antd";
import { WordleGrid } from "./components/WordleGrid";
import { useRef, useState } from "react";
import { GameStatus, GuessResponse, Mode } from "./types";
import { guessCustomWord, guessDaily, guessRandom } from "./api";
import { MAX_ATTEMPTS, MAX_WORD_LENGTH, MIN_WORD_LENGTH, isValidWordLength, resolveGameStatus } from "./gameRules";
import { toErrorMessage } from "./errorMessage";

const DEFAULT_WORD_LENGTH = 5;

const modeOptions: Array<{ value: Mode; label: string }> = [
    { value: 'daily', label: "Daily mode" },
    { value: 'random', label: "Random mode" },
    { value: 'custom', label: "Custom mode" },
]

export default function WordlePage() {
    const [mode, setMode] = useState<Mode>('daily');
    const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
    const [wordLength, setWordLength] = useState<number>(DEFAULT_WORD_LENGTH);
    const [pendingWordLength, setPendingWordLength] = useState<number | null>(DEFAULT_WORD_LENGTH);
    const [rows, setRows] = useState<Array<Array<GuessResponse>>>([]);
    const [word, setWord] = useState<string>('');
    const [seed, setSeed] = useState<number | null>(1);
    const [guess, setGuess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    /** Bumped whenever the board is discarded, so a slower in-flight guess cannot repopulate it. */
    const currentAttemptId = useRef(0);

    const resetBoard = () => {
        currentAttemptId.current += 1;
        setRows([]);
        setGuess('');
        setError('');
        setGameStatus('playing');
        setLoading(false);
    }

    const startNewGame = () => {
        if (pendingWordLength === null || !isValidWordLength(pendingWordLength)) {
            setError(`Word length must be a whole number between ${MIN_WORD_LENGTH} and ${MAX_WORD_LENGTH}`);
            return;
        }
        setWordLength(pendingWordLength);
        resetBoard();
    }

    const findGuessError = (): string | null => {
        if (guess.length !== wordLength) {
            return `Guess must be ${wordLength} letters long`;
        }
        if (mode === 'custom' && word.length !== wordLength) {
            return `Custom word must be ${wordLength} letters long`;
        }
        return null;
    }

    const sendGuess = (): Promise<GuessResponse[]> => {
        switch (mode) {
            case 'daily':
                return guessDaily(guess, wordLength);
            case 'random':
                return guessRandom(guess, wordLength, seed ?? undefined);
            case 'custom':
                return guessCustomWord(word, guess);
        }
    }

    const handleSubmit = () => {
        const guessError = findGuessError();
        if (guessError) {
            setError(guessError);
            return;
        }

        setError('');
        setLoading(true);

        const attemptId = ++currentAttemptId.current;
        sendGuess()
            .then((latestRow) => {
                if (attemptId !== currentAttemptId.current) {
                    return;
                }
                const nextRows = [...rows, latestRow];
                setRows(nextRows);
                setGuess('');
                setLoading(false);
                setGameStatus(resolveGameStatus({
                    latestRow,
                    attemptsUsed: nextRows.length,
                    wordLength,
                }));
            })
            .catch((err) => {
                if (attemptId !== currentAttemptId.current) {
                    return;
                }
                setError(toErrorMessage(err));
                setLoading(false);
            });
    }

    const handleChangeMode = (nextMode: Mode) => {
        setMode(nextMode);
        resetBoard();
    }

    const handleChangeSeed = (nextSeed: number | null) => {
        setSeed(nextSeed);
        resetBoard();
    }

    const handleChangeWord = (nextWord: string) => {
        setWord(nextWord);
        resetBoard();
    }

    const isGameOver = gameStatus !== 'playing';
    const attemptsLeft = MAX_ATTEMPTS - rows.length;

    return <Flex className="min-h-screen p-4" justify="center" align="center">
        <Card className="wordle-panel w-full max-w-[30rem]" variant="borderless">
            <Flex vertical gap="large">
                <header className="text-center">
                    <h1 className="wordle-wordmark">WORDLE</h1>
                    <p className="wordle-subtitle">Six tries. One hidden word.</p>
                </header>

                <Flex vertical gap="small">
                    <Select options={modeOptions} value={mode} onChange={handleChangeMode} disabled={loading} />
                    {mode === 'random' && <InputNumber className="!w-full" value={seed} onChange={handleChangeSeed} precision={0} disabled={loading} placeholder="Type a seed" />}
                    {mode === 'custom' && <Input value={word} onChange={(e) => handleChangeWord(e.target.value)} maxLength={wordLength} disabled={loading} placeholder="Type a custom word" />}
                    <Flex gap="small">
                        <InputNumber className="!w-full" value={pendingWordLength} onChange={setPendingWordLength} min={MIN_WORD_LENGTH} max={MAX_WORD_LENGTH} precision={0} disabled={loading} placeholder="Input the word length" />
                        <Button onClick={startNewGame} disabled={loading}>New game</Button>
                    </Flex>
                </Flex>

                <Flex vertical gap="middle" align="center">
                    <WordleGrid wordLength={wordLength} rows={rows} />
                    {!isGameOver && <span className="wordle-attempts">{attemptsLeft} of {MAX_ATTEMPTS} tries left</span>}
                </Flex>

                <Flex gap="small">
                    <Input className="wordle-guess-input" value={guess} onChange={(e) => setGuess(e.target.value)} onPressEnter={handleSubmit} placeholder="Input your guess" maxLength={wordLength} disabled={isGameOver || loading} />
                    <Button type="primary" onClick={handleSubmit} loading={loading} disabled={isGameOver}>Submit</Button>
                </Flex>

                {
                    isGameOver && (gameStatus === 'won'
                        ? <Alert type="success" showIcon title="You won" description={`Solved in ${rows.length} of ${MAX_ATTEMPTS} tries.`} />
                        : <Alert type="error" showIcon title="You lose" description="Out of tries — start a new game to play again." />
                    )
                }
                {
                    error && <Alert type="error" showIcon title={error} />
                }
            </Flex>
        </Card>
    </Flex>
}
