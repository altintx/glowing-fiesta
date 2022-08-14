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
  onMouseMove,
  actionBar,
  boardRef,
  inspector,
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
  inspector?: React.ReactNode
}) {
  return <div
    style={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
    <div
      ref={boardRef}
      onMouseMove={onMouseMove}
      style={{
        zIndex: 1,
        transform:`rotate(${rotate}deg)`,
        transformOrigin: 'top left',
        left:`${x}px`, 
        top: `${y}px`,
        width: '100%',
        height: '100%',
        position:'absolute'
    }}>{children}</div>
    {actionBar && <div style={{
        bottom: 0,
        position: 'absolute',
        zIndex: 1000
      }}>{actionBar}</div>}
    {inspector}
    <div style={{position:"absolute",bottom:0,right:0,zIndex:1000}}>
      <button onClick={onGameMenu}>Menu</button>
      <button onClick={() => setRotate(-90)}>Rotate Left</button>
      <button onClick={() => setX(x + 32)}>Left</button>
      <button onClick={() => setY(y + 32)}>Up</button>
      <button onClick={() => setY(y - 32)}>Down</button>
      <button disabled={!zoomInEnabled} onClick={() => setZoom(zoom + 1)}>Z In</button>
      <button disabled={!zoomOutEnabled} onClick={() => setZoom(zoom -1)}>Z Out</button>
      <button onClick={() => setX(x - 32)}>Right</button>
      <button onClick={() => setRotate(90)}>Rotate Right</button>
    </div>
  </div>;
}
