
import { BoardTileState, TileCoordinate } from '../Tile';
import { Computer, ComputerUtils } from './ComputerUtils';
import { tiles } from '../App';

export function Random(): Computer {
    const _selectRandomTile = (list: TileCoordinate[]) => {
        return list.length ? list[Math.floor(Math.random() * list.length)] : null;
    }

    const selectQueen = (queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN) => {
        return _selectRandomTile(ComputerUtils.findTilesByState(tiles, queen));
    }

    const moveQueen = (from: TileCoordinate) => {
        return _selectRandomTile(ComputerUtils.validMoves(tiles, from));
    }

    const shootArrow = (from: TileCoordinate) => {
        return _selectRandomTile(ComputerUtils.validMoves(tiles, from));
    }

    return {
        selectQueen,
        moveQueen,
        shootArrow
    }
}
