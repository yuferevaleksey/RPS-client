import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  ExitGameMessage,
  GotToNextRoundMessage,
  JoinNewGameMessage,
  MakeChoiceMessage,
  PauseGameMessage,
  ResumeGameMessage,
  StartNewGameMessage,
} from './interfaces/messages';
import {
  BODY_TEXT_LOSE_ROUND,
  BODY_TEXT_WIN_ROUND,
  BTN_NEXT_TEXT,
  HEADER_LOSE,
  HEADER_WIN,
  NO_ONE_WIN_TEXT
} from './texts/state-texts';

export enum RoundResult {
  PLAYER_WIN = 'player_win',
  PLAYER_LOSE = 'player_lose',
  RESULT_NOT_EXIST = 'result_no_exist',
  NO_ONE_WIN = 'no_one_win',
}

export enum Shapes {
  ROCK = 'rock',
  SCISSORS = 'scissors',
  PAPER = 'paper',
}

type ReduceBestWin = {
  isPreviousVin: boolean;
  currentWinCount: number;
  maxWinCount: number;
};

export interface PlayerChoice {
  userSocket: string;
  choice: Shapes;
}

export interface GameRound {
  roundNumber: number;
  choices: PlayerChoice[];
  winner: string;
}

export interface Player {
  socketId: string;
  nickName: string;
  deactivated: string;
}

export interface Game {
  _id: string;
  roundsCount: number;
  currentRound: number;
  players: Player[];
  rounds: GameRound[];
  paused: boolean;
  finished: boolean;
  pausedBy: string;
}

export interface GameItem {
  id: string;
  roundsCount: number;
}


export interface RoundResultsTexts {
  headerText: string;
  bodyText: string;
  btnText: string;
}

export type PausedModalText = RoundResultsTexts & {
  isShowBtn: boolean;
};

export type RoundReport = {
  roundNumber: number;
  youChoice: Shapes;
  opponentChoice: Shapes;
  result: string;
};

export type FinishedData = {
  bestWinInRow: number;
  roundsReport: RoundReport[];
};

export interface GameState extends Game {
  currentSocketId: string;
  nickname: string;
  isEstablishingConnection: boolean;
  isConnected: boolean;
  gamesList: GameItem[];
  viewGameList: boolean;
  roundResult: RoundResult;
  isCurrentRoundDataExist: boolean | undefined;
  isNeedToWaitChoice: boolean | undefined;
  resultModalTexts: RoundResultsTexts;
  pauseModalText: PausedModalText;
  getFinishedReport: FinishedData;
}

const initialState: GameState = {
  _id: '',
  isEstablishingConnection: false,
  isConnected: false,
  currentRound: 0,
  currentSocketId: '',
  finished: false,
  nickname: '',
  paused: false,
  players: [],
  rounds: [],
  gamesList: [],
  roundsCount: 0,
  viewGameList: false,
  roundResult: RoundResult.RESULT_NOT_EXIST,
  isCurrentRoundDataExist: undefined,
  isNeedToWaitChoice: undefined,
  pausedBy: '',
  resultModalTexts: {
    headerText: '',
    bodyText: '',
    btnText: '',
  },
  pauseModalText: {
    isShowBtn: false,
    headerText: 'Game paused.',
    bodyText: '',
    btnText: '',
  },
  getFinishedReport: { bestWinInRow: 0, roundsReport: [] },
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },
    connectedSuccessfullyEstablished: (
      state,
      action: PayloadAction<{
        socketId: string;
      }>
    ) => {
      return {
        ...state,
        currentSocketId: action.payload.socketId,
      };
    },
    setNewGameResponse: (
      state,
      action: PayloadAction<{
        game: Game;
      }>
    ) => {
      const { game } = action.payload;
      const roundData = getCurrentRoundData(game);
      const roundResult = getRoundResult(state, game);

      return {
        ...state,
        ...game,
        roundResult,
        isNeedToWaitChoice: checkIfNeedToWaitChoice(state, roundData),
        isCurrentRoundDataExist: !!roundData,
        resultModalTexts: getTextRoundResult(roundResult),
        pauseModalText: getPauseModalText(state, game),
        getFinishedReport: collectReport(state),
      };
    },
    startNewGame: (
      // eslint-disable-next @typescript-eslint/no-unused-vars
      state,
      action: PayloadAction<{
        userData: StartNewGameMessage;
      }>
    ) => {
      return;
    },
    saveNickName: (
      state,
      action: PayloadAction<{
        nickName: string;
      }>
    ) => {
      return {
        ...state,
        nickname: action.payload.nickName,
      };
    },
    getGamesList: () => {
      return;
    },
    setGamesList: (
      state,
      action: PayloadAction<{
        gameList: GameItem[];
      }>
    ) => {
      state.gamesList = action.payload.gameList;
    },
    joinGame: (
      state,
      action: PayloadAction<{
        joinGameData: JoinNewGameMessage;
      }>
    ) => {
      return;
    },
    toggleViewGamesList: (state) => {
      state.viewGameList = !state.viewGameList;
    },
    exitGame: (
      state,
      action: PayloadAction<{
        exitGame: ExitGameMessage;
      }>
    ) => {
      return {
        ...state,
        _id: '',
        players: [],
        viewGameList: false,
        rounds: [],
        finished: false,
        roundResult: RoundResult.RESULT_NOT_EXIST,
      };
    },
    makeChoice: (
      state,
      action: PayloadAction<{
        makeChoice: MakeChoiceMessage;
      }>
    ) => {
      return;
    },
    goToNextRound: (
      state,
      action: PayloadAction<{
        toNextRound: GotToNextRoundMessage;
      }>
    ) => {
      return {
        ...state,
        isUserWinCurrentRound: undefined,
        isNeedToWaitChoice: false,
        isCurrentRoundDataExist: false,
      };
    },
    pauseGame: (
      state,
      action: PayloadAction<{
        pauseData: PauseGameMessage;
      }>
    ) => {
      return;
    },
    resumeGame: (
      state,
      action: PayloadAction<{
        resumeData: ResumeGameMessage;
      }>
    ) => {
      return;
    },
    closeConnection: (
        state,
    ) => {
      return;
    },
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectGame = (state: RootState) => state.game;

