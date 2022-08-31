import {Shapes} from '../gameSlice';

export interface StartNewGameMessage {
    nickName: string;
    socketId: string;
    roundsCount: number;
}

export interface JoinNewGameMessage {
    gameId: string;
    nickName: string;
    socketId: string;
}

export interface ExitGameMessage {
    gameId: string;
    socketId: string;
}

export interface MakeChoiceMessage {
    gameId: string;
    socketId: string;
    choice: Shapes;
}

export interface GotToNextRoundMessage {
    gameId: string;
    socketId: string;
}

export type PauseGameMessage = GotToNextRoundMessage;
export type ResumeGameMessage = GotToNextRoundMessage;