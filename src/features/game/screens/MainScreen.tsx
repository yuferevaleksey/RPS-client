import { Shapes, GameState, RoundResult } from '../gameSlice';
import React from 'react';
import { Button, Card, CloseButton, Spinner, Stack } from 'react-bootstrap';
import ResultModal from '../commponets/ResultModal';
import PauseModal from '../commponets/PauseModal';

export interface MainScreenProps {
  gameData: GameState;
  onExitGame: () => void;
  onMakeChoice: (choice: Shapes) => void;
  onNextRound: () => void;
  onResumeGame: () => void;
  onPauseGame: () => void;
  onDisconnect: () => void;
}

export const MainScreen = ({
  gameData,
  onExitGame,
  onMakeChoice,
  onNextRound,
  onPauseGame,
  onResumeGame,
  onDisconnect,
}: MainScreenProps) => {
  const sharps = Object.fromEntries(
    new Map([
      [Shapes.PAPER, '/assets/Paper.png'],
      [Shapes.SCISSORS, '/assets/Scissors.png'],
      [Shapes.ROCK, '/assets/Rock.png'],
    ])
  );

  let content = (
    <div>
      <h3>
        <Spinner animation="grow" />
        Waiting for player joining the game: {gameData._id}
      </h3>
    </div>
  );

  const images = Object.keys(sharps).map((sharpKey) => (
    <Card
      style={{ width: '10rem' }}
      onClick={() => onMakeChoice(sharpKey as Shapes)}
      key={sharpKey}
    >
      <Card.Img
        variant="top"
        src={process.env.PUBLIC_URL + sharps[sharpKey]}
        alt={sharpKey}
      />
      <Card.Body>
        <Card.Text>{sharpKey}</Card.Text>
      </Card.Body>
    </Card>
  ));

  if (gameData.players.length > 1) {
    if (!gameData.isCurrentRoundDataExist || !gameData.isNeedToWaitChoice) {
      content = (
        <div>
          <div className="countRound">Round #: {gameData.currentRound}</div>
          <Stack gap={2} direction="horizontal" className="col-md-5 mx-auto">
            {images}
          </Stack>
        </div>
      );
    } else {
      content = (
        <div>
          <Spinner animation="grow" />
          Waiting player two make his choice
        </div>
      );
    }
  }

  return (
    <>
      <PauseModal
        isShowModal={gameData.paused}
        isShowBtn={gameData?.pauseModalText?.isShowBtn}
        headerText={gameData?.pauseModalText?.headerText}
        bodyText={gameData?.pauseModalText?.bodyText}
        btnText={gameData?.pauseModalText?.btnText}
        onBtnClick={onResumeGame}
      ></PauseModal>
      <ResultModal
        isShowModal={gameData.roundResult !== RoundResult.RESULT_NOT_EXIST}
        headerText={gameData?.resultModalTexts?.headerText}
        bodyText={gameData?.resultModalTexts?.bodyText}
        btnText={
          gameData.currentRound === gameData.roundsCount
            ? 'See report!'
            : gameData?.resultModalTexts?.btnText
        }
        onBtnClick={onNextRound}
      ></ResultModal>
      <Stack gap={2} direction="horizontal" className="col-md-5 mx-auto">
        <Button onClick={onPauseGame}>Pause Game</Button>
        <CloseButton onClick={onExitGame} />
      </Stack>
      {content}
    </>
  );
};
