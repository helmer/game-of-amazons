
import { BoardTiles } from '../Board';
import { BoardTileState, TileCoordinate } from '../Tile';
import { Random as RandomComputer } from "./Random";
import { Smart as SmartComputer } from "./Smart";

export interface Computer {
    selectQueen: (bt: BoardTiles, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN) => TileCoordinate | null;
    moveQueen:   (bt: BoardTiles, from: TileCoordinate) => TileCoordinate | null;
    shootArrow:  (bt: BoardTiles, from: TileCoordinate) => TileCoordinate | null;
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
    static findTilesByState(bt: BoardTiles, state: BoardTileState) {
        const found: TileCoordinate[] = [];
        for (let y = 0; y < bt.length; ++y) { // TODO: Functions
            for (let x = 0; x < bt[y].length; ++x) {
                if (bt[y][x] === state) {
                    if (ComputerUtils.validMoves(bt, { x, y }).length) {
                        found.push({ x, y });
                    }
                }
            }
        }
        return found;
    }

    static validMoves(bt: BoardTiles, from: TileCoordinate): TileCoordinate[] {
        const validMoves: TileCoordinate[] = [];
        const { x, y } = from;

        // Up
        let upY = y;
        while (--upY > -1 && bt[upY][x] === BoardTileState.FREE) validMoves.push({ x, y: upY });

        // Right
        let rightX = x;
        while (++rightX < 10 && bt[y][rightX] === BoardTileState.FREE) validMoves.push({ x: rightX, y });

        // Down
        let downY = y;
        while (++downY < 10 && bt[downY][x] === BoardTileState.FREE) validMoves.push({ x, y: downY });

        // Left
        let leftX = x;
        while (--leftX > -1 && bt[y][leftX] === BoardTileState.FREE) validMoves.push({ x: leftX, y });

        // Up-Right
        let urX = x, urY = y;
        while (--urY > -1 && ++urX < 10 && bt[urY][urX] === BoardTileState.FREE) validMoves.push({ x: urX, y: urY });

        // Down-Right
        let drX = x, drY = y;
        while (++drY < 10 && ++drX < 10 && bt[drY][drX] === BoardTileState.FREE) validMoves.push({ x: drX, y: drY });

        // Down-Left
        let dlX = x, dlY = y;
        while (++dlY < 10 && --dlX > -1 && bt[dlY][dlX] === BoardTileState.FREE) validMoves.push({ x: dlX, y: dlY });

        // Up-Left
        let ulX = x, ulY = y;
        while (--ulY > -1 && --ulX > -1 && bt[ulY][ulX] === BoardTileState.FREE) validMoves.push({ x: ulX, y: ulY });

        // TODO: Turn it to something better than this object, lookup is expensive (map by string?)
        return validMoves;
    }
}
