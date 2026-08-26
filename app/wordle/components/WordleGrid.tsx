import { CSSProperties } from "react";
import { MAX_ATTEMPTS } from "../gameRules";
import { GuessResponse, Result } from "../types";

type Props = {
    wordLength: number;
    rows: Array<Array<GuessResponse>>;
}

const TILE_GAP_PX = 8;
const MAX_TILE_SIZE_PX = 56;
const BOARD_MAX_WIDTH_PX = 420;
const REVEAL_STAGGER_MS = 90;

const RESULT_STYLES: Record<Result, CSSProperties> = {
    correct: { backgroundColor: "#4ade80", borderColor: "#4ade80", color: "#08240f" },
    present: { backgroundColor: "#fbbf24", borderColor: "#fbbf24", color: "#2e1c00" },
    absent: { backgroundColor: "#3b3355", borderColor: "#3b3355", color: "#b9abd8" },
};

const EMPTY_TILE_STYLE: CSSProperties = {
    backgroundColor: "rgba(139, 92, 246, 0.06)",
    borderColor: "rgba(139, 92, 246, 0.28)",
};

function range(size: number) {
    return Array.from({ length: size });
}

/** Shrinks the tiles so even a ten-letter board fits the viewport without scrolling. */
function toTileSize(wordLength: number): string {
    const totalGap = TILE_GAP_PX * (wordLength - 1);
    return `min(${MAX_TILE_SIZE_PX}px, calc((min(90vw, ${BOARD_MAX_WIDTH_PX}px) - ${totalGap}px) / ${wordLength}))`;
}

export function WordleGrid({ wordLength, rows }: Props) {
    const tileSize = toTileSize(wordLength);

    return <div
        className="grid justify-center"
        style={{ gridTemplateColumns: `repeat(${wordLength}, ${tileSize})`, gap: TILE_GAP_PX }}
    >
        {range(MAX_ATTEMPTS).map((_, rowIndex) => range(wordLength).map((_, slot) => {
            const letter = rows[rowIndex]?.find((entry) => entry.slot === slot);

            return (
                <div
                    /* The revealed flag is part of the key so a filled tile remounts and replays its flip. */
                    key={`${rowIndex}:${slot}:${letter ? 'revealed' : 'empty'}`}
                    className={letter ? "wordle-tile wordle-tile--revealed" : "wordle-tile"}
                    style={{
                        height: tileSize,
                        fontSize: `calc(${tileSize} * 0.42)`,
                        animationDelay: letter ? `${slot * REVEAL_STAGGER_MS}ms` : undefined,
                        ...(letter ? RESULT_STYLES[letter.result] : EMPTY_TILE_STYLE),
                    }}
                >
                    {letter?.guess.toUpperCase()}
                </div>
            );
        }))}
    </div>
}
