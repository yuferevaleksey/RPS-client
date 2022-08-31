import React from 'react';
import { GameState } from '../gameSlice';

export interface MainScreenProps {
  gameData: GameState;
}

function Waiting({ gameData }: MainScreenProps) {
  return (
    <div>
      <h3>Waiting for player joining the game: {gameData._id}</h3>
    </div>
  );
}

export default Waiting;
