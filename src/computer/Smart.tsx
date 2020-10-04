
import { BoardTileState, TileCoordinate } from '../Tile';
import { BoardTiles } from '../Board';
import { Computer, ComputerUtils } from './ComputerUtils';

interface BestMove {
    queen: TileCoordinate | null,
    move:  TileCoordinate | null,
    arrow: TileCoordinate | null,
}

const noBestMove = { queen: null, move: null, arrow: null };

const _calculateBestMove = (bt: BoardTiles, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN) => {
    const queens = ComputerUtils.findTilesByState(bt, queen);

    const bowState   = queen === BoardTileState.BLACK_QUEEN ? BoardTileState.BLACK_BOW   : BoardTileState.WHITE_BOW;
    const arrowState = queen === BoardTileState.BLACK_QUEEN ? BoardTileState.BLACK_ARROW : BoardTileState.WHITE_ARROW;
    const enemyState = queen === BoardTileState.BLACK_QUEEN ? BoardTileState.WHITE_QUEEN : BoardTileState.BLACK_QUEEN;

    let bestMove: BestMove = noBestMove;
    let bestMoveWeight = Infinity;

    for (const queenPosition of queens) {
        const { x: qx, y: qy } = queenPosition;
        // All possible moves for given queen
        for (const queenMove of ComputerUtils.validMoves(bt, queenPosition)) {
            const { x: mx, y: my } = queenMove;

            // Move queen to new spot
            bt[qy][qx] = BoardTileState.FREE;
            bt[my][mx] = bowState; // Change queen to bow

            // All possible arrow targets from position
            for (const arrowTarget of ComputerUtils.validMoves(bt, queenMove)) {
                const { x: ax, y: ay } = arrowTarget;

                // Do the shooting
                bt[ay][ax] = arrowState;
                bt[my][mx] = queen;

                // Sum the moves for every opponent queen
                let opponentMoves = 0;
                for (const enemyQueen of ComputerUtils.findTilesByState(bt, enemyState)) {
                    opponentMoves += ComputerUtils.validMoves(bt, enemyQueen).length;
                }

                // Revert the shooting
                bt[ay][ax] = BoardTileState.FREE;
                bt[my][mx] = bowState;

                // This move sucks?
                if (opponentMoves > bestMoveWeight) {
                    continue;
                }

                // Same as previous best? Fifty-fifty skip
                if (opponentMoves === bestMoveWeight && Math.round(Math.random())) {
                    continue;
                }

                // Looks like we've a new winner
                bestMove = { queen: queenPosition, move: queenMove, arrow: arrowTarget };
                bestMoveWeight = opponentMoves;
            }

            // Revert queen to beginning
            bt[qy][qx] = queen;
            bt[my][mx] = BoardTileState.FREE;
        }
    }

    return bestMove;
}

export function Smart(): Computer {
    let bestMove: BestMove;

    const selectQueen = (bt: BoardTiles, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN) => {
        bestMove = _calculateBestMove(bt, queen);
        return bestMove.queen;
    }

    const moveQueen = (bt: BoardTiles, from: TileCoordinate) => {
        return bestMove.move;
    }

    const shootArrow = (bt: BoardTiles, from: TileCoordinate) => {
        const arrow = bestMove.arrow;
        bestMove = noBestMove;
        return arrow;
    }

    return {
        selectQueen,
        moveQueen,
        shootArrow
    }
}
