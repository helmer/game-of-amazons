
import React, { useState } from 'react';
import './App.css';
import { Board, GameStep } from './Board';
import { createAI, Computer, ComputerSmartness } from './computer/ComputerUtils';
import { Toolbar } from './Toolbar';
import {Options} from "./Options";

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
    const [showOptionsModal, toggleOptionsModal] = useState(true);

    const [whiteComputerStr, setWhiteComputer] = useState<ComputerSmartness>(defaultWhiteComputer);
    const [blackComputerStr, setBlackComputer] = useState<ComputerSmartness>(defaultBlackComputer);

    const changeWhiteComputer = (smartness: ComputerSmartness) => {
        whiteComputer = createAI(smartness);
        setWhiteComputer(smartness);
    };

    const changeBlackComputer = (smartness: ComputerSmartness) => {
        blackComputer = createAI(smartness);
        setBlackComputer(smartness);
    };

    const changeComputerDelay = (delay: number) => {
        setDelay(delay);
    };

    const restartGame = () => {
        whiteComputer = createAI(whiteComputerStr);
        blackComputer = createAI(blackComputerStr)
        gameStepChange(defaultGameStep);
        restart(gameNumber + 1);
    }

    return <>
        <div className='heading'>
            <h2><a href='https://en.wikipedia.org/wiki/Game_of_the_Amazons' target='_blank' rel='noopener noreferrer'>The Game of the Amazons</a></h2>
        </div>

        <div style={{ display: "inline-block", margin: '0 auto' }}>
            <Board
                blackComputer={blackComputer}
                whiteComputer={whiteComputer}
                computerDelay={delay}
                gameStep={gameStep}
                onGameStepChange={gameStepChange}
                key={gameNumber}
            />

            <Toolbar
                gameStep={gameStep}
                onOptionsClick={() => toggleOptionsModal(!showOptionsModal)}
                onRestartClick={restartGame}
            />
        </div>

        { showOptionsModal &&
        <Options
           defaultWhiteAI={whiteComputerStr} onChangeWhiteAI={changeWhiteComputer}
           defaultBlackAI={blackComputerStr} onChangeBlackAI={changeBlackComputer}
           defaultDelay={defaultDelay}
           onDelayChange={changeComputerDelay}
           onClose={ () => toggleOptionsModal(false) }/> }
    </>;
}

// Responsive design JS hacks
((window as Window).onresize = () => {
    document.getElementsByTagName('body')[0].classList[window.innerWidth + 165 > window.innerHeight ? 'add' : 'remove']('landscape');
})();

export { App };
