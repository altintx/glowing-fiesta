import React, { ReactElement, useRef, useState } from "react";
import { Tile } from "../models/models";
import { TileInspector } from "../components/tile-inspector";
import { Viewport } from "../components/viewport";
import { Obstacle } from "../components/obstacle";
import { SelectionTile } from "../components/selection-tile";

type Actions = 'select' | 'move' | 'attack' | 'fortify' | 'wait' | 'end_turn' | 'grenade';
type Character = {
  name: string;
  uuid: string;
  class: any;
  race: any;
  faction: any;
}
type Uuid = string;
function isPlayer(occupant: Character | null): boolean {
  return occupant?.faction === 0;
}
export function Game({ 
  setScreen, 
  screenName, 
  gameId, 
  missionId, 
  map, 
  characters,
  language
}: {
  setScreen: (screen: string) => void, 
  screenName: string, 
  gameId: string, 
  missionId: string, 
  map: Tile[][], 
  characters: Record<Uuid, Character>,
  language: string
}) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [rotate, setRotate] = React.useState(45);
  const tileDimensionInt = 64 + zoom * 32;
  const tileDimension = `${tileDimensionInt}px`;
  const zoomOutEnabled = zoom > -1, zoomInEnabled = zoom < 3;
  const [hoverTile, setHoverTile] = React.useState<Tile | null>(null);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [moveDestination, setMoveDestination] = useState<Tile | null>(null);
  const [attackTarget, setAttackTarget] = useState<Tile | null>(null);
  const [action, setAction] = useState<Actions>("select");
  const boardRef = useRef<HTMLDivElement>(null);
  const canSelectTile = (tile: Tile | null) => {
    if(!tile) return true;
    return !!tile.occupant && isPlayer(occupant(tile.occupant));
  }
  const occupant = (id: Uuid): Character | null => id in characters? characters[id] : null;
  const canMoveToTile = (tile: Tile | null) => {
    if(!tile) return false;
    if(selectedTile === null) return false;
    if(tile.occupant) return false;
    const maxMovement = 5;
    const distance = Math.ceil(Math.sqrt(Math.pow(tile.x - selectedTile.x, 2) + Math.pow(tile.y - selectedTile.y, 2)));
    if(distance <= maxMovement) return true;
    return false;
  }
  const canAttackTarget = (tile: Tile | null) => {
    if(!tile) return false;
    if(selectedTile === null) return false;
    if(action === 'attack') {
      // todo: obstacles, throw distance, etc
      const maxMovement = 10;
      const distance = Math.sqrt(Math.pow(tile.x - selectedTile.x, 2) + Math.pow(tile.y - selectedTile.y, 2));
      if(distance <= maxMovement && tile.occupant) return true;
    } else if (action === 'grenade') {
      // todo: obstacles, throw distance, etc
      const maxMovement = 7;
      const distance = Math.sqrt(Math.pow(tile.x - selectedTile.x, 2) + Math.pow(tile.y - selectedTile.y, 2));
      if(distance <= maxMovement) return true;

    }
    return false;
  }
  const rotator = (angle: number): void => {
    if(!(boardRef && boardRef.current)) return;
    const width = boardRef.current.clientWidth;
    const height = boardRef.current.clientHeight;
    setX(width / 2);
    setY(height / 2);
    setRotate((360 + angle + rotate) % 360);
  }
  const ap = 1;
  const grenadeCount = 1;
  const canSelect = canSelectTile(hoverTile);
  const canAttack = !!selectedTile && ap > 0;
  const canMove = selectedTile && ap > 0;
  const canFortify = false; // need cover
  const canEndTurn = ap > 0;
  const canGrenade = !!selectedTile && ap > 0 && grenadeCount > 0;
  const canWait = false;
  const isAttacking = action === "attack" || action === "grenade";
  const isMoving = action === "move";
  const isFortifying = action === "fortify";

  if(map.length === 0) return null;
  const actionBar = <>
    <button disabled={!canMove} onClick={() => setAction('move')}>Move</button>
    <button disabled={!canAttack} onClick={() => setAction('attack')}>Targetted Attack</button>
    <button disabled={!canGrenade} onClick={() => setAction('grenade')}>AOE Attack</button>
    <button disabled={!canWait} onClick={() => setAction('wait')}>Wait</button>
    <button disabled={!canEndTurn} onClick={() => setAction('end_turn')}>End Turn</button>
    <button onClick={() => {
      setAction('select');
      setSelectedTile(null);
    }}>Clear</button>
    <button disabled={!canFortify} onClick={() => setAction('fortify')}>Fortify</button>
  </>;
  const inspector = <TileInspector
    language={language} 
    tile={hoverTile} 
    occupant={occupant(hoverTile?.occupant)} 
  />;
  return <Viewport 
    x={x} 
    y={y} 
    zoom={zoom} 
    setX={setX} 
    setY={setY} 
    setZoom={setZoom} 
    zoomOutEnabled={zoomOutEnabled} 
    zoomInEnabled={zoomInEnabled} 
    rotate={rotate} 
    setRotate={rotator} 
    onGameMenu={() => setScreen('gamemenu')}
    actionBar={actionBar}
    boardRef={boardRef}
    inspector={inspector}
    onMouseMove={(e) => {
      if(!boardRef.current) return;
      const [mouseX, mouseY] = [e.clientX, e.clientY];
      const [transformX, transformY] = [mouseX - x, mouseY - y];
      let point = new DOMPoint(transformX,transformY);
      const matrix = new DOMMatrix(window.getComputedStyle(boardRef.current).transform);
      matrix.invertSelf();
      point = matrix.transformPoint(point);
      const [tileX, tileY] = [Math.floor(point.x / tileDimensionInt), Math.floor(point.y / tileDimensionInt)];
      if(tileY in map && tileX in map[tileY]) setHoverTile(map[tileY][tileX]);
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
          const hovered = cell === hoverTile;
          return cell['textures'].map((texture): ReactElement | null => 
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
                return css;
              })()}
            />
          ).concat(cell.occupant? 
            (typeof cell.occupant === "string"?
              <img
                src="marker.png" 
                className='tile'
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

            // primary selection
            <SelectionTile 
              enabled={canSelect && hovered}
              borderColor="#ffffff"
              x={cellIndex + 1}
              y={rowIndex + 1}
              size={tileDimension}
              borderThrob={true}
              onClick={() => setSelectedTile(cell)}
            />,
            <SelectionTile 
              enabled={cell === selectedTile}
              borderColor="#0000ff"
              x={cellIndex + 1}
              y={rowIndex + 1}
              size={tileDimension}
              onClick={() => setSelectedTile(null)}
            />,
            // todo: secondary selection.

            // attacking sub-selection
            <SelectionTile 
              enabled={isAttacking && canAttackTarget(cell)}
              x={cellIndex+1}
              y={rowIndex+1}
              size={tileDimension}
              tint="#ff0000"
              borderThrob={hovered}
            />,
            // moving sub-selection
            <SelectionTile 
              enabled={isMoving && canMoveToTile(cell)}
              tint="#00ff00"
              x={cellIndex+1}
              y={rowIndex+1}
              size={tileDimension}
              borderThrob={hovered}
            />,
          ).filter(v => v)
          })
      )}
    </div>
  </Viewport>;
}
