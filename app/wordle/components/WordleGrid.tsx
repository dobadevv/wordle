import { Card, Col, Flex, Row } from "antd";
import { CSSProperties } from "react";
import { MAX_ATTEMPTS } from "../gameRules";
import { GuessResponse, Result } from "../types";

type Props = {
    wordLength: number;
    rows: Array<Array<GuessResponse>>;
}

const CELL_SIZE = 56;
const CELL_GAP = 8;

const RESULT_STYLES: Record<Result, CSSProperties> = {
    correct: { backgroundColor: "#6aaa64", borderColor: "#6aaa64", color: "#ffffff" },
    present: { backgroundColor: "#c9b458", borderColor: "#c9b458", color: "#ffffff" },
    absent: { backgroundColor: "#787c7e", borderColor: "#787c7e", color: "#ffffff" },
};

function range(size: number) {
    return Array.from({ length: size });
}

export function WordleGrid({ wordLength, rows }: Props) {
    return <Flex vertical gap={CELL_GAP}>
        {range(MAX_ATTEMPTS).map((_, rowIndex) => (
            <Row key={rowIndex} gutter={[CELL_GAP, CELL_GAP]} wrap={false}>
                {range(wordLength).map((_, slot) => {
                    const letter = rows[rowIndex]?.find((entry) => entry.slot === slot);

                    return (
                        <Col key={slot}>
                            <Card
                                size="small"
                                style={{ width: CELL_SIZE, height: CELL_SIZE, ...(letter ? RESULT_STYLES[letter.result] : undefined) }}
                                styles={{ body: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 0, fontWeight: "bold", fontSize: "1.25rem" } }}
                            >
                                {letter?.guess.toUpperCase()}
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        ))}
    </Flex>
}
