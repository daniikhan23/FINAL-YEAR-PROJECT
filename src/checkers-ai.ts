import {Moves, PieceColor, CheckersPiece, CheckersBoard, State, Player, CheckersGame} from './checkers';

export class CheckersAI extends Player{
    private game: CheckersGame;

    constructor(name: string, color: PieceColor, game: CheckersGame) {
        super(name, color);
        this.game = game;
    }
}