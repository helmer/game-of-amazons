
import React from 'react';
import { GameStep } from './Board';

interface ToolbarProps {
    gameStep: GameStep;
    onRestartClick: () => void;
    onFullScreenClick: () => void;
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

const RestartButton: React.FC<{ onClick: () => void}> = p => <button className='toolbarButton' onClick={p.onClick}>Restart</button>;
const FullScreenButton: React.FC<{ onClick: () => void}> = p => <button className='toolbarButton' onClick={p.onClick}>Full screen</button>;
const GameStepComponent: React.FC<{ step: GameStep }> = p => <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className={ 'gameStep ' + gameStepToClassname[p.step] }></div>
    { [GameStep.WHITE_WON, GameStep.BLACK_WON].includes(p.step)
        ? <span style={{ color: 'gray '}}>has won!</span>
        : <span style={{ color: 'gray '}}>⬅ turn</span>
    }

</div>;

const Toolbar: React.FC<ToolbarProps> = (props) => <>
    <div className='toolbar'>
        <RestartButton onClick={props.onRestartClick}/>
        <FullScreenButton onClick={props.onFullScreenClick}/>
        <GameStepComponent step={props.gameStep}/>
    </div>
</>;

export { Toolbar };
