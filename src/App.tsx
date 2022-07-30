import React from 'react';
import MainMenu from './screen/main-menu';
import { Socket } from 'socket.io-client'
import GameMenu from './screen/game-menu';
import { Tile } from './models/models';
import { Game } from './components/game';


// this is the router
class App extends React.Component<
  { socket: Socket | null },
  { screen: string, gameId: string | null, missionId: string | null, map: Tile[][], screenName: string | null }> {
  constructor(props: { socket: Socket | null }) {
    super(props);
    this.state = {
      screen: 'mainmenu',
      gameId: null,
      missionId: null,
      map: [],
      screenName: null
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
  componentWillUnmount() {
    this.props.socket?.removeAllListeners();
  }
  componentDidMount() {
    const socket = this.props.socket;
    if(!socket) return;
    console.log("binding")
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
    })
  }
  setScreenName(name: string | null) {
    this.setState({ screenName: name });
  }
  render() {
    const { screen, gameId, missionId, map, screenName } = this.state;
    const socket = this.props.socket as Socket;
    const setScreen = this.setScreen.bind(this);
    switch(screen) {
      case 'mainmenu':
        return <MainMenu login={(screenName) => {
          socket.emit('login', { name: screenName });
          this.setScreenName(screenName);
        }} />
      case "loggedinmenu":
        return <GameMenu 
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
        return <Game screenName={screenName as string} gameId={gameId as string} missionId={missionId as string} setScreen={setScreen} map={map} />
      default:
        return <div>Unknown state</div>
    }
  }
}
export default App;
