import React from 'react';
import {GameList, GameListProps} from '../commponets/GameList';
import {Alert, Button} from 'react-bootstrap';

export interface GameScreenProps extends GameListProps {
    onCreateNewGame: () => void;
    onRefreshGameList: () => void;
}

const GameListScreen = ({ gameList, onHandleGameJoin, onCreateNewGame, onRefreshGameList }: GameScreenProps) => {
    if (gameList.length < 1) {
        return <Alert  variant='warning'>
            Game list is empty, but! You could <Button variant="success" onClick={onCreateNewGame}>Create </Button>{' '} new!
        </Alert>
    }

    return (
        <>
            <Button onClick={onRefreshGameList}>Refresh list.</Button>
            <GameList
                gameList={gameList}
                onHandleGameJoin={onHandleGameJoin}
            ></GameList>
        </>
    );
}

export default GameListScreen;