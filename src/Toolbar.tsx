
import React from 'react';
import { GameStep } from './Board';

interface ToolbarProps {
    gameStep: GameStep;
    onOptionsClick: () => void;
    onRestartClick: () => void;
}

const gameStepToClassname = {
    [GameStep.WHITE_TO_SELECT_QUEEN]: 'tileWhiteQueen',
    [GameStep.WHITE_TO_MOVE_QUEEN]:   'tileWhiteQueen',
    [GameStep.WHITE_TO_SHOOT_ARROW]:  'tileWhiteBow',
    [GameStep.BLACK_TO_SELECT_QUEEN]: 'tileBlackQueen',
    [GameStep.BLACK_TO_MOVE_QUEEN]:   'tileBlackQueen',
    [GameStep.BLACK_TO_SHOOT_ARROW]:  'tileBlackBow',
    [GameStep.WHITE_WON]:             'tileWhiteQueen',
    [GameStep.BLACK_WON]:             'tileBlackQueen',
}

const gameStepToString = {
    [GameStep.WHITE_TO_SELECT_QUEEN]: 'select',
    [GameStep.WHITE_TO_MOVE_QUEEN]:   'move',
    [GameStep.WHITE_TO_SHOOT_ARROW]:  'shoot',
    [GameStep.BLACK_TO_SELECT_QUEEN]: 'select',
    [GameStep.BLACK_TO_MOVE_QUEEN]:   'move',
    [GameStep.BLACK_TO_SHOOT_ARROW]:  'shoot',
    [GameStep.WHITE_WON]:             'won',
    [GameStep.BLACK_WON]:             'won',
}

export const Toolbar: React.FC<ToolbarProps> = (p) => {
    return <>
        <div className='toolbar'>
            <div className='gameStepContainer'>
                <div className={'gameStep ' + gameStepToClassname[p.gameStep]} />
                <span>{gameStepToString[p.gameStep]}</span>
            </div>
            <button className='toolbarButton' onClick={ p.onRestartClick }>Restart</button>
            <button className='toolbarButton' onClick={ p.onOptionsClick }>Options</button>
        </div>
    </>;
};
