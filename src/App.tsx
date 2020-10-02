
import React, { useState } from 'react';
import './App.css';
import { Board, BoardTiles } from './Board';
import { Computer } from './computer/ComputerUtils';
import { BoardTileState } from './Tile';
import { Random as RandomComputer } from './computer/Random';
import { Smart as SmartComputer } from './computer/Smart';

const buildBoard = (
    blacks: Array<[number, number]> = [[0, 3], [0, 6], [3, 0], [3, 9]],
    whites: Array<[number, number]> = [[6, 0], [6, 9], [9, 3], [9, 6]],
    arrows: Array<[number, number]> = [],
) => {
    const rows: BoardTiles = [];

    Array.from(Array(10)).forEach((_, row) => {
        let cols: BoardTileState[] = [];
        Array.from(Array(10)).forEach(_ => cols.push(BoardTileState.FREE));
        rows.push(cols);
    });

    blacks.forEach(t => rows[t[0]][t[1]] = BoardTileState.BLACK_QUEEN);
    whites.forEach(t => rows[t[0]][t[1]] = BoardTileState.WHITE_QUEEN);
    arrows.forEach(t => rows[t[0]][t[1]] = BoardTileState.BLACK_ARROW);

    return rows;
}

enum ComputerSmartness {
    NONE = 'NONE',
    RANDOM = 'RANDOM',
    SMART = 'SMART'
};

const createAI = (smartness: ComputerSmartness, tiles: BoardTiles) => {
    switch (smartness) {
        case ComputerSmartness.NONE:   return null;
        case ComputerSmartness.RANDOM: return RandomComputer();
        case ComputerSmartness.SMART:  return SmartComputer();
    }
}

let tiles = buildBoard();

const defaultDelay = 1000;
const defaultWhiteComputer = ComputerSmartness.NONE;
const defaultBlackComputer = ComputerSmartness.SMART;

let whiteComputer: Computer | null = createAI(defaultWhiteComputer, tiles);
let blackComputer: Computer | null = createAI(defaultBlackComputer, tiles);;

interface ComputerSelectorProps {
    defaultValue: ComputerSmartness;
    label: string;
    onChange: (smartness: ComputerSmartness) => void;
}

const ComputerSelector: React.FC<ComputerSelectorProps> = (props: ComputerSelectorProps) => (
    <div>
        <span>{props.label}</span>
        <select defaultValue={props.defaultValue} onChange={ e => props.onChange(e.target.value as ComputerSmartness) }>
            <option>{ComputerSmartness.NONE}</option>
            <option>{ComputerSmartness.RANDOM}</option>
            <option>{ComputerSmartness.SMART}</option>
        </select>
    </div>
);

const App: React.FC = () => {
    const [delay, setDelay] = useState(defaultDelay);
    const [gameNumber, restart] = useState(1);

    const [whiteComputerStr, setWhiteComputer] = useState<ComputerSmartness>(defaultWhiteComputer);
    const [blackComputerStr, setBlackComputer] = useState<ComputerSmartness>(defaultBlackComputer);

    let delayInput: React.RefObject<HTMLInputElement> = React.createRef();

    const changeDelay = () => {
        if (delayInput.current) {
            if (delayInput.current.value === '' || isNaN(Number(delayInput.current.value))) {
                setDelay(defaultDelay);
            } else {
                setDelay(Number(delayInput.current.value));
            }
        }
    }

    const changeWhiteComputer = (smartness: ComputerSmartness) => {
        whiteComputer = createAI(smartness, tiles);
        setWhiteComputer(smartness);
    }

    const changeBlackComputer = (smartness: ComputerSmartness) => {
        blackComputer = createAI(smartness, tiles);
        setBlackComputer(smartness);
    }

    const restartGame = () => {
        console.clear();
        tiles = buildBoard();
        whiteComputer = createAI(whiteComputerStr, tiles);
        blackComputer = createAI(blackComputerStr, tiles)
        restart(gameNumber + 1);
    }

    return <>
        <h1>Game of the Amazons</h1>
        <div>
            <input type="text" placeholder="AI delay (default: 1000)" ref={delayInput} />
            <button onClick={changeDelay}>Change delay</button>
        </div>
        <ComputerSelector label='White AI' defaultValue={whiteComputerStr} onChange={ changeWhiteComputer } />
        <ComputerSelector label='Black AI' defaultValue={blackComputerStr} onChange={ changeBlackComputer } />
        <button onClick={restartGame}>Restart</button>
        <Board blackComputer={blackComputer} whiteComputer={whiteComputer} computerDelay={delay} key={gameNumber} />
    </>;
}

export { App, tiles };
