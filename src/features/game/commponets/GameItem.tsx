import { GameItem as GameItemType } from '../gameSlice';
import React from 'react';
import {Button, ListGroup, Stack} from 'react-bootstrap';

interface GameItemProps {
  gameItem: GameItemType;
  onHandleGameJoin: (gameId: string) => void;
}

export function GameItem({ gameItem, onHandleGameJoin }: GameItemProps) {
  return (
    <ListGroup.Item>
        <Stack direction="horizontal" gap={3}>
            <div>{gameItem.id}</div>
            <div>Rounds: {gameItem.roundsCount}</div>
            <Button variant="primary" onClick={() => onHandleGameJoin(gameItem.id)}>Join</Button>
        </Stack>
    </ListGroup.Item>
  );
}
