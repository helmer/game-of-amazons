
import { BoardTiles } from '../Board';
import { BoardTileState, TileCoordinate } from '../Tile';
import { Random as RandomComputer } from "./Random";
import { Smart as SmartComputer } from "./Smart";

export interface Computer {
    selectQueen: (queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN) => TileCoordinate | null;
    moveQueen:   (from: TileCoordinate) => TileCoordinate | null;
    shootArrow:  (from: TileCoordinate) => TileCoordinate | null;
}

export enum ComputerSmartness {
    NONE   = 'NONE',
    RANDOM = 'RANDOM',
    SMART  = 'SMART',
}

export const createAI = (smartness: ComputerSmartness) => {
    switch (smartness) {
        case ComputerSmartness.NONE:   return null;
        case ComputerSmartness.RANDOM: return RandomComputer();
        case ComputerSmartness.SMART:  return SmartComputer();
    }
}

export class ComputerUtils {
    static findTilesByState(tiles: BoardTiles, state: BoardTileState) {
        const found: TileCoordinate[] = [];
        for (let y = 0; y < tiles.length; ++y) { // TODO: Functions
            for (let x = 0; x < tiles[y].length; ++x) {
                if (tiles[y][x] === state) {
                    if (ComputerUtils.validMoves(tiles, { x, y }).length) {
                        found.push({ x, y });
                    }
                }
            }
        }
        return found;
    }

    static validMoves(tiles: BoardTiles, from: TileCoordinate): TileCoordinate[] {
        const validMoves: TileCoordinate[] = [];
        const { x, y } = from;

        // Up
        let upY = y;
        while (--upY > -1 && tiles[upY][x] === BoardTileState.FREE) validMoves.push({ x, y: upY });

        // Right
        let rightX = x;
        while (++rightX < 10 && tiles[y][rightX] === BoardTileState.FREE) validMoves.push({ x: rightX, y });

        // Down
        let downY = y;
        while (++downY < 10 && tiles[downY][x] === BoardTileState.FREE) validMoves.push({ x, y: downY });

        // Left
        let leftX = x;
        while (--leftX > -1 && tiles[y][leftX] === BoardTileState.FREE) validMoves.push({ x: leftX, y });

        // Up-Right
        let urX = x, urY = y;
        while (--urY > -1 && ++urX < 10 && tiles[urY][urX] === BoardTileState.FREE) validMoves.push({ x: urX, y: urY });

        // Down-Right
        let drX = x, drY = y;
        while (++drY < 10 && ++drX < 10 && tiles[drY][drX] === BoardTileState.FREE) validMoves.push({ x: drX, y: drY });

        // Down-Left
        let dlX = x, dlY = y;
        while (++dlY < 10 && --dlX > -1 && tiles[dlY][dlX] === BoardTileState.FREE) validMoves.push({ x: dlX, y: dlY });

        // Up-Left
        let ulX = x, ulY = y;
        while (--ulY > -1 && --ulX > -1 && tiles[ulY][ulX] === BoardTileState.FREE) validMoves.push({ x: ulX, y: ulY });

        // TODO: Turn it to something better than this object, lookup is expensive (map by string?)
        return validMoves;
    }
}
