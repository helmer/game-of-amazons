
import React from 'react';
import { GameStep } from './Board';

interface ToolbarProps {
    gameStep: GameStep;
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
    [GameStep.WHITE_TO_SELECT_QUEEN]: 'white to select queen',
    [GameStep.WHITE_TO_MOVE_QUEEN]:   'white to move queen',
    [GameStep.WHITE_TO_SHOOT_ARROW]:  'white to shoot arrow',
    [GameStep.BLACK_TO_SELECT_QUEEN]: 'black to select queen',
    [GameStep.BLACK_TO_MOVE_QUEEN]:   'black to move queen',
    [GameStep.BLACK_TO_SHOOT_ARROW]:  'black to shoot arrow',
    [GameStep.WHITE_WON]:             'white won',
    [GameStep.BLACK_WON]:             'black won',
}

const Toolbar: React.FC<ToolbarProps> = (props) => <>
    <div className='gameStepContainer'>
        <div style={{ flexGrow: 1 }}>
            <div className={ 'gameStep ' + gameStepToClassname[props.gameStep] }> </div>
            <span>⬅</span>
            <span>{ gameStepToString[props.gameStep] }</span>
        </div>
        <button className='toolbarButton' onClick={props.onRestartClick}>Restart</button>
    </div>
</>;

export { Toolbar };
