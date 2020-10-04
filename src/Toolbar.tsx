
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
    [GameStep.WHITE_TO_SELECT_QUEEN]: 'select',
    [GameStep.WHITE_TO_MOVE_QUEEN]:   'move',
    [GameStep.WHITE_TO_SHOOT_ARROW]:  'shoot',
    [GameStep.BLACK_TO_SELECT_QUEEN]: 'select',
    [GameStep.BLACK_TO_MOVE_QUEEN]:   'move',
    [GameStep.BLACK_TO_SHOOT_ARROW]:  'shoot',
    [GameStep.WHITE_WON]:             'won',
    [GameStep.BLACK_WON]:             'won',
}

const Toolbar: React.FC<ToolbarProps> = (props) => <>
    <div className='gameStepContainer'>
        <div className='gameStepWrap'>
            <div className={ 'gameStep ' + gameStepToClassname[props.gameStep] }> </div>
            <span>{ gameStepToString[props.gameStep] }</span>
        </div>
        <button className='toolbarButton' onClick={props.onRestartClick}>Restart</button>
    </div>
</>;

export { Toolbar };
