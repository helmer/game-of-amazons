
import React from 'react';
import { tiles } from './App';
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
}

interface BoardState {
    gameStep: GameStep;
    selected?: TileCoordinate
}

class Board extends React.Component<BoardProps, BoardState> {
    constructor(props: BoardProps) {
        super(props);
        this.state = {
            //tiles: props.tiles,
            gameStep: GameStep.WHITE_TO_SELECT_QUEEN
        }
    }

    componentDidMount() {
        if (this.props.whiteComputer) {
            this.makeComputerMove();
        }
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
            const selectedQueen = computer.selectQueen(queen);
            if (!selectedQueen) {
                this.setState({ gameStep: this.isWhiteMove() ? GameStep.BLACK_WON : GameStep.WHITE_WON });
                return;
            }
            _delay(selectedQueen);
        }

        const _queenMove = () => {
            const queenTarget = computer.moveQueen(this.state.selected!);
            if (!queenTarget) {
                console.error('Selected a queen which cannot move, this should never happen', this.state.selected!.y, this.state.selected!.x);
                return;
            }
            _delay(queenTarget);
        }

        const _arrowShoot = () => {
            const arrowTarget = computer.shootArrow(this.state.selected!);
            if (!arrowTarget) {
                console.error('Attempting to shoot an arrow, this should never happen (you can always shoot back to previous queen position', this.state.selected);
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
        const validMoves = ComputerUtils.validMoves(tiles, this.state.selected);
        return validMoves.some(e => e.x === c.x && e.y === c.y);
    }

    selectQueen = (c: TileCoordinate, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN, nextStep: GameStep.WHITE_TO_MOVE_QUEEN | GameStep.BLACK_TO_MOVE_QUEEN) => {
        const targetTile = tiles[c.y][c.x];
        if (targetTile !== queen) {
            return console.error('No queen in', c);
        }

        this.setState({
            gameStep: nextStep,
            selected: c,
        });
    }

    moveQueen = (to: TileCoordinate, queen: BoardTileState.BLACK_QUEEN | BoardTileState.WHITE_QUEEN, moveStep: GameStep.WHITE_TO_MOVE_QUEEN | GameStep.BLACK_TO_MOVE_QUEEN, arrowStep: GameStep) => {
        const targetTile = tiles[to.y][to.x];
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

        tiles[this.state.selected.y][this.state.selected.x] = setCurrentStatusTo;
        tiles[c.y][c.x] = setTargetStatusTo;

        this.setState({
            gameStep: nextStep,
            selected: nextSelected,
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
                return tiles[c.y][c.x] === BoardTileState.WHITE_QUEEN;
            case GameStep.BLACK_TO_SELECT_QUEEN:
                return tiles[c.y][c.x] === BoardTileState.BLACK_QUEEN;
            case GameStep.WHITE_TO_MOVE_QUEEN:
                return tiles[c.y][c.x] === BoardTileState.WHITE_QUEEN || this.isValidMove(c);
            case GameStep.BLACK_TO_MOVE_QUEEN:
                return tiles[c.y][c.x] === BoardTileState.BLACK_QUEEN || this.isValidMove(c);
            case GameStep.WHITE_TO_SHOOT_ARROW:
            case GameStep.BLACK_TO_SHOOT_ARROW:
                return this.isValidMove(c);
        }
        return false;
    }

    render() {
        return <>
            <div className='currentStep'>
                Current step: { this.state.gameStep }
            </div>
            { tiles.map((row: Array<BoardTileState>, y) => (
                <div key={y} className='row'>
                    {row.map((s, x) => {
                        return <Tile
                            key={String(x) + String(y)}
                            isClickable={ this.isClickableTile({ x, y }) }
                            isEven={(x + y) % 2 === 0}
                            onClick={ this.handleClick }
                            coordinates={{ x, y }}
                            selected={this.state.selected ? this.state.selected.x === x && this.state.selected.y === y : false}
                            state={s}
                        />
                    } )}
                </div>
            )) }
        </>;
    }
}

export { Board, GameStep };
