import React from 'react';
import MainMenu from './screen/main-menu';
import { io, Socket } from 'socket.io-client'
import GameMenu from './screen/game-menu';
import { Action, Operator, Tile } from './models/models';
import { Game } from './screen/game';
import { v4 as uuid } from 'uuid';
import { translate } from './components/localized-string';
import { Caption } from './components/caption';
import { Games } from './screen/games';
import { NewGame } from './screen/new-game';
import { MapEditor } from './screen/map_editor';
import { MissionEditor } from './screen/mission_editor';

let helloTimeout: NodeJS.Timeout | undefined;

// this is the router
class App extends React.Component<
  {  },
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
    action?: Action;
    closedCaptioning?: string;
    publicGames?: any[];
    campaigns?: any[];
    socket: Socket;
  }
> {
  constructor(props: {}) {
    if(!process.env["REACT_APP_PROXY_HOST"]) throw new Error("REACT_APP_PROXY_HOST is undefined");
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
      socket: io(process.env["REACT_APP_PROXY_HOST"] as string, {
        auth: {
          token: this.operatorId()
        }
      }).compress(false)
    }
    this.bindSocket(this.state.socket);
    clearTimeout(helloTimeout);
    helloTimeout = setTimeout(() => this.state.socket.emit("hello"), 1000);
  }
  operatorId() {
    const cached = window.localStorage.getItem('operatorId');
    if(cached) return cached;
    const newOperatorId = uuid();
    window.localStorage.setItem('operatorId', newOperatorId);
    return newOperatorId;
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
    this.state.socket?.removeAllListeners();
  }
  bindSocket(socket: Socket) {
    const accelDebug = false;
    socket.removeAllListeners();
    socket.on("hello", ({language}) => {
      this.setState({ connected: true, acceptLanguage: language });
      if(accelDebug) socket.emit('login', { name: 'joe', operatorId: this.operatorId() }); 
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
        socket.emit("start_next_mission", 0);
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
    socket.on('action_done', ({ actionId, sig }) => {
      if(sig !== this.state.sig) {
        return;
      }
      this.setState({
        closedCaptioning: undefined,
        cursors: []
      });
    });
    socket.on('action_error', ({ actionId, sig }) => {
      if(sig !== this.state.sig) {
        return;
      }
      this.setState({
        closedCaptioning: undefined,
        cursors: []
      });
      alert("Error performing action");
    });
    socket.on('style_tile', ({ tile, mode, announcer, sig }) => {
      if(this.state.tileEventIds.includes(sig)) return;
      this.setState(prevState => ({
        ...prevState,
        cursors: this.cursorsArray({
          tile: tile,
          mode: mode,
          operator: announcer
        })
      }));
    });
    socket.on('tile_interaction', ({ tile, tiles, mode, announcer, sig }) => {
      this.setState(prevState => ({
        ...prevState,
        cursors: this.cursorsArray((tiles || [tile]).map((t: any) => ({
          tile: t,
          mode: mode,
          operator: announcer
        })), prevState.cursors)
      }))
    });
    socket.on('action_intention', action => {
      this.setState({
        action: action
      })
    })
    socket.on('animate_action', ({ tile, mode, announcer, sig }) => {
    })
    socket.on("characters_info", (response) => {
      this.setCharacters(response);
    });
    socket.on("games_list", (response) => {
      this.setState({ publicGames: response });
    });
    socket.on("list_campaigns", (response) => {
      this.setState({ campaigns: response });
    })
  }
  setOperator(name: string) {
    this.setState({ 
      operator: name? {
        screenName: name,
        socket: this.state.socket as unknown
      } as Operator : undefined
    });
  }
  setAction(action: Action, x: number, y: number): void {
    const sig = uuid();
    if(this.state.debouncedActionEvaluation) {
      clearTimeout(this.state.debouncedActionEvaluation);
    }
    this.setState({
      cursors: this.omitPossibleDestinations(),
      action: action,
      debouncedActionEvaluation: setTimeout(() => {
        this.state.socket?.emit('action_intention', { x, y, actionId: action.uuid, sig });
        this.setState({
          debouncedActionEvaluation: undefined
        });
      }, 50)
    });
  }
  private omitPossibleDestinations() {
    return this.state.cursors.filter(cursor => cursor.mode !== 'possible-destination');
  }

  cursorsArray(cursor: any | any[], cursors = this.state.cursors): any[] {
    const tileExists = (cursor: any) => cursor.tile;
    switch(cursor.mode || cursor[0].mode) {
      case 'select':
        return cursors.filter(c => !['possible-destination', 'select'].includes(c.mode)).concat(cursor).filter(tileExists);
      case 'hover':
        return cursors.filter(c => c.mode !== 'hover').concat(cursor).filter(tileExists);
      case 'clear':
        if(Array.isArray(cursor)) {
          return cursors.filter(c => !(cursor.map(c => c.tile.uuid).includes(c.tile.uuid))).filter(tileExists);
        } else {
          return cursors.filter(c => c.tile.uuid !== cursor.tile.uuid).filter(tileExists);
        }
      case 'possible-destination':
        if('length' in cursor) {
          return cursors.filter(c => c.mode !== 'possible-destination').concat(cursor).filter(tileExists);
        } else {
          return cursors.concat(cursor).filter(tileExists);
        }
      default:
        return cursors.concat(cursor).filter(tileExists);
    }
  }
  actionExecution(action: Action, source: Tile, destination: Tile): void {
    const sig = uuid();
    this.state.socket?.emit('action_execution', { actionId: action.uuid, x1: source.x, y1: source.y, x2: destination.x, y2: destination.y, sig });
    this.setState({
      cursors: this.omitPossibleDestinations(),
      action: undefined,
      availableActions: [],
      closedCaptioning: translate(action.name, this.state.acceptLanguage),
      sig
    })
  }
  communicateTileFocus(x: number, y: number , tile: Tile | null, mode: string ) {
    const sig = uuid();
    const ignore = ['hover'];
    if(ignore.includes(mode)) {
      this.setState({
        cursors: this.cursorsArray({
          tile,
          mode,
          operator: this.state.operator as Operator,
          sig
        })
      });
    } else {
      if(this.state.debouncedCursor) {
        clearTimeout(this.state.debouncedCursor);
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
            this.state.operator?.socket?.emit('tile_interaction', { x, y, mode, sig });
          }
          this.setState({
            debouncedCursor: undefined
          });
        }, 50)
      })
    }
  }
  render() {
    const { screen, gameId, missionId, map, operator, characters, connected, acceptLanguage, cursors, publicGames, campaigns } = this.state;
    if(!connected) return <Caption>Connecting</Caption>;
    const socket = this.state.socket as Socket;
    const setScreen = this.setScreen.bind(this);
    switch(screen) {
      case 'mainmenu':
        return <MainMenu language={acceptLanguage} login={(screenName) => {
          socket.emit('login', { name: screenName, operatorId: this.operatorId() });
          this.setOperator(screenName);
        }} />
      case "loggedinmenu":
        return <GameMenu 
          language={acceptLanguage}
          operator={operator as Operator}
          onNewGame={() => {
            socket.emit('list_campaigns');
            this.setScreen('new_game');
          }}
          onLogOut={() => {
            this.setScreen("mainmenu");
            this.setState({ operator: undefined });
          }}
          onFindGame={() => {
            socket.emit('list_games');
            setScreen("list_games");
          }}
          onMapEditor={() => setScreen("map_editor")}
          onMissionEditor={() => setScreen("mission_editor")}
          onOptions={() => {
          }}
        />
      case "new_game":
        return <NewGame 
          language={acceptLanguage}
          onBack={() => setScreen("loggedinmenu")}
          onNewGame={(campaignId: string, publicGame: boolean) => {
            socket.emit('new_game', {
              campaignId,
              publicGame
            });
          }}
          campaigns={campaigns}
        />;
      case "list_games":
        return <Games
          language={acceptLanguage}
          games={publicGames}
          onBack={() => setScreen("loggedinmenu")}
          connect={(gameId) => {

          }} />
      case "map_editor":
        return <MapEditor
        />
      case "mission_editor":
        return <MissionEditor
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
          action={this.state.action}
          doAction={this.actionExecution.bind(this)}
          closedCaptioning={this.state.closedCaptioning}
        />
      default:
        return <div>Unknown state</div>
    }
  }
}
export default App;