export const gameActions = gameSlice.actions;

export const {
  startConnecting,
  startNewGame,
  saveNickName,
  joinGame,
  toggleViewGamesList,
  exitGame,
  makeChoice,
  goToNextRound,
  pauseGame,
  resumeGame,
  getGamesList,
  closeConnection
} = gameActions;

export default gameSlice.reducer;
const TIE = 'TIE';

const getCurrentRoundData = (gameData: Game): GameRound | undefined => {
  return (gameData.rounds || []).find(
    (round) => round.roundNumber === gameData.currentRound
  );
};

/**
 * Checking if the player hasn't yet made his choice.
 *
 * @param state
 * @param gameRound
 */
const checkIfNeedToWaitChoice = (
  state: GameState,
  gameRound: GameRound | undefined
): boolean => {
  return !!gameRound?.choices?.find(
    (choice) => choice.userSocket == state.currentSocketId
  );
};

/**
 * Return current round result.
 *
 * @param state
 * @param gameData
 */
const getRoundResult = (state: GameState, gameData: Game): RoundResult => {
  const winnResult = (gameData?.rounds || []).find(
    (round) => round.roundNumber === gameData.currentRound
  )?.winner;

  if (winnResult === TIE) {
    return RoundResult.NO_ONE_WIN;
  }

  if (winnResult == undefined) {
    return RoundResult.RESULT_NOT_EXIST;
  }

  return winnResult === state.currentSocketId
    ? RoundResult.PLAYER_WIN
    : RoundResult.PLAYER_LOSE;
};

/**
 * Get texts for round result modal window.
 *
 * @param roundResult
 */
const getTextRoundResult = (roundResult: RoundResult): RoundResultsTexts => {
  const resultObj = {
    headerText: '',
    bodyText: '',
    btnText: '',
  };

  if (roundResult === RoundResult.RESULT_NOT_EXIST) {
    return resultObj;
  }

  resultObj.headerText = NO_ONE_WIN_TEXT;
  resultObj.bodyText = NO_ONE_WIN_TEXT;
  resultObj.btnText = BTN_NEXT_TEXT;

  if (roundResult === RoundResult.PLAYER_WIN) {
    resultObj.headerText = HEADER_WIN;
    resultObj.bodyText = BODY_TEXT_WIN_ROUND;
  } else if (roundResult === RoundResult.PLAYER_LOSE) {
    resultObj.headerText = HEADER_LOSE;
    resultObj.bodyText = BODY_TEXT_LOSE_ROUND;
  }

  return resultObj;
};

/**
 * Return text for pause modal.
 *
 * @param state
 * @param gameData
 */
const getPauseModalText = (
  state: GameState,
  gameData: Game
): PausedModalText => {
  if (!gameData.paused) {
    return state.pauseModalText;
  }

  const ifCurrentUserPaused = state.currentSocketId === gameData.pausedBy;
  const opponentNickName = gameData.players.find(
    (player) => player.socketId !== state.currentSocketId
  )?.nickName;
  const bodyText = !ifCurrentUserPaused
    ? `Game was paused by: ${opponentNickName}. Please wait.`
    : 'You pause game.';

  return {
    ...state.pauseModalText,
    isShowBtn: ifCurrentUserPaused,
    bodyText,
    btnText: 'Resume',
  };
};

/**
 * Get report for final screen.
 *
 * @param state
 */
const collectReport = (state: GameState): FinishedData => {
  const bestWinInRow = state?.rounds.reduce(
    (prev, current) => {
      if (!prev.isPreviousVin) {
        prev.currentWinCount = 0;
      }

      if (current.winner === state?.currentSocketId) {
        prev.currentWinCount = ++prev.currentWinCount;
        prev.isPreviousVin = true;
      } else if (current.winner !== state?.currentSocketId) {
        prev.isPreviousVin = false;
      }

      prev.maxWinCount =
        prev.maxWinCount > prev.currentWinCount
          ? prev.currentWinCount
          : prev.currentWinCount;

      return prev;
    },
    {
      isPreviousVin: false,
      currentWinCount: 0,
      maxWinCount: 0,
    } as ReduceBestWin
  )?.maxWinCount;

  const roundsReport = state.rounds.map((round) => {
    const { roundNumber, choices, winner } = round;

    return {
      roundNumber,
      youChoice: choices.find(
        (choice) => choice.userSocket === state.currentSocketId
      )?.choice,
      opponentChoice: choices.find(
        (choice) => choice.userSocket !== state.currentSocketId
      )?.choice,
      result:
        winner === TIE
          ? 'TIE!'
          : winner === state.currentSocketId
          ? 'You win!.'
          : 'You lose!.',
    } as RoundReport;
  });

  return {
    bestWinInRow,
    roundsReport,
  };
};
