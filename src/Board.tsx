
import React from 'react';
import { Tile, BoardTileState, TileCoordinate } from './Tile';
import { Computer, ComputerUtils } from './computer/ComputerUtils';

enum GameStep {
    WHITE_TO_SELECT_QUEEN = 'WHITE_TO_SELECT_QUEEN',
    WHITE_TO_MOVE_QUEEN = 'WHITE_TO_MOVE_QUEEN',
    WHITE_TO_SHOOT_ARROW = 'WHITE_TO_SHOOT_ARROW',
    BLACK_TO_SELECT_QUEEN = 'BLACK_TO_SELECT_QUEEN',
    BLACK_TO_MOVE_QUEEN = 'BLACK_TO_MOVE_QUEEN',
    BLACK_TO_SHOOT_ARROW = 'BLACK_TO_SHOOT_ARROW',
    WHITE_WON = 'WHITE_WON',
    BLACK_WON = 'BLACK_WON',
}

export type BoardTiles = Array<Array<BoardTileState>>;

interface BoardProps {
    whiteComputer: Computer | null;
    blackComputer: Computer | null;
    computerDelay: number;
    gameStep: GameStep;
    onGameStepChange: (gameStep: GameStep) => void;
}

interface BoardState {
    gameStep: GameStep;
    tiles: BoardTiles;
    selected?: TileCoordinate
}

const buildBoard = (
    blacks: Array<[number, number]> = [[0, 3], [0, 6], [3, 0], [3, 9]],
    whites: Array<[number, number]> = [[6, 0], [6, 9], [9, 3], [9, 6]],
    arrows: Array<[number, number]> = [],
): BoardTiles => {
    const rows: BoardTiles = [];

    Array.from(Array(10)).forEach(() => {
        let cols: BoardTileState[] = [];
        Array.from(Array(10)).forEach(_ => cols.push(BoardTileState.FREE));
        rows.push(cols);
    });

    blacks.forEach(t => rows[t[0]][t[1]] = BoardTileState.BLACK_QUEEN);
    whites.forEach(t => rows[t[0]][t[1]] = BoardTileState.WHITE_QUEEN);
    arrows.forEach(t => rows[t[0]][t[1]] = BoardTileState.BLACK_ARROW);

    return rows;
}

class Board extends React.Component<BoardProps, BoardState> {
    constructor(props: BoardProps) {
        super(props);
        this.state = {
            gameStep: props.gameStep,
            tiles: buildBoard(),
        }
    }

    componentDidMount() {
        this.makeComputerMove();
    }

    componentDidUpdate(prevProps: BoardProps, prevState: BoardState) {
        if (prevState.gameStep !== this.state.gameStep || prevProps.whiteComputer !== this.props.whiteComputer || prevProps.blackComputer !== this.props.blackComputer) {
            this.makeComputerMove();
        }
    }

    isWhiteMove = () : boolean => {
        return [GameStep.WHITE_TO_MOVE_QUEEN, GameStep.WHITE_TO_SELECT_QUEEN, GameStep.WHITE_TO_SHOOT_ARROW].includes(this.state.gameStep);
    }

    isBlackMove = () : boolean => {
        return [GameStep.BLACK_TO_SELECT_QUEEN, GameStep.BLACK_TO_MOVE_QUEEN, GameStep.BLACK_TO_SHOOT_ARROW].includes(this.state.gameStep);
    }

    _setState = (partialState: Partial<BoardState>) => {
        this.props.onGameStepChange(partialState.gameStep!);
        this.setState({ ...this.state, ...partialState });
    }

    getComputerForMove = (): Computer | null => {
        if (this.isWhiteMove() && this.props.whiteComputer) {
            return this.props.whiteComputer;
        }
        if (this.isBlackMove() && this.props.blackComputer) {
            return this.props.blackComputer;
        }
        return null;
    }

