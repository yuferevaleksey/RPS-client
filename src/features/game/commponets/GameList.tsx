import { GameItem } from '../gameSlice';
import { GameItem as GameItemComponent } from './GameItem';
import {ListGroup} from 'react-bootstrap';

export interface GameListProps {
  gameList: GameItem[];
  onHandleGameJoin: (gameId: string) => void;
}

export const GameList = ({ gameList, onHandleGameJoin }: GameListProps) => (
    <ListGroup>
    {(gameList || []).map((item) => (
      <GameItemComponent
        key={item.id}
        gameItem={item}
        onHandleGameJoin={onHandleGameJoin}
      />
    ))}
  </ListGroup>
);
