import React from 'react';

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
  