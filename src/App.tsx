import React from 'react';
import MainMenu from './screen/main-menu';
import { Socket } from 'socket.io-client'
import GameMenu from './screen/game-menu';
import { Operator, Tile } from './models/models';
import { Game } from './screen/game';
import { v4 as uuid } from 'uuid';

// this is the router
class App extends React.Component<
  { socket?: Socket },
  { 
    screen: string, 
    gameId?: string, 
    missionId?: string, 
    map: Tile[][], 
    operator?: Operator,
    characters: Record<string, any>, 
    connected: boolean, 
    acceptLanguage: string,
    cursors: any[],
    tileEventIds: string[]
    debouncedCursor?: NodeJS.Timeout;
    sig: string;
  }
> {
  constructor(props: { socket?: Socket }) {
    super(props);
    this.state = {
      screen: 'mainmenu',
      map: [],
      characters: {},
      connected: false,
      acceptLanguage: 'en',
      cursors: [],
      tileEventIds: [],
      sig: uuid()
    }
  }
  setScreen(screen: string) {
    this.setState({ screen });
  }
  setGameId(id: string) {
    this.setState({ gameId: id });
  }
  setMissionId(id: string) {
    this.setState({ missionId: id });
  }
  setMap(map: Tile[][]) {
    this.setState({ map });
  }
  setCharacters(characters: any[]) {
    this.setState({ characters: characters.reduce((s, c) => {
      s[c.uuid] = c;
      return s;
    }, {})});
  }
  componentWillUnmount() {
    this.props.socket?.removeAllListeners();
  }
  componentDidMount() {
    const socket = this.props.socket;
    const accelDebug = true;
    if(!socket) return;
    socket.on("hello", ({language}) => {
      this.setState({ connected: true, acceptLanguage: language });
      if(accelDebug) socket.emit('login', { name: 'joe' }); 
    })
    socket.on('you_logged_in', (response) => {
      // todo: response really ought to include the assigned screen name
      this.setScreen('loggedinmenu');
      if(accelDebug) {
        socket.emit('new_game');
        this.setOperator('joe');
      }
    })
    // socket.emit('new_game');
    socket.on('you_joined_game', (response) => {
      console.log("you joined game");
      this.setScreen('game');
      this.setGameId(response.gameId); 
      this.setMissionId(response.missionUuid);
    });
    socket.on('game_state', function(response) {
      console.log("game state");
      const mission = response.mission;
      if(mission) {
        socket.emit('mission_info');
      } else {
        if(accelDebug) {
          return socket.emit("start_next_mission", 0);
        }
        if(window.confirm("Start mission?")) {
          socket.emit("start_next_mission", 0);
        }
      }
    })
    socket.on('mission_info', (response) => {
      const _map: Tile[][] = [];
      for(let y = 0; y < response.map.height; y++) {
        _map[y] = [];
        for(let x = 0; x < response.map.width; x++) {
          _map[y][x] = {
            ...response.map.grid[y * response.map.width + x],
            x,
            y
          }
        }
      }
      this.setMap(_map);
    });
    socket.on('style_tile', ({ tile, mode, announcer, sig }) => {
      if(this.state.tileEventIds.includes(sig)) return;
      this.setState({
        cursors: [{
          tile: tile,
          mode: mode,
          operator: announcer
        }]
      })
    })
    socket.on("characters_info", (response) => {
      this.setCharacters(response);
    });
    socket.emit("hello");
  }
  setOperator(name: string) {
    this.setState({ 
      operator: name? {
        screenName: name,
        socket: this.props.socket
      } as Operator : undefined
    });
  }
  communicateTileFocus(x: number, y: number , tile: Tile, mode: string ) {
    const sig = uuid();
    if(this.state.debouncedCursor) clearTimeout(this.state.debouncedCursor);
    this.setState({
      cursors: [{
        tile,
        mode,
        operator: this.state.operator as Operator,
        sig
      }],
      sig,
      tileEventIds: this.state.tileEventIds.concat(sig),
      debouncedCursor: setTimeout(() => {
        if(this.state.sig === sig) {
          this.state.operator?.socket?.emit('tile_interaction', { x, y, mode, sig });
        }
        this.setState({
          debouncedCursor: undefined
        });
      }, 50)
    })
  }
  render() {
    const { screen, gameId, missionId, map, operator, characters, connected, acceptLanguage, cursors } = this.state;
    if(!connected) return <div>Connecting</div>;
    const socket = this.props.socket as Socket;
    const setScreen = this.setScreen.bind(this);
    switch(screen) {
      case 'mainmenu':
        return <MainMenu language={acceptLanguage} login={(screenName) => {
          socket.emit('login', { name: screenName });
          this.setOperator(screenName);
        }} />
      case "loggedinmenu":
        return <GameMenu 
          language={acceptLanguage}
          operator={operator as Operator}
          onNewGame={() => socket.emit('new_game')}
          onLogOut={() => {
            this.setScreen("mainmenu");
            this.setState({ operator: undefined });
          }}
          onFindGame={() => {
          }}
          onOptions={() => {
          }}
        />
      case "game":
        return <Game 
          language={acceptLanguage}
          operator={operator as Operator} 
          gameId={gameId as string} 
          missionId={missionId as string} 
          setScreen={setScreen} 
          map={map} 
          operatorArrows={cursors}
          communicateTileFocus={this.communicateTileFocus.bind(this)}
          characters={characters} 
        />
      default:
        return <div>Unknown state</div>
    }
  }
}
export default App;