    makeComputerMove = () => {
        const computer = this.getComputerForMove();
        if (!computer) {
            return;
        }

        const _delay = (c: TileCoordinate) => setTimeout(() => this.handleClick(c, false), this.props.computerDelay);

        const _queenSelect = (queen: BoardTileState.WHITE_QUEEN | BoardTileState.BLACK_QUEEN) => {
            const selectedQueen = computer.selectQueen(this.state.tiles, queen);
            if (!selectedQueen) {
                this._setState({ gameStep: this.isWhiteMove() ? GameStep.BLACK_WON : GameStep.WHITE_WON });
                return;
            }
            _delay(selectedQueen);
        }

        const _queenMove = () => {
            const queenTarget = computer.moveQueen(this.state.tiles, this.state.selected!);
            if (!queenTarget) {
                console.error('Selected a queen which cannot move, this should never happen', this.state.selected!.y, this.state.selected!.x);
                return;
            }
            _delay(queenTarget);
        }

        const _arrowShoot = () => {
            const arrowTarget = computer.shootArrow(this.state.tiles, this.state.selected!);
            if (!arrowTarget) {
                console.error('Attempting to shoot an arrow, this should never happen (you can always shoot back to previous queen position)', this.state.selected);
                return;
            }
            _delay(arrowTarget);
        }

        switch (this.state.gameStep) {
            case GameStep.WHITE_TO_SELECT_QUEEN:
                return _queenSelect(BoardTileState.WHITE_QUEEN);
            case GameStep.BLACK_TO_SELECT_QUEEN:
                return _queenSelect(BoardTileState.BLACK_QUEEN);
            case GameStep.WHITE_TO_MOVE_QUEEN:
                return _queenMove();
            case GameStep.BLACK_TO_MOVE_QUEEN:
                return _queenMove();
            case GameStep.WHITE_TO_SHOOT_ARROW:
                return _arrowShoot();
            case GameStep.BLACK_TO_SHOOT_ARROW:
                return _arrowShoot();
        }
    }

    isValidMove = (c: TileCoordinate): boolean => {
        if (!this.state.selected) {
            return false;
        }
        const validMoves = ComputerUtils.validMoves(this.state.tiles, this.state.selected);
        return validMoves.some(e => e.x === c.x && e.y === c.y);
    }

    selectQueen = (c: TileCoordinate, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN, nextStep: GameStep.WHITE_TO_MOVE_QUEEN | GameStep.BLACK_TO_MOVE_QUEEN) => {
        const targetTile = this.state.tiles[c.y][c.x];
        if (targetTile !== queen) {
            return console.error('No queen in', c);
        }

        this._setState({
            gameStep: nextStep,
            selected: c,
        });
    }

    moveQueen = (to: TileCoordinate, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN, moveStep: GameStep.WHITE_TO_MOVE_QUEEN | GameStep.BLACK_TO_MOVE_QUEEN, arrowStep: GameStep) => {
        const targetTile = this.state.tiles[to.y][to.x];
        if (targetTile === queen) { // Select different queen
            this.selectQueen(to, BoardTileState.WHITE_QUEEN, moveStep);
            return;
        }

        const targetTileState = queen === BoardTileState.BLACK_QUEEN ? BoardTileState.BLACK_BOW : BoardTileState.WHITE_BOW;
        this.move(to, BoardTileState.FREE, targetTileState, to, arrowStep);
    }

    shootArrow = (c: TileCoordinate, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN, nextStep: GameStep.WHITE_TO_SELECT_QUEEN | GameStep.BLACK_TO_SELECT_QUEEN) => {
        this.move(c, queen, this.isBlackMove() ? BoardTileState.BLACK_ARROW : BoardTileState.WHITE_ARROW, undefined, nextStep);
    }

