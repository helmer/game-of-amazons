
import React from 'react';

enum BoardTileState {
    FREE = 'FREE',
    WHITE_QUEEN = 'WHITE_QUEEN',
    BLACK_QUEEN = 'BLACK_QUEEN',
    WHITE_BOW = 'WHITE_BOW',
    BLACK_BOW = 'BLACK_BOW',
    WHITE_ARROW = 'WHITE_ARROW',
    BLACK_ARROW = 'BLACK_ARROW',
}

export interface TileCoordinate {
    x: number;
    y: number;
}

interface TileProps {
    isEven: boolean;
    isClickable: boolean;
    onClick: () => void;
    selected: boolean;
    state: BoardTileState;
}

const stateToClassname = {
    [BoardTileState.FREE]:        'tileFree',
    [BoardTileState.WHITE_QUEEN]: 'tileWhiteQueen',
    [BoardTileState.WHITE_BOW]:   'tileWhiteBow',
    [BoardTileState.WHITE_ARROW]: 'tileWhiteArrow',
    [BoardTileState.BLACK_QUEEN]: 'tileBlackQueen',
    [BoardTileState.BLACK_BOW]:   'tileBlackBow',
    [BoardTileState.BLACK_ARROW]: 'tileBlackArrow',
}

function getClassNames(props: TileProps): string {
    let classNames = ['tile', stateToClassname[props.state], props.isEven ? 'tileEven' : 'tileOdd'];

    if (props.isClickable) {
        classNames.push('tileValid');
    }

    if (props.selected) {
        classNames.push('tileSelected');
    }

    return classNames.join(' ');
}

const Tile: React.FC<TileProps> = (props) => (
    <div className={getClassNames(props)} onClick={ () => props.isClickable && props.onClick()} />
);

export { Tile, BoardTileState };
