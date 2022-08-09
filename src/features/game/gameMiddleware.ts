import { Middleware, PayloadAction } from '@reduxjs/toolkit';
import { Game, gameActions, GameItem } from './gameSlice';
import { io, Socket } from 'socket.io-client';

enum IncomingEvents {
  GAME_RESPONSE = 'gameResponse',
  CONNECTED_SUCCESSFULLY = 'connectedSuccessfully',
  CONNECT = 'connect',
}

enum OutgoingEvents {
  START_NEW_GAME = 'startNewGame',
  JOIN_GAME = 'joinGame',
  MAKE_CHOICE = 'makeChoice',
  GET_GAMES_LIST = 'getGamesList',
  MOVE_NEXT_ROUND = 'moveNextRound',
  PAUSE_GAME = 'pauseGame',
  RESUME_GAME = 'resumeGame',
}

const gameMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action: PayloadAction) => {
    const isConnectionEstablished = socket && store.getState().game.isConnected;
    if (gameActions.startConnecting.match(action)) {
      socket = io(process.env.REACT_APP_API_URL);

      socket.on(IncomingEvents.CONNECT, () => {
        store.dispatch(gameActions.connectionEstablished());
      });

      socket.on(IncomingEvents.CONNECTED_SUCCESSFULLY, (socketId: string) => {
        store.dispatch(
          gameActions.connectedSuccessfullyEstablished({ socketId })
        );
      });

      socket.on(IncomingEvents.GAME_RESPONSE, (response: string) => {
        store.dispatch(
          gameActions.setNewGameResponse({ game: JSON.parse(response) })
        );
      });
    }

    if (isConnectionEstablished) {
      if (gameActions.closeConnection.match(action)) {
        socket.close();
      }

      /**
       * Resume game.
       */
      if (gameActions.resumeGame.match(action)) {
        socket.emit(
          OutgoingEvents.RESUME_GAME,
          JSON.stringify(action.payload.resumeData),
          (response: Game) => {
            store.dispatch(gameActions.setNewGameResponse({ game: response }));
          }
        );
      }

      /**
       * Pause game.
       */
      if (gameActions.pauseGame.match(action)) {
        socket.emit(
          OutgoingEvents.PAUSE_GAME,
          JSON.stringify(action.payload.pauseData),
          (response: Game) => {
            store.dispatch(gameActions.setNewGameResponse({ game: response }));
          }
        );
      }

      if (gameActions.getGamesList.match(action)) {
        socket.emit(
            OutgoingEvents.GET_GAMES_LIST,
            '',
            (response: GameItem[]) => {
              store.dispatch(gameActions.setGamesList({ gameList: response }));
            }
        );
      }

      if (gameActions.toggleViewGamesList.match(action)) {
        socket.emit(
          OutgoingEvents.GET_GAMES_LIST,
          '',
          (response: GameItem[]) => {
            store.dispatch(gameActions.setGamesList({ gameList: response }));
          }
        );
      }

      if (gameActions.startNewGame.match(action)) {
        socket.emit(
          OutgoingEvents.START_NEW_GAME,
          JSON.stringify(action.payload.userData),
          (response: Game) => {
            store.dispatch(gameActions.setNewGameResponse({ game: response }));
          }
        );
      }

      if (gameActions.connectedSuccessfullyEstablished.match(action)) {
        socket.emit(
          OutgoingEvents.GET_GAMES_LIST,
          '',
          (response: GameItem[]) => {
            store.dispatch(gameActions.setGamesList({ gameList: response }));
          }
        );
      }

      if (gameActions.joinGame.match(action)) {
        socket.emit(
          OutgoingEvents.JOIN_GAME,
          JSON.stringify(action.payload.joinGameData),
          (response: Game) => {
            store.dispatch(gameActions.setNewGameResponse({ game: response }));
          }
        );
        socket.emit(
          OutgoingEvents.GET_GAMES_LIST,
          '',
          (response: GameItem[]) => {
            store.dispatch(gameActions.setGamesList({ gameList: response }));
          }
        );
      }

      if (gameActions.goToNextRound.match(action)) {
        socket.emit(
          OutgoingEvents.MOVE_NEXT_ROUND,
          JSON.stringify(action.payload.toNextRound),
          (response: Game) => {
            store.dispatch(gameActions.setNewGameResponse({ game: response }));
          }
        );
      }

      if (gameActions.makeChoice.match(action)) {
        socket.emit(
          OutgoingEvents.MAKE_CHOICE,
          JSON.stringify(action.payload.makeChoice),
          (response: Game) => {
            store.dispatch(gameActions.setNewGameResponse({ game: response }));
          }
        );
        socket.emit(
          OutgoingEvents.GET_GAMES_LIST,
          '',
          (response: GameItem[]) => {
            store.dispatch(gameActions.setGamesList({ gameList: response }));
          }
        );
      }
    }

    next(action);
  };
};

export default gameMiddleware;
