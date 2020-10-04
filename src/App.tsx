
import React, { useState } from 'react';
import './App.css';
import {Board, BoardTiles, GameStep} from './Board';
import { Computer } from './computer/ComputerUtils';
import { BoardTileState } from './Tile';
import { Random as RandomComputer } from './computer/Random';
import { Smart as SmartComputer } from './computer/Smart';
import { Heading } from './Heading';
import { Toolbar } from './Toolbar';

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
}

const createAI = (smartness: ComputerSmartness) => {
    switch (smartness) {
        case ComputerSmartness.NONE:   return null;
        case ComputerSmartness.RANDOM: return RandomComputer();
        case ComputerSmartness.SMART:  return SmartComputer();
    }
}

let tiles = buildBoard();

const defaultDelay = 500;
const defaultWhiteComputer = ComputerSmartness.NONE;
const defaultBlackComputer = ComputerSmartness.SMART;

let whiteComputer: Computer | null = createAI(defaultWhiteComputer);
let blackComputer: Computer | null = createAI(defaultBlackComputer);

interface ComputerSelectorProps {
    defaultValue: ComputerSmartness;
    onChange: (smartness: ComputerSmartness) => void;
}

const ComputerSelector: React.FC<ComputerSelectorProps> = (props: ComputerSelectorProps) => (
    <select defaultValue={props.defaultValue} onChange={ e => props.onChange(e.target.value as ComputerSmartness) }>
        <option>{ComputerSmartness.NONE}</option>
        <option>{ComputerSmartness.RANDOM}</option>
        <option>{ComputerSmartness.SMART}</option>
    </select>
);

const App: React.FC = () => {
    const [delay, setDelay] = useState(defaultDelay);
    const [gameNumber, restart] = useState(1);
    const [gameStep, gameStepChange] = useState(GameStep.WHITE_TO_SELECT_QUEEN);

    const [whiteComputerStr, setWhiteComputer] = useState<ComputerSmartness>(defaultWhiteComputer);
    const [blackComputerStr, setBlackComputer] = useState<ComputerSmartness>(defaultBlackComputer);

    const changeWhiteComputer = (smartness: ComputerSmartness) => {
        whiteComputer = createAI(smartness);
        setWhiteComputer(smartness);
    }

    const changeBlackComputer = (smartness: ComputerSmartness) => {
        blackComputer = createAI(smartness);
        setBlackComputer(smartness);
    }

    const restartGame = () => {
        tiles = buildBoard();
        whiteComputer = createAI(whiteComputerStr);
        blackComputer = createAI(blackComputerStr)
        gameStepChange(GameStep.WHITE_TO_SELECT_QUEEN);
        restart(gameNumber + 1);
    }

    const fullScreen = () => {
        const bodyClasses = document.getElementsByTagName('body')[0].classList;
        bodyClasses[bodyClasses.contains('fullScreen') ? 'remove' : 'add']('fullScreen');
    }

    return <>
        <Heading
            whiteAI={<ComputerSelector defaultValue={whiteComputerStr} onChange={changeWhiteComputer}/>}
            blackAI={<ComputerSelector defaultValue={blackComputerStr} onChange={changeBlackComputer}/>}
            defaultDelay={defaultDelay}
            onDelayChange={setDelay}
        />

        <div className='game'>
            <Toolbar onFullScreenClick={fullScreen} onRestartClick={restartGame} gameStep={gameStep}/>
            <Board
                blackComputer={blackComputer}
                whiteComputer={whiteComputer}
                computerDelay={delay}
                gameStep={gameStep}
                onGameStepChange={gameStepChange}
                key={gameNumber}
            />
        </div>
    </>;
}

export { App, tiles };
