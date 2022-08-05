import React from 'react';
import { Game } from './features/game/Game';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  return (<Container fluid>
    <Row>
      <Col>
        <Game></Game>
      </Col>
    </Row>
  </Container>)
}

export default App;
