import React, { useEffect } from 'react';

import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  closeConnection,
  exitGame,
  GameState, getGamesList,
  goToNextRound,
  joinGame, makeChoice, pauseGame, resumeGame,
  saveNickName,
  selectGame, Shapes, startConnecting,
  startNewGame,
  toggleViewGamesList
} from './gameSlice';
import { StartScreen } from './screens/StartScreen';
import { MainScreen } from './screens/MainScreen';
import { SelectScreen } from './screens/SelectScreen';
import GameListScreen from './screens/GameListScreen';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import FinishedScreen from './screens/FinishedScreen';

export function Game() {
  const game = useAppSelector(selectGame);

  useEffect(() => {
    // Starting connection here.
    handleStartConnection();
  }, []);

  const dispatch = useAppDispatch();

  /**
   * Set nickname.
   *
   * @param nickName
   */
  const handleSetNickname = (nickName: string) => {
    dispatch(saveNickName({ nickName }));
  };

  /**
   * Create new game.
   *
   * @param game
   * @param roundsCount
   */
  const handleCreateNewGame = (game: GameState, roundsCount: number) => {
    if (!game.currentSocketId) {
      return alert('Check your server connection!');
    }

    dispatch(
        startNewGame({
          userData: {
            nickName: game.nickname,
            socketId: game.currentSocketId,
            roundsCount,
          },
        })
    );
  };

  /**
   * Join game handler.
   *
   * @param gameId
   * @param game
   */
  const handleJoinGame = (gameId: string, game: GameState) => {
    if (!game.nickname) {
      return alert('You can\'t join without nickname!');
    }

    if (!game.currentSocketId) {
      return alert('Check your server connection!');
    }

    dispatch(
        joinGame({
          joinGameData: {
            gameId,
            nickName: game.nickname,
            socketId: game.currentSocketId,
          },
        })
    );
  };

  /**
   * Go to the next round.
   *
   * @param game
   */
  const handleNextRound = (game: GameState) => {
    dispatch(
        goToNextRound({
          toNextRound: {
            gameId: game._id,
            socketId: game.currentSocketId,
          },
        })
    );
  };

  /**
   * Exit game.
   */
  const handleExitGame = (game: GameState) => {
    dispatch(
        exitGame({
          exitGame: {
            gameId: game._id,
            socketId: game.currentSocketId,
          },
        })
    );
  };

  /**
   * Handle getting game list.
   */
  const handleViewGamesList = () => {
    dispatch(toggleViewGamesList());
  };

  /**
   * Make round choice.
   *
   * @param choice
   * @param game
   */
  const handleMakeChoice = (choice: Shapes, game: GameState) => {
    dispatch(
        makeChoice({
          makeChoice: {
            gameId: game._id,
            socketId: game.currentSocketId,
            choice,
          },
        })
    );
  };

  /**
   * Pause game.
   *
   * @param game
   */
  const handlePauseGame = (game: GameState) => {
    dispatch(
        pauseGame({
          pauseData: {
            gameId: game._id,
            socketId: game.currentSocketId,
          },
        })
    );
  };

  /**
   * Resume game.
   *
   * @param game
   */
  const handleResumeGame = (game: GameState) => {
    dispatch(
        resumeGame({
          resumeData: {
            gameId: game._id,
            socketId: game.currentSocketId,
          },
        })
    );
  };

  /**
   * Start connection
   */
  const handleStartConnection = () => {
    dispatch(startConnecting());
  };

  /**
   * Getting game list.
   */
  const handleGettingGameList = () => {
    dispatch(getGamesList());
  };


  function handleDisconnect(game: any) {
    dispatch(closeConnection());
  }

  /**
   * Render function.
   */
  const render = () => {
    if (!game.nickname && !game.finished) {
      return <StartScreen onSetNickNameJoin={handleSetNickname}></StartScreen>;
    }

    if (game.nickname && game._id && !game.finished) {
      return (
        <MainScreen
          gameData={game}
          onExitGame={() => handleExitGame(game)}
          onMakeChoice={(choice) => handleMakeChoice(choice, game)}
          onNextRound={() => handleNextRound(game)}
          onPauseGame={() => handlePauseGame(game)}
          onResumeGame={() => handleResumeGame(game)}
          onDisconnect={() => handleDisconnect(game)}
        ></MainScreen>
      );
    }

    if (game.finished) {
      return <FinishedScreen gameData={game} onExit={() => handleExitGame(game)}></FinishedScreen>
    }

    if (!game._id && !game.viewGameList) {
      return (
        <SelectScreen
          onCreateNewGame={(roundsCount) => handleCreateNewGame(game, roundsCount)}
          onViewGamesList={handleViewGamesList}
        ></SelectScreen>
      );
    } else {
      return (
        <GameListScreen
          gameList={game.gamesList}
          onHandleGameJoin={(gameId) => handleJoinGame(gameId, game)}
          onCreateNewGame={() => handleCreateNewGame(game, 3)}
          onRefreshGameList={handleGettingGameList}
        ></GameListScreen>
      );
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">{render()}</Row>
    </Container>
  );
}
