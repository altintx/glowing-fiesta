import React, { ReactElement, useState } from "react";
import { Tile } from "../models/models";
import { TileInspector } from "../components/tile-inspector";
import { Viewport } from "../components/viewport";

type Actions = 'select' | 'move' | 'rotate' | 'zoom' | 'none' | 'attack';

export function Game({ setScreen, screenName, gameId, missionId, map }: { setScreen: (screen: string) => void, screenName: string, gameId: string, missionId: string, map: Tile[][] }) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [rotate, setRotate] = React.useState(0);
  const tileDimensionInt = 32 + zoom * 16;
  const tileDimension = `${tileDimensionInt}px`;
  const zoomOutEnabled = zoom > -1, zoomInEnabled = zoom < 3;
  const [hoverTile, setHoverTile] = React.useState<Tile | null>(null);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [moveDestination, setMoveDestination] = useState<Tile | null>(null);
  const [attackTarget, setAttackTarget] = useState<Tile | null>(null);
  const [action, setAction] = useState<Actions>("select");
  const canSelectTile = (tile: Tile | null) => {
    if(!tile) return true;
    return !!tile.occupant;
  }
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
    // todo: obstacles, throw distance, etc
    const maxMovement = 10;
    const distance = Math.sqrt(Math.pow(tile.x - selectedTile.x, 2) + Math.pow(tile.y - selectedTile.y, 2));
    if(distance <= maxMovement) return true;
    return false;
  }
  const canSelect = canSelectTile(hoverTile);
  const canAttack = selectedTile && canAttackTarget(hoverTile);
  const canMove = selectedTile && canMoveToTile(hoverTile);
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
        setHoverTile(map[Math.floor(cellY)][Math.floor(cellX)])
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
            cell['textures'].map((texture, textureIndex): ReactElement | null => 
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
              <img
                src="marker.png" 
                className='tile'
                style={{
                  gridColumn: `${cellIndex + 1}`,
                  gridRow: `${rowIndex + 1}`,
                  width: tileDimension,
                  height: tileDimension,
                }}
              /> : null,
              canSelect && cell === hoverTile? (<div
                className="focus_box focus_box_red"
                onClick={() => setSelectedTile(cell)}
                // this ought to prompt for an action
                style={{
                  gridColumn: `${cellIndex + 1}`,
                  gridRow: `${rowIndex + 1}`,
                  width: tileDimension,
                  height: tileDimension,
                }} />): null,
              cell === selectedTile? (<div
                className="focus_box focus_box_blue"
                onClick={() => setSelectedTile(null)}
                style={{
                  gridColumn: `${cellIndex + 1}`,
                  gridRow: `${rowIndex + 1}`,
                  width: tileDimension,
                  height: tileDimension,
                }} />): null,
              (canAttack && cell === hoverTile)? (<div
                className="focus_box focus_box_attack"
                onClick={() => setSelectedTile(null)}
                style={{
                  gridColumn: `${cellIndex + 1}`,
                  gridRow: `${rowIndex + 1}`,
                  width: tileDimension,
                  height: tileDimension,
                }} />): null,
              (canMove && cell === hoverTile)? (<div
                className="focus_box focus_box_green"
                onClick={() => setSelectedTile(null)}
                style={{
                  gridColumn: `${cellIndex + 1}`,
                  gridRow: `${rowIndex + 1}`,
                  width: tileDimension,
                  height: tileDimension,
                }} />): null
  
            ).filter(v => v)
          )
        )}
      </div>
    </Viewport>
    <TileInspector tile={hoverTile} />
  </>;
}
