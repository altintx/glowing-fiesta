import React, { ReactElement, useEffect, useRef } from "react";
import { Operator } from "../models/operator";
import { Tile } from "../models/tile";
import { Character } from "../models/character";
import { Uuid } from "../models/uuid";
import { OperatorArrows } from "../models/operator_arrows";
import { TileInspector } from "../components/tile-inspector";
import { Viewport } from "../components/viewport";
import { SelectionTile } from "../components/selection-tile";
import { LocalizedString } from "../components/localized-string";
import { RadioButton } from "../components/radio-button";
import { Map } from "../components/map";
import { Background } from "../components/clouds";

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
  action,
  doAction,
  closedCaptioning,
}: {
  setScreen: (screen: string) => void, 
  operator: Operator, 
  gameId: string, 
  missionId: string, 
  map: Tile[][], 
  characters: Record<Uuid, Character>,
  language: string,
  operatorArrows: OperatorArrows[],
  communicateTileFocus: (x: number, y: number, tile: Tile | null, mode: string) => void,
  availableActions: any[],
  setAction: (action: any, x: number, y: number) => void,
  action: any,
  doAction: (action: any, origin: Tile, destination: Tile) => void,
  closedCaptioning?: string,
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
  const propsAction = action;
  useEffect(() => {
    window.document.body.classList.add('wooden-background');
    return () => {
      window.document.body.classList.remove('wooden-background');
    }
  }, []);
  
  const selectedTile = selectedTiles.find(() => true);
  const occupant = (id: Uuid): Character | null => id in characters? characters[id] : null;
  const rotator = (angle: number): void => {
    if(!(boardRef && boardRef.current)) return;
    const newAngle = (rotate + 360 + angle) % 360;
    const oldAngle = (rotate + 360) % 360;
    switch(true) {
      case(newAngle === 45 && [315,135].includes(oldAngle)):
        break;
      case(newAngle === 135 && [45,225].includes(oldAngle)):
        break;
      case(newAngle === 225 && [135,315].includes(oldAngle)):
        break;
      case(newAngle === 315 && [225,45].includes(oldAngle)):
        break;
    }
    setRotate(angle + rotate);
  }
  const setSelectedTile = (tile: Tile, clear = false): void => {
    communicateTileFocus(tile.x, tile.y, map[tile.y][tile.x], clear? 'clear': 'select')
  }

  const canSelectTile = (tile: Tile): boolean => {
    return tile.occupant && isPlayer(occupant(tile.occupant));
  }
  const canSubSelectTile = (tile: Tile): boolean => {
    return highlightedTiles.map(arrow => arrow.tile.uuid).includes(tile.uuid);
  }

  if(map.length === 0) return null;
  const inspector = <>{hoverTiles.map(arrow => <TileInspector
    language={language} 
    tile={arrow.tile} 
    occupant={occupant(arrow.tile.occupant)} 
  />)}</>;
  const updateTileFocus2d = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
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
  }
  const maybeScroll = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if(!boardRef.current) return;
    const [mouseX, mouseY] = [e.clientX, e.clientY];
    if(mouseX < 20 || mouseX > boardRef.current.clientWidth - 20 || mouseY < 20 || mouseY > boardRef.current.clientHeight - 120) {
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
  }
  return <><Viewport 
    x={x} y={y} setX={setX} setY={setY} zoom={zoom} setZoom={setZoom} 
    zoomOutEnabled={zoomOutEnabled}  zoomInEnabled={zoomInEnabled} 
    rotate={rotate} setRotate={rotator} 
    onGameMenu={() => setScreen('loggedinmenu')}
    feedback={closedCaptioning}
    boardRef={boardRef} inspector={inspector}
    floats={[
      selectedTiles.length && availableActions && "length" in availableActions?
        <div 
          style={{
            position:'absolute',
            width: `16em`,
            top: `${(selectedTiles[0].tile.y) * tileDimensionInt - tileDimensionInt / 2}px`,
            left: `${(selectedTiles[0].tile.x + 3/2) * tileDimensionInt - tileDimensionInt / 2}px`,
            zIndex: 1000,
          }}
        ><div
          style={{position: 'relative'}}
          onMouseMove={e => {
            e.stopPropagation();
            communicateTileFocus(-1, -1, null, 'hover');
          }}
        >{availableActions.map((action, index) => (
          <RadioButton
            selectedValue={propsAction?.uuid}
            value={action.uuid}
            style={{
              width: '100%',
              position: 'absolute',
              height: '2em',
              overflow: 'hidden',
              top: `${index*2}em`
            }}
            onClick={(e) => {
              selectedTile && setAction(action, selectedTile.tile.x, selectedTile.tile.y);
              e.preventDefault();
              e.stopPropagation();
            }}
            ><LocalizedString
              translations={action.name}
              language={language}
            />
          </RadioButton>
        ))}</div></div>
      :
        null
    ]}
    onMouseMove={(e) => {
      updateTileFocus2d(e);
      maybeScroll(e);
    }}>
    <Map map={map} counterRotate={rotate} tileDimensionInt={tileDimensionInt} augments={(cellIndex: number, rowIndex: number, cell: Tile): Array<null | ReactElement | JSX.Element> => {
      const hovered = hoverTiles.map(a => a.tile.uuid).includes(cell.uuid);
      const selected = selectedTiles.map(a => a.tile.uuid).includes(cell.uuid);
      const highlight = highlightedTiles.map(a => a.tile.uuid).includes(cell.uuid);
      
      return ([] as Array<null | ReactElement | JSX.Element>).concat(cell.occupant && typeof cell.occupant === "string"?
        <img
          src="marker.png" 
          className='tile'
          alt="marker"
          key={`player-token-${cell.occupant}`}
          style={{
            gridColumn: `${cellIndex + 1}`,
            gridRow: `${rowIndex + 1}`,
            width: tileDimension,
            height: tileDimension,
            rotate: `-${rotate}deg`
          }}
        /> : null,

        // hoverstate
        canSelectTile(cell)? <SelectionTile 
          enabled={hovered}
          key={`hover-${cell.uuid}`}
          borderColor="rgba(255,255,255,0.5)"
          x={cellIndex}
          y={rowIndex}
          size={tileDimension}
          borderThrob={true}
          onClick={() => setSelectedTile(cell)}
        />: null,
        // selected state
        <SelectionTile 
          enabled={selected}
          key={`selected-${cell.uuid}`}
          borderColor="rgba(64,255,64,0.5)"
          x={cellIndex}
          y={rowIndex}
          size={tileDimension}
          borderThrob={true}
          onClick={() => setSelectedTile(cell, true)}
        />,

        <SelectionTile
          enabled={highlight}
          tint="#ff0000"
          key={`aoe-${cell.uuid}`}
          borderColor="rgba(255,255,255,1)"
          x={cellIndex}
          cursor={action && selected && action.cursor}
          y={rowIndex}
          size={tileDimension}
          zoom={zoom}
          borderThrob={hovered && canSubSelectTile(cell)}
          onClick={() => selectedTile && doAction(action, selectedTile.tile, cell)}
        />,
      )
    }} />
  </Viewport><Background /></>;
}
