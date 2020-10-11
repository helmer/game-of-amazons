
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
    [BoardTileState.FREE]:        '',
    [BoardTileState.WHITE_QUEEN]: 'tileWhiteQueen',
    [BoardTileState.WHITE_BOW]:   'tileWhiteBow',
    [BoardTileState.WHITE_ARROW]: 'tileWhiteArrow',
    [BoardTileState.BLACK_QUEEN]: 'tileBlackQueen',
    [BoardTileState.BLACK_BOW]:   'tileBlackBow',
    [BoardTileState.BLACK_ARROW]: 'tileBlackArrow',
}

function getClassNames(props: TileProps): string {
    let classNames = ['tile', stateToClassname[props.state], props.isEven ? 'tileBlack' : 'tileWhite'];

    if (props.isClickable) {
        classNames.push('tileValid');
    }

    if (props.selected) {
        classNames.push('tileSelected');
    }

    return classNames.join(' ');
}

let dragTarget: HTMLDivElement | undefined;
let touchTarget: TouchEvent | undefined;

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
            dragTarget = e.currentTarget;
        }}
        onDragOver={ (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = dragTarget ? 'move' : 'none';
        }}
        onDragEnd={ () => {
            if (dragTarget && dragTarget.classList.contains('tileValid')) {
                props.onClick({ x: Number(dragTarget.dataset.x), y: Number(dragTarget.dataset.y) });
            }
            dragTarget = undefined;
        } }

        onTouchStart={ props.isClickable ? () => {
            touchTarget = undefined;
            props.onClick(props.coordinates);
        } : undefined }
        onTouchMove={ (e) => {
            touchTarget = e as unknown as TouchEvent;
        }}
        onTouchEnd={ () => {
            if (!touchTarget) {
                return;
            }
            const targetTile = document.elementFromPoint(touchTarget.changedTouches[0].pageX, touchTarget.changedTouches[0].pageY) as HTMLElement;
            if (targetTile && targetTile.classList.contains('tileValid')) {
                props.onClick({ x: Number(targetTile.dataset.x), y: Number(targetTile.dataset.y) });
            }
            touchTarget = undefined;
        } }
    />
);

export { Tile, BoardTileState };
