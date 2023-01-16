import React, { useState } from 'react';
import { Caption } from './caption';
import { primaryInput } from 'detect-it';
import { RadioButton } from './radio-button';

const offsetSize = (isTouch: boolean) => isTouch ? "60px": 0;

export function Viewport({
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
  onMouseMove,
  actionBar,
  boardRef,
  feedback,
  inspector,
  floats,
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
  onGameMenu: () => void,
  actionBar?: React.ReactNode,
  boardRef: React.Ref<HTMLDivElement>,
  inspector?: React.ReactNode,
  floats?: React.ReactNode[],
  feedback?: string,
}) {
  const [isTouch, setIsTouch] = useState(primaryInput === 'touch');
  const offset = offsetSize(isTouch);
  return <div
    style={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
    {feedback && <Caption>{feedback}</Caption>}
    <div
      ref={boardRef}
      onMouseMove={onMouseMove}
      style={{
        zIndex: 1,
        transform:`rotate(${rotate}deg)`, // TODO: perspective(1000px) rotateX(50deg) creates a cool 3d effect on
                                          //       landscape but breaks selection transformations and sprites
        transformOrigin: 'top left',
        transition: 'transform 0.5s, left 0.25s, top 0.25s',
        left:`${x}px`, 
        top: `${y}px`,
        width: '100%',
        height: '100%',
        position:'absolute'
    }}>{children}</div>
    {isTouch && <button style={{position:"absolute",left:0,width:offset,bottom:0,top:0,zIndex:10000}} onClick={() => setX(x + 64)}> </button>}
    {isTouch && <button style={{position:"absolute",left:0,top:0,right:0,height:offset,zIndex:10000}} onClick={() => setY(y + 64)}> </button>}
    {isTouch && <button style={{position:"absolute",left:0,bottom:0,right:0,height:offset,zIndex:10000}} onClick={() => setY(y - 64)}> </button>}
    {isTouch && <button style={{position:"absolute",top:0,right:0,bottom:0,width:offset,zIndex:10000}} onClick={() => setX(x - 64)}> </button>}
    {actionBar && <div style={{
        bottom: 0,
        position: 'absolute',
        zIndex: 1000
      }}>{actionBar}</div>}
    {inspector}
    {floats}
    <div style={{position:"absolute",bottom:offset,right:offset,zIndex:1000}}>
      <button onClick={onGameMenu}>Menu</button>
      <RadioButton selectedValue="touch" value={isTouch? "touch": "mouse"} onClick={() => setIsTouch(!isTouch)}>Touch Controls</RadioButton>
      <button disabled={!zoomInEnabled} onClick={() => setZoom(zoom + 1)}>Z In</button>
      <button disabled={!zoomOutEnabled} onClick={() => setZoom(zoom -1)}>Z Out</button>
    </div>
  </div>;
}
