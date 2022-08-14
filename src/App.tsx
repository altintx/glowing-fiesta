import React from 'react';
import MainMenu from './screen/main-menu';
import { Socket } from 'socket.io-client'
import GameMenu from './screen/game-menu';
import { Action, Operator, Tile } from './models/models';
import { Game } from './screen/game';
import { v4 as uuid } from 'uuid';

let helloTimeout: NodeJS.Timeout | undefined;

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
    availableActions: any[];
    debouncedActionEvaluation?: NodeJS.Timeout;
  }
> {
  constructor(props: { socket: Socket }) {
    super(props);
    this.state = {
      screen: 'mainmenu',
      map: [],
      characters: {},
      connected: false,
      acceptLanguage: 'en',
      cursors: [],
      tileEventIds: [],
      sig: uuid(),
      availableActions: [],
    }
    this.bindSocket(props.socket);
    clearTimeout(helloTimeout);
    helloTimeout = setTimeout(() => props.socket.emit("hello"), 1000);
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
  bindSocket(socket: Socket) {
    const accelDebug = true;
    socket.removeAllListeners();
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
    });
    socket.on("actions_for_tile", ({ tile, actions, sig }) => {
      this.setState({ availableActions: actions });
    });
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
      console.log("style tile", tile, mode, announcer);
      if(this.state.tileEventIds.includes(sig)) return;
      console.log(mode, tile);
      this.setState({
        cursors: this.cursorsArray({
          // todo: retire old cursors
          // special for select
          tile: tile,
          mode: mode,
          operator: announcer
        })
      });
    });
    socket.on('tile_interaction', ({ tile, tiles, mode, announcer, sig }) => {
      this.setState({
        cursors: this.cursorsArray((tiles || [tile]).map((t: any) => ({
          // todo: retire old cursors
          // special for select
          tile: t,
          mode: mode,
          operator: announcer
        })))
      })
    })
    socket.on("characters_info", (response) => {
      this.setCharacters(response);
    });
  }
  setOperator(name: string) {
    this.setState({ 
      operator: name? {
        screenName: name,
        socket: this.props.socket
      } as Operator : undefined
    });
  }
  setAction(action: Action, x: number, y: number): void {
    const existingPossibles = this.state.cursors.filter(c => c.mode === 'possible-destination');
    const resetPossibles = this.cursorsArray(existingPossibles.map(p => ({
      mode: 'clear',
      operator: this.state.operator,
      tile: p.tile
    })))
    const sig = uuid();
    if(this.state.debouncedActionEvaluation) {
      clearTimeout(this.state.debouncedActionEvaluation);
      console.log("Clearing debounced cursor");
    }
    this.setState({
      cursors: resetPossibles,
      debouncedActionEvaluation: setTimeout(() => {
        this.props.socket?.emit('action_intention', { x, y, actionId: action.uuid, sig });
        this.setState({
          debouncedActionEvaluation: undefined
        });
      }, 50)
    });
  }
  cursorsArray(cursor: any | any[]): any[] {
    const cursors = this.state.cursors;
    switch(cursor.mode || cursors[0].mode) {
      case 'select':
        return cursors.filter(c => c.mode !== 'select').concat(cursor);
      case 'hover':
        return cursors.filter(c => c.mode !== 'hover').concat(cursor);
      case 'clear':
        if(Array.isArray(cursor)) {
          return cursors.filter(c => !(cursor.map(c => c.tile.uuid).includes(c.tile.uuid)));
        } else {
          return cursors.filter(c => c.tile.uuid !== cursor.tile.uuid);
        }
      case 'possible-destination':
        if('length' in cursor) {
          return cursors.filter(c => c.mode !== 'possible-destination').concat(cursor);
        } else {
          return cursors.concat(cursor);
        }
      default:
        return cursors.concat(cursor);
    }
  }
  communicateTileFocus(x: number, y: number , tile: Tile, mode: string ) {
    console.log(`Setting tile ${x}, ${y} to ${mode}`);
    const sig = uuid();
    if(this.state.debouncedCursor) {
      clearTimeout(this.state.debouncedCursor);
      console.log("Clearing debounced cursor");
    }
    this.setState({
      cursors: this.cursorsArray({
        tile,
        mode,
        operator: this.state.operator as Operator,
        sig
      }),
      sig,
      tileEventIds: this.state.tileEventIds.concat(sig),
      debouncedCursor: setTimeout(() => {
        if(this.state.sig === sig) {
          console.log(`tile_interaction ${x}, ${y} ${mode}`);
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
          availableActions={this.state.availableActions}
          characters={characters} 
          setAction={this.setAction.bind(this)}
        />
      default:
        return <div>Unknown state</div>
    }
  }
}
export default App;
