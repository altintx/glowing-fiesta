import React from 'react';
import MainMenu from './screen/main-menu';
import { Socket } from 'socket.io-client'
import GameMenu from './screen/game-menu';
import { Tile } from './models/models';
import { Game } from './screen/game';


// this is the router
class App extends React.Component<
  { socket: Socket | null },
  { 
    screen: string, 
    gameId: string | null, 
    missionId: string | null, 
    map: Tile[][], 
    screenName: string | null, 
    characters: Record<string, any>, 
    connected: boolean, 
    acceptLanguage: string
  }
> {
  constructor(props: { socket: Socket | null }) {
    super(props);
    this.state = {
      screen: 'mainmenu',
      gameId: null,
      missionId: null,
      map: [],
      screenName: null,
      characters: {},
      connected: false,
      acceptLanguage: 'en'
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
    if(!socket) return;
    console.log("binding")
    socket.on("hello", ({language}) => {
      this.setState({ connected: true, acceptLanguage: language });
    })
    socket.on('you_logged_in', (response) => {
      console.log("you logged in");
      // todo: response really ought to include the assigned screen name
      this.setScreen('loggedinmenu');
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
        if(window.confirm("Start mission?")) {
          socket.emit("start_next_mission", 0);
        }
      }
    })
    socket.on('mission_info', (response) => {
      console.log('mission_info');
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
    socket.on("characters_info", (response) => {
      console.log("characters_info info");
      console.log(response);
      this.setCharacters(response);
    });
    socket.emit("hello");
  }
  setScreenName(name: string | null) {
    this.setState({ screenName: name });
  }
  render() {
    const { screen, gameId, missionId, map, screenName, characters, connected, acceptLanguage } = this.state;
    if(!connected) return <div>Connecting</div>;
    const socket = this.props.socket as Socket;
    const setScreen = this.setScreen.bind(this);
    switch(screen) {
      case 'mainmenu':
        return <MainMenu language={acceptLanguage} login={(screenName) => {
          socket.emit('login', { name: screenName });
          this.setScreenName(screenName);
        }} />
      case "loggedinmenu":
        return <GameMenu 
          language={acceptLanguage}
          screenName={screenName as string}
          onNewGame={() => socket.emit('new_game')}
          onLogOut={() => {
            this.setScreen("mainmenu");
            this.setScreenName(null);
          }}
          onFindGame={() => {
          }}
          onOptions={() => {
          }}
        />
      case "game":
        return <Game 
          language={acceptLanguage}
          screenName={screenName as string} 
          gameId={gameId as string} 
          missionId={missionId as string} 
          setScreen={setScreen} 
          map={map} 
          characters={characters} 
        />
      default:
        return <div>Unknown state</div>
    }
  }
}
export default App;
