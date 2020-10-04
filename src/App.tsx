
import React, { useState } from 'react';
import './App.css';
import { Board, GameStep } from './Board';
import { createAI, Computer, ComputerSmartness } from './computer/ComputerUtils';
import { Configuration } from './Configuration';
import { Toolbar } from './Toolbar';
import { References } from "./References";

const defaultDelay = 500;
const defaultWhiteComputer = ComputerSmartness.NONE;
const defaultBlackComputer = ComputerSmartness.SMART;
const defaultGameStep      = GameStep.WHITE_TO_SELECT_QUEEN;

let whiteComputer: Computer | null = createAI(defaultWhiteComputer);
let blackComputer: Computer | null = createAI(defaultBlackComputer);

const App: React.FC = () => {
    const [delay, setDelay] = useState(defaultDelay);
    const [gameNumber, restart] = useState(1);
    const [gameStep, gameStepChange] = useState(defaultGameStep);

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
        whiteComputer = createAI(whiteComputerStr);
        blackComputer = createAI(blackComputerStr)
        gameStepChange(defaultGameStep);
        restart(gameNumber + 1);
    }

    return <>
        <h2>Game of the Amazons</h2>

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
                defaultWhiteAI={whiteComputerStr} onChangeWhiteAI={changeWhiteComputer}
                defaultBlackAI={blackComputerStr} onChangeBlackAI={changeBlackComputer}
                defaultDelay={defaultDelay}
                onDelayChange={setDelay}
            />
            <References />
        </div>
    </>;
}

((window as any).onresize = () => {
    document.getElementsByTagName('body')[0].classList[window.innerWidth > window.innerHeight ? 'add' : 'remove']('landscape');
})();

export { App };
