import React from 'react';
import MainMenu from './screen/main-menu';
import { Socket } from 'socket.io-client'
import GameMenu from './screen/game-menu';

type Texture = {
  graphic: string;
  offset: number[];
  animation: any[];
}
type Tile = {
  cover: 'None' | 'Full' | 'Half';
  elevation: number;
  occupant: any;
  openable: boolean;
  textures: Texture[];
  type: any;
  x: number;
  y: number;
}

function TileInspector({tile }: { tile: Tile | null }) {
  return <div style={{position:'absolute', bottom: 0, right: 0, textAlign: 'right', width: '10em',height:'7em'}}>
    {tile && <>
      <div>cover: {tile.cover}</div>
      <div>elevation: {tile.elevation}</div>
      <div>occupant: {tile.occupant}</div>
      <div>openable: {tile.openable? 'true': 'false'}</div>
      <div>type: {tile.type}</div>
      {/* <div>pos: ({tile.x}, {tile.y})</div> */}
    </>}
    {!tile && <>
      <div>no selection</div>
    </>}
  </div>
}

function Viewport({
  children, 
  x, 
  y, 
  zoom, 
  setX, 
  setY, 
  setZoom, 
  zoomOutEnabled, 
  zoomInEnabled,
  rotate,
  setRotate,
  onGameMenu,
  onMouseMove
}: {
  children: React.ReactNode, 
  x: number, 
  y: number, 
  zoom: number, 
  rotate: number, 
  setX: (x: number) => void, 
  setY: (y: number) => void, 
  setZoom: (zoom: number) => void, 
  setRotate: (x: number) => void, 
  onMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  zoomOutEnabled: boolean, 
  zoomInEnabled: boolean,
  onGameMenu: () => void
}) {
  return <div
    style={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden', 
      position: 'relative' 
    }}
    onMouseMove={onMouseMove}>
    <div style={{
      zIndex: 1,
      rotate:`${rotate}deg`,
      transformOrigin: 'center',
      left:`${x}px`, 
      top: `${y}px`,
      width: '100%',
      height: '100%',
      position:'absolute'}}>{children}</div>
    <div style={{position:"absolute",zIndex:1000}}>
      <button onClick={onGameMenu}>Menu</button>
      <button onClick={() => {
        setRotate((rotate + 270) % 360);
        // setY(y - 32);
      }}>Rotate Left</button>
      <button onClick={() => {
        setX(x - 32);
        // setY(y - 32);
      }}>Right</button>
      <button onClick={() => {
        setX(x + 32);
        // setY(y - 32);
      }}>Left</button>
      <button onClick={() => {
        // setX(x - 32);
        setY(y + 32);
      }}>Up</button>
      <button onClick={() => {
        // setX(x + 32);
        setY(y - 32);
      }}>Down</button>
      <button disabled={!zoomInEnabled} onClick={() => {
        setZoom(zoom + 1);
      }}>Z In</button>
      <button disabled={!zoomOutEnabled} onClick={() => {
        setZoom(zoom -1);
      }}>Z Out</button>
      <button onClick={() => {
        setRotate((rotate + 90) % 360);
        // setY(y - 32);
      }}>Rotate Right</button>
    </div>
  </div>;
}
function Game({ setScreen, screenName, gameId, missionId, map }: { setScreen: (screen: string) => void, screenName: string, gameId: string, missionId: string, map: Tile[][] }) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [rotate, setRotate] = React.useState(45);
  const tileDimensionInt = 32 + zoom * 16;
  const tileDimension = `${tileDimensionInt}px`;
  const zoomOutEnabled = zoom > -1, zoomInEnabled = zoom < 3;
  const [activeTile, setActiveTile] = React.useState<Tile | null>(null);
  if(map.length === 0) return null;
  return <>
    <Viewport 
      x={x} 
      y={y} 
      zoom={zoom} 
      setX={setX} 
      setY={setY} 
      setZoom={setZoom} 
      zoomOutEnabled={zoomOutEnabled} 
      zoomInEnabled={zoomInEnabled} 
      rotate={rotate} 
      setRotate={setRotate} 
      onGameMenu={() => setScreen('gamemenu')}
      onMouseMove={(e) => {
        const [mouseX, mouseY] = [e.clientX, e.clientY];
        const [transformX, transformY] = [mouseX - x, mouseY - y];
        const [cellX, cellY] = [Math.floor(transformX / tileDimensionInt), Math.floor(transformY / tileDimensionInt)];
        const [originX, originY] = [0,0];
        const [worldY, worldX] = [(cellY - originY) + (cellX - originX), (cellY - originY) - (cellX + originX)];
        console.log(cellX, cellY);
        // 594,513

        // setActiveTile(map[Math.floor(gridY)][Math.floor(gridX)])
      }}>
      <div style={{
        display:'grid',
        gridAutoColumns: `1fr`,
        gridAutoRows: `1fr`,
        gap: 0,
        width: `${map[0].length * (tileDimensionInt)}px`,
        height: `${map.length * (tileDimensionInt)}px`,
      }}>
        {map.map((row, rowIndex) =>
          row.map((cell, cellIndex) => 
            cell['textures'].map((texture, textureIndex) => 
              <img 
                className="tile"
                src={`thethirdsequence/${texture.graphic}512.jpg`} 
                style={(() => {
                  const css = {
                    gridColumn: `${cellIndex + 1}`,
                    gridRow: `${rowIndex + 1}`,
                    width: tileDimension,
                    height: tileDimension,
                  };
                  // if(cell == activeTile) {
                  //   css['border'] = "1px solid red";
                  // }
                  return css;
                })()}
              />
            )
          )
        )}
      </div>
    </Viewport>
    <TileInspector tile={activeTile} />
  </>;
}

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
    if(this.props.socket) console.log("unbinding")
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
