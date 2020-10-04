
import { BoardTileState, TileCoordinate } from '../Tile';
import { Computer, ComputerUtils } from './ComputerUtils';
import { BoardTiles } from '../Board';

export function Random(): Computer {
    const _selectRandomTile = (list: TileCoordinate[]) => {
        return list.length ? list[Math.floor(Math.random() * list.length)] : null;
    }

    const selectQueen = (bt: BoardTiles, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN) => {
        return _selectRandomTile(ComputerUtils.findTilesByState(bt, queen));
    }

    const moveQueen = (bt: BoardTiles, from: TileCoordinate) => {
        return _selectRandomTile(ComputerUtils.validMoves(bt, from));
    }

    const shootArrow = (bt: BoardTiles, from: TileCoordinate) => {
        return _selectRandomTile(ComputerUtils.validMoves(bt, from));
    }

    return {
        selectQueen,
        moveQueen,
        shootArrow
    }
}
