# Rock Paper Scissors Client side.

```bash
 git clone https://github.com/yuferevaleksey/RPS-client
```

```bash
 cd RPS-client
```

## How to play

Be sure that you have already had backend part working, and you could see **Hello world!** in your browser if you open http://localhost:3001

Build docker image

```bash
docker build -t RPS .
```

For Player ONE

```bash
docker run -p 80:80 RPS
```

For Player TWO

```bash
docker run -p 8080:80 RPS
```

Open the http://localhost in browser tab for first player, and http://localhost:8080 for another player.


## How it works.

Players could add a new game with unlimited counts of rounds or join to an existing one.
After the player creates a new game he will wait till another player will not join his game.

If a player will join an existing game, the game immediately starts.


## WS Incoming Events
```javascript
enum IncomingEvents {
  GAME_RESPONSE = 'gameResponse',
  CONNECTED_SUCCESSFULLY = 'connectedSuccessfully',
  CONNECT = 'connect',
}
```

### IncomingEvents.GAME_RESPONSE

Called for any outgoing event, the server always returns a Game response, so we need to listen to only one event: IncomingEvents.GAME_RESPONSE if we want to get a response from Outgoing events.

```javascript
{
  _id: string;
  roundsCount: number;
  currentRound: number;
  players:[{
      socketId: string;
      nickName: string;
      deactivated: string;
  }];
  rounds:[
      roundNumber: number;
      choices: [
            userSocket: string;
            choice: Shapes;
      ];
      winner: string;
  ];
  paused: boolean;
  finished: boolean;
  pausedBy: string;
}
```

### IncomingEvents.CONNECT
Called to establish a connection.

### IncomingEvents.CONNECTED_SUCCESSFULLY
Called after a connection was established. Used for saving on client side user's socket ID.


## WS Outgoing Events

```javascript
enum OutgoingEvents {
  START_NEW_GAME = 'startNewGame',
  JOIN_GAME = 'joinGame',
  MAKE_CHOICE = 'makeChoice',
  GET_GAMES_LIST = 'getGamesList',
  MOVE_NEXT_ROUND = 'moveNextRound',
  PAUSE_GAME = 'pauseGame',
  RESUME_GAME = 'resumeGame',
  QUIT_GAME = 'quitGame',
}
```

### OutgoingEvents.START_NEW_GAME

#### Request:
```javascript
interface StartNewGameMessage {
    nickName: string;
    socketId: string;
    roundsCount: number;
}
```

#### Responce:
See: *IncomingEvents.GAME_RESPONSE*

### OutgoingEvents.JOIN_GAME

#### Request:
```javascript
interface JoinNewGameMessage {
    gameId: string;
    nickName: string;
    socketId: string;
}
```

#### Responce:
See: *IncomingEvents.GAME_RESPONSE*


### OutgoingEvents.QUIT_GAME

#### Request:
```javascript 
interface ExitGameMessage {
    gameId: string;
    socketId: string;
}
```

#### Responce:
See: *IncomingEvents.GAME_RESPONSE*

### OutgoingEvents.MAKE_CHOICE

#### Request:
```javascript
interface MakeChoiceMessage {
    gameId: string;
    socketId: string;
    choice: Shapes;
}
```

#### Responce:
See: *IncomingEvents.GAME_RESPONSE*

### OutgoingEvents.GET_GAMES_LIST

#### Request:
none

#### Response:
Returns array of GameItem
```javascript
interface GameItem {
  id: string;
  roundsCount: number;
}
```

### OutgoingEvents.MOVE_NEXT_ROUND

#### Request:
```javascript
interface GotToNextRoundMessage {
    gameId: string;
    socketId: string;
}
```

#### Responce:
See: *IncomingEvents.GAME_RESPONSE*

### OutgoingEvents.PAUSE_GAME

#### Request:
```javascript
interface GotToNextRoundMessage {
    gameId: string;
    socketId: string;
}
```

#### Responce:
See: *IncomingEvents.GAME_RESPONSE*


### OutgoingEvents.RESUME_GAME

#### Request:
```javascript
interface GotToNextRoundMessage {
    gameId: string;
    socketId: string;
}
```

#### Responce:
See: *IncomingEvents.GAME_RESPONSE*

