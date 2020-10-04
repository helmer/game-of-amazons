
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
    onClick: (c: TileCoordinate) => void;
    coordinates: TileCoordinate;
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

let dropTarget: HTMLDivElement | undefined;

const Tile: React.FC<TileProps> = (props) => (
    <div
        className={ getClassNames(props) }
        data-x={ props.coordinates.x }
        data-y={ props.coordinates.y }
        onClick={ () => props.isClickable && props.onClick(props.coordinates) }

        draggable={ props.isClickable }
        onDragStart={ props.isClickable ? (e) => {
            e.dataTransfer.effectAllowed = 'move';
            props.onClick(props.coordinates);
        } : undefined }
        onDragEnter={ (e) => {
            dropTarget = e.currentTarget.classList.contains('tileValid') ? e.currentTarget : undefined;
        }}
        onDragOver={ (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = dropTarget ? 'move' : 'none';
        }}
        onDragEnd={ () => {
            if (dropTarget) {
                props.onClick({ x: Number(dropTarget.dataset.x), y: Number(dropTarget.dataset.y) });
            }
            dropTarget = undefined;
        } }
    />
);

export { Tile, BoardTileState };
