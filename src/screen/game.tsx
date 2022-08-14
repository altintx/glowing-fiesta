import React, { ReactElement, useRef } from "react";
import { Operator, Tile } from "../models/models";
import { TileInspector } from "../components/tile-inspector";
import { Viewport } from "../components/viewport";
import { Obstacle } from "../components/obstacle";
import { SelectionTile } from "../components/selection-tile";
import { LocalizedString } from "../components/localized-string";

type Character = {
  name: string;
  uuid: string;
  class: any;
  race: any;
  faction: any;
}

type OperatorArrows = {
  operator: Operator;
  tile: Tile;
  mode: string;
}
type Uuid = string;
function isPlayer(occupant: Character | null): boolean {
  return occupant?.faction === 0;
}
export function Game({ 
  setScreen, 
  operator, 
  gameId, 
  missionId, 
  map, 
  characters,
  language,
  operatorArrows,
  communicateTileFocus,
  availableActions,
  setAction,
}: {
  setScreen: (screen: string) => void, 
  operator: Operator, 
  gameId: string, 
  missionId: string, 
  map: Tile[][], 
  characters: Record<Uuid, Character>,
  language: string,
  operatorArrows: OperatorArrows[],
  communicateTileFocus: (x: number, y: number, tile: Tile, mode: string) => void,
  availableActions: any[],
  setAction: (action: any, x: number, y: number) => void,
}) {
  const [[x, setX], [y, setY]] = [React.useState(0), React.useState(0)];
  const [zoom, setZoom] = React.useState(1);
  const [rotate, setRotate] = React.useState(45);
  const tileDimensionInt = 64 + zoom * 32;
  const tileDimension = `${tileDimensionInt}px`;
  const zoomOutEnabled = zoom > -1, zoomInEnabled = zoom < 3;
  const boardRef = useRef<HTMLDivElement>(null);
  const hoverTiles = operatorArrows.filter(arrow => arrow.mode === 'hover');
  const selectedTiles = operatorArrows.filter(arrow => arrow.mode === 'select');
  const highlightedTiles = operatorArrows.filter(arrow => arrow.mode === 'possible-destination');
  
  const selectedTile = selectedTiles.find(() => true);
  const occupant = (id: Uuid): Character | null => id in characters? characters[id] : null;
  const rotator = (angle: number): void => {
    if(!(boardRef && boardRef.current)) return;
    const width = boardRef.current.clientWidth;
    const height = boardRef.current.clientHeight;
    setX(width / 2);
    setY(height / 2);
    setRotate((360 + angle + rotate) % 360);
  }
  const setSelectedTile = (tile: Tile, clear = false): void => {
    // operator?.socket?.emit('tile_interaction', { tile, mode: 'select', operator: operator });
    communicateTileFocus(tile.x, tile.y, map[tile.y][tile.x], clear? 'clear': 'select')
  }

  const canSelectTile = (tile: Tile): boolean => {
    return tile.occupant && isPlayer(occupant(tile.occupant));
  }

  if(map.length === 0) return null;
  const inspector = <>{hoverTiles.map(arrow => <TileInspector
    language={language} 
    tile={arrow.tile} 
    occupant={occupant(arrow.tile.occupant)} 
  />)}</>;
  return <Viewport 
    x={x} y={y} setX={setX} setY={setY} zoom={zoom} setZoom={setZoom} 
    zoomOutEnabled={zoomOutEnabled}  zoomInEnabled={zoomInEnabled} 
    rotate={rotate} setRotate={rotator} 
    onGameMenu={() => setScreen('gamemenu')}
    actionBar={<>{availableActions && "length" in availableActions && availableActions.map(action => (
      <button onClick={() => selectedTile && setAction(action, selectedTile.tile.x, selectedTile?.tile.y)}><LocalizedString translations={action.name} language={language} /></button>
    ))}</>}
    boardRef={boardRef} inspector={inspector}
    onMouseMove={(e) => {
      if(!boardRef.current) return;
      const [mouseX, mouseY] = [e.clientX, e.clientY];
      const [transformX, transformY] = [mouseX - x, mouseY - y];
      let point = new DOMPoint(transformX,transformY);
      const matrix = new DOMMatrix(window.getComputedStyle(boardRef.current).transform);
      matrix.invertSelf();
      point = matrix.transformPoint(point);
      const [tileX, tileY] = [Math.floor(point.x / tileDimensionInt), Math.floor(point.y / tileDimensionInt)];
      if(tileY in map && tileX in map[tileY] && !hoverTiles.map(arrow => arrow.tile).includes(map[tileY][tileX])) {
        communicateTileFocus(tileX, tileY, map[tileY][tileX], 'hover');
      }
      if(mouseX < 20 || mouseX > boardRef.current.clientWidth - 20 || mouseY < 20 || mouseY > boardRef.current.clientHeight - 20) {
        if(mouseX < 20) {
          setX(x + 20);
        }
        if(mouseX > boardRef.current.clientWidth - 20) {
          setX(x - 20);
        }
        if(mouseY < 20) {
          setY(y + 20);
        }
        if(mouseY > boardRef.current.clientHeight - 20) {
          setY(y - 20);
        }
      }
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
        row.map((cell, cellIndex) => {
          const hovered = hoverTiles.map(a => a.tile.uuid).includes(cell.uuid);
          const selected = selectedTiles.map(a => a.tile.uuid).includes(cell.uuid);
          const highlight = highlightedTiles.map(a => a.tile.uuid).includes(cell.uuid);
          return cell['textures'].map((texture): ReactElement | null => 
            <img 
              className="tile"
              src={`thethirdsequence/${texture.graphic}512.jpg`}
              alt={texture.graphic}
              style={(() => {
                const css = {
                  gridColumn: `${cellIndex + 1}`,
                  gridRow: `${rowIndex + 1}`,
                  width: tileDimension,
                  height: tileDimension,
                };
                return css;
              })()}
            />
          ).concat(cell.occupant? 
            (typeof cell.occupant === "string"?
              <img
                src="marker.png" 
                className='tile'
                alt="marker "
                style={{
                  gridColumn: `${cellIndex + 1}`,
                  gridRow: `${rowIndex + 1}`,
                  width: tileDimension,
                  height: tileDimension,
                  rotate: `-${rotate}deg`
                }}
              /> : <Obstacle
                {...cell.occupant} 
                row={rowIndex + 1}
                column={cellIndex + 1}
                tileDimension={tileDimensionInt}
                rotate={rotate}
              />) : null,

            // hoverstate
            canSelectTile(cell)? <SelectionTile 
              enabled={hovered}
              borderColor="rgba(255,255,255,0.5)"
              x={cellIndex + 1}
              y={rowIndex + 1}
              size={tileDimension}
              borderThrob={true}
              onClick={() => setSelectedTile(cell)}
            />: null,
            // selected state
            <SelectionTile 
              enabled={selected}
              borderColor="rgba(64,255,64,0.5)"
              x={cellIndex + 1}
              y={rowIndex + 1}
              size={tileDimension}
              borderThrob={true}
              onClick={() => setSelectedTile(cell, true)}
            />,

            <SelectionTile
              enabled={highlight}
              tint="#ff0000"
              x={cellIndex + 1}
              y={rowIndex + 1}
              size={tileDimension}
              borderThrob={false}
              onClick={() => console.log("should actually do action!!!")}
            />
            
          ).filter(v => v)
          })
      )}
    </div>
  </Viewport>;
}