    move = (
        c: TileCoordinate,
        setCurrentStatusTo: BoardTileState.FREE | BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN,
        setTargetStatusTo: BoardTileState.BLACK_ARROW | BoardTileState.WHITE_ARROW | BoardTileState.BLACK_BOW | BoardTileState.WHITE_BOW,
        nextSelected: undefined | TileCoordinate,
        nextStep: GameStep
    ) => {
        if (!this.isValidMove(c) || !this.state.selected) {
            console.error('Invalid move, should never happen (tm)', c, this.state.selected);
            return;
        }

        const tilesDeepClone = JSON.parse(JSON.stringify(this.state.tiles));
        tilesDeepClone[this.state.selected.y][this.state.selected.x] = setCurrentStatusTo;
        tilesDeepClone[c.y][c.x] = setTargetStatusTo;

        this._setState({
            gameStep: nextStep,
            selected: nextSelected,
            tiles: tilesDeepClone,
        });
    }

    handleClick = (c: TileCoordinate, clickedByHuman = true) => {
        if (clickedByHuman && this.getComputerForMove()) {
            return;
        }

        switch (this.state.gameStep) {
            case GameStep.WHITE_TO_SELECT_QUEEN:
                return this.selectQueen(c, BoardTileState.WHITE_QUEEN, GameStep.WHITE_TO_MOVE_QUEEN);
            case GameStep.BLACK_TO_SELECT_QUEEN:
                return this.selectQueen(c, BoardTileState.BLACK_QUEEN, GameStep.BLACK_TO_MOVE_QUEEN);
            case GameStep.WHITE_TO_MOVE_QUEEN:
                return this.moveQueen(c, BoardTileState.WHITE_QUEEN, GameStep.WHITE_TO_MOVE_QUEEN, GameStep.WHITE_TO_SHOOT_ARROW);
            case GameStep.BLACK_TO_MOVE_QUEEN:
                return this.moveQueen(c, BoardTileState.BLACK_QUEEN, GameStep.BLACK_TO_MOVE_QUEEN, GameStep.BLACK_TO_SHOOT_ARROW);
            case GameStep.WHITE_TO_SHOOT_ARROW:
                return this.shootArrow(c, BoardTileState.WHITE_QUEEN, GameStep.BLACK_TO_SELECT_QUEEN);
            case GameStep.BLACK_TO_SHOOT_ARROW:
                return this.shootArrow(c, BoardTileState.BLACK_QUEEN, GameStep.WHITE_TO_SELECT_QUEEN);
        }
    }

    isClickableTile = (c: TileCoordinate): boolean => {
        switch (this.state.gameStep) {
            case GameStep.WHITE_TO_SELECT_QUEEN:
                return this.state.tiles[c.y][c.x] === BoardTileState.WHITE_QUEEN;
            case GameStep.BLACK_TO_SELECT_QUEEN:
                return this.state.tiles[c.y][c.x] === BoardTileState.BLACK_QUEEN;
            case GameStep.WHITE_TO_MOVE_QUEEN:
                return this.state.tiles[c.y][c.x] === BoardTileState.WHITE_QUEEN || this.isValidMove(c);
            case GameStep.BLACK_TO_MOVE_QUEEN:
                return this.state.tiles[c.y][c.x] === BoardTileState.BLACK_QUEEN || this.isValidMove(c);
            case GameStep.WHITE_TO_SHOOT_ARROW:
            case GameStep.BLACK_TO_SHOOT_ARROW:
                return this.isValidMove(c);
        }
        return false;
    }

    render() {
        return (
            <div className='board'>
                { this.state.tiles.map((row: Array<BoardTileState>, y) => (
                    <div key={y} className='row'>
                        { row.map((s, x) => {
                            return <Tile
                                key={String(x) + String(y)}
                                isClickable={ this.isClickableTile({ x, y }) }
                                isEven={(x + y) % 2 === 0}
                                onClick={ this.handleClick }
                                coordinates={{ x, y }}
                                selected={this.state.selected ? this.state.selected.x === x && this.state.selected.y === y : false}
                                state={s}
                            />
                        }) }
                    </div>
                )) }
            </div>
        );
    }
}

export { buildBoard, Board, GameStep };
