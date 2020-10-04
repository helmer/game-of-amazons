
import React, {FormEvent, useState} from 'react';
import './App.css';
import {Board, BoardTiles, GameStep} from './Board';
import { Computer } from './computer/ComputerUtils';
import { BoardTileState } from './Tile';
import { Random as RandomComputer } from './computer/Random';
import { Smart as SmartComputer } from './computer/Smart';
import { Configuration } from './Configuration';
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
    pfx: string;
}

const ComputerSelector: React.FC<ComputerSelectorProps> = (props: ComputerSelectorProps) => {
    const [selected, setSelected] = useState(props.defaultValue);

    const updateSelected = (e: FormEvent<HTMLDivElement>) => {
        if (e.target) {
            const smartness = (e.target as HTMLInputElement).value as ComputerSmartness;
            props.onChange(smartness);
            setSelected(smartness);
        }
    }

    const InputWithLabel: React.FC<{ name: string, value: string, selected: boolean, pfx: string }> = (p) => <>
        <input type="radio" id={ p.pfx + p.value } value={ p.value } defaultChecked={ p.selected } />
        <label htmlFor={ p.pfx + p.value }>{ p.name }</label>
    </>;

    return (
        <div className='computerSelector'onChange={ updateSelected }>
            <InputWithLabel name='None'   value={ ComputerSmartness.NONE   } selected={ ComputerSmartness.NONE   === selected } pfx={ props.pfx } />
            <InputWithLabel name='Random' value={ ComputerSmartness.RANDOM } selected={ ComputerSmartness.RANDOM === selected } pfx={ props.pfx } />
            <InputWithLabel name='Smart'  value={ ComputerSmartness.SMART  } selected={ ComputerSmartness.SMART  === selected } pfx={ props.pfx } />
        </div>
    );
};

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

    return <>
        <h2>
            Game of the Amazons
            <sup><a href="#wiki">[1]</a></sup>
        </h2>

        <Board
            blackComputer={blackComputer}
            whiteComputer={whiteComputer}
            computerDelay={delay}
            gameStep={gameStep}
            onGameStepChange={gameStepChange}
            key={gameNumber}
        />

        <div className='buttonsAndLinks'>
            <Toolbar onRestartClick={restartGame} gameStep={gameStep}/>
            <Configuration
                whiteAI={<ComputerSelector pfx='white' defaultValue={whiteComputerStr} onChange={changeWhiteComputer}/>}
                blackAI={<ComputerSelector pfx='black' defaultValue={blackComputerStr} onChange={changeBlackComputer}/>}
                defaultDelay={defaultDelay}
                onDelayChange={setDelay}
            />
            <div className='references'>
                <h3>References</h3>
                <div id='wiki'>1. <a href='https://en.wikipedia.org/wiki/Game_of_the_Amazon' target='_blank' rel='noopener noreferrer'>Game of the Amazons - Wikipedia</a></div>
            </div>
        </div>
    </>;
}

((window as any).onresize = () => {
    document.getElementsByTagName('body')[0].classList[window.innerWidth > window.innerHeight ? 'add' : 'remove']('landscape');
})();

export { App, tiles };
