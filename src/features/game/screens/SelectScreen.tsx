import React, {useState} from 'react';
import {Button, Form, Stack} from 'react-bootstrap';

interface SelectScreenProps {
    onCreateNewGame: (roundsCount: number) => void;
    onViewGamesList: () => void;
}

export const SelectScreen = ({onCreateNewGame, onViewGamesList}: SelectScreenProps) => {
    const [roundsCount, setRoundsCount] = useState(3);
    return (
        <>
            <Stack gap={2} className="col-md-5 mx-auto">
                <Stack gap={2} direction="horizontal" className="col-md-5 mx-auto">
                    <Form.Group>
                        <Form.Control type="text" placeholder="Enter nickname"  value={roundsCount} onChange={(e) => setRoundsCount(+e.target.value)}/>
                    </Form.Group>
                    <Button variant="success" onClick={() => onCreateNewGame(roundsCount)}>Create new Game</Button>{' '}
                </Stack>
                <Button variant="warning" onClick={onViewGamesList}>Join Game</Button>{' '}
            </Stack>
        </>
    )
}