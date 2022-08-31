import React from 'react';
import {GameState} from '../gameSlice';
import {Button, Table} from 'react-bootstrap';

export interface FinishedScreenProps {
    gameData: GameState
    onExit: () => void
}

function FinishedScreen({gameData, onExit}: FinishedScreenProps) {
    return (
        <>
            <div>Best wins in a row: {gameData?.getFinishedReport?.bestWinInRow}</div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Round number</th>
                    <th>Your Choice</th>
                    <th>Opponent Choice</th>
                    <th>Result</th>
                </tr>
                </thead>
                <tbody>
                    {(gameData.getFinishedReport.roundsReport || []).map((round) => {
                        return <tr key={round.roundNumber}>
                            <td>{round.roundNumber}</td>
                            <td>{round.youChoice.toUpperCase()}</td>
                            <td>{round.opponentChoice.toUpperCase()}</td>
                            <td>{round.result}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
            <Button variant="primary" type="submit" onClick={onExit}>
                Exit
            </Button>
        </>
    );
}

export default FinishedScreen;