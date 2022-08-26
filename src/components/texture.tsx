import React, { useEffect } from 'react';
import { useRef } from 'react';
import { Tile, Texture } from '../models/models';

function roundTopLeftCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === 0) {
    return false
  }
  if(columnIndex === 0) {
    return false
  }
  const left = map[rowIndex][columnIndex - 1];
  const top = map[rowIndex - 1][columnIndex];
  return (left.textures[0].graphic === top.textures[0].graphic) && (left.textures[0].graphic !== cell.textures[0].graphic);
}

function roundTopRightCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === 0) {
    return false
  }
  if(columnIndex === map[0].length - 1) {
    return false
  }
  const right = map[rowIndex][columnIndex + 1];
  const top = map[rowIndex - 1][columnIndex];
  return (right.textures[0].graphic === top.textures[0].graphic) && (right.textures[0].graphic !== cell.textures[0].graphic);
}

function roundBottomLeftCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === map.length - 1) {
    return false
  }
  if(columnIndex === 0) {
    return false
  }
  const left = map[rowIndex][columnIndex - 1];
  const bottom = map[rowIndex + 1][columnIndex];
  return (left.textures[0].graphic === bottom.textures[0].graphic) && (left.textures[0].graphic !== cell.textures[0].graphic);
}

function roundBottomRightCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === map.length - 1)  {
    return false
  }
  if(columnIndex === map[map[rowIndex].length - 1].length - 1) {
    return false
  }
  const right = map[rowIndex][columnIndex + 1];
  const bottom = map[rowIndex + 1][columnIndex];
  return (right.textures[0].graphic === bottom.textures[0].graphic) && (right.textures[0].graphic !== cell.textures[0].graphic);
}

function roundCell(rowIndex: number, columnIndex: number, map: Tile[][], css: React.CSSProperties): React.CSSProperties {
  let newCss: React.CSSProperties = Object.assign({}, css);
  if (roundTopLeftCell(rowIndex, columnIndex, map)) {
    newCss.borderTopLeftRadius = "1em";
  }
  if (roundTopRightCell(rowIndex, columnIndex, map)) {
    newCss.borderTopRightRadius = "1em";
  }
  if (roundBottomLeftCell(rowIndex, columnIndex, map)) {
    newCss.borderBottomLeftRadius = "1em";
  }
  if (roundBottomRightCell(rowIndex, columnIndex, map)) {
    newCss.borderBottomRightRadius = "1em";
  }
  return newCss;
}

function raggedOrthogonalCell(rowIndex: number, columnIndex: number, xOffset: number, yOffset: number, map: Tile[][]): boolean {
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === 0 && yOffset < 0) {
    return false
  }
  if(columnIndex === 0 && xOffset < 0) {
    return false
  }
  if(rowIndex === map.length - 1 && yOffset > 0) {
    return false
  }
  if(columnIndex === map[0].length - 1 && xOffset > 0) {
    return false
  }
  const neighbor = map[rowIndex + yOffset][columnIndex + xOffset];
  return (neighbor.textures[0].graphic !== cell.textures[0].graphic);
}

export function AnimationTexture({ graphic, direction, ms, width, height }: { graphic: string, direction: string, ms: number, width: string, height: string }) {
  const heightInt = parseInt(height);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.count("useeffect");
    if(!globalThis.highPerf) return;
    const initialMarginTop = heightInt + Math.floor(Math.random() * heightInt);
    console.log(initialMarginTop);
    ref.current?.animate([
      { marginTop: `-${initialMarginTop}px`, opacity: 0.3 },
      { marginTop: 0, opacity: 0.8 },
    ], {
      duration: ms,
      iterations: Infinity,
    });
  }, [ms, ref.current]);

  return <div style={{
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.2,
  }} ref={ref}>
    <img src={`thethirdsequence/${graphic}.png`} alt={graphic} style={{ width: width, height: height }} />
    <img src={`thethirdsequence/${graphic}.png`} alt={graphic} style={{ width: width, height: height }} />
  </div>;
}

export function TextureElement({texture, rowIndex, cellIndex, map, tileDimension}: {texture: Texture, rowIndex: number, cellIndex: number, map: Tile[][], tileDimension: string}) {
  <img
    className="tile"
    src={`thethirdsequence/${texture.graphic}512.jpg`}
    alt={texture.graphic}
    style={((): React.CSSProperties => {
      return roundCell(rowIndex, cellIndex, map, {
        gridColumn: `${cellIndex + 1}`,
        gridRow: `${rowIndex + 1}`,
        width: tileDimension,
        height: tileDimension,
      });
    })()}
  />
}

export function CompositeTextureElement({ rowIndex, cellIndex, map, tileDimension}: {rowIndex: number, cellIndex: number, map: Tile[][], tileDimension: string}) {
  const background = useRef<string | undefined>(undefined);
  const paths = useRef<number[][]>([]);
  useEffect(() => {
    if(roundTopLeftCell(rowIndex, cellIndex, map) && rowIndex > 0 && cellIndex > 0) {
      background.current = map[rowIndex - 1][cellIndex - 1].textures[0].graphic;
    }
    if(roundTopRightCell(rowIndex, cellIndex, map) && rowIndex > 0 && cellIndex < map[0].length - 1) {
      background.current = map[rowIndex - 1][cellIndex + 1].textures[0].graphic;
    }
    if(roundBottomLeftCell(rowIndex, cellIndex, map) && rowIndex < map.length - 1 && cellIndex > 0) {
      background.current = map[rowIndex + 1][cellIndex - 1].textures[0].graphic;
    }
    if(roundBottomRightCell(rowIndex, cellIndex, map) && rowIndex < map.length - 1 && cellIndex < map[0].length - 1) {
      background.current = map[rowIndex + 1][cellIndex + 1].textures[0].graphic;
    }
    paths.current = [[0,-1],[1,0],[0,1],[-1,0]].reduce<number[][]>((paths, [xOffset,yOffset]) => {
      const ragged = raggedOrthogonalCell(rowIndex, cellIndex, xOffset, yOffset, map);
      if(!background.current && ragged) {
        background.current = map[rowIndex + yOffset][cellIndex + xOffset].textures[0].graphic;
      }
      switch(true) {
        case (xOffset === 0 && yOffset === -1): // top
          paths.push([0,0]);
          if(ragged) {
            for(let x = 10 * Math.floor(Math.random() * 10); x < 100; x+=Math.floor(10*Math.random())) {
              paths.push([x,-5+Math.floor(10*Math.random())]);
            }
          }
          break;
        case (xOffset === 1 && yOffset === 0): // right
          paths.push([100,0]);
          if(ragged) {
            for(let y = 10 * Math.floor(Math.random() * 10); y < 100; y+=Math.floor(10*Math.random())) {
              paths.push([105-Math.floor(Math.random() * 10),y]);
            }
          }
          break;
        case (xOffset === 0 && yOffset === 1): // bottom
          paths.push([100,100]);
          if(ragged) {
            for(let x = 10 * Math.floor(Math.random() * 10); x < 100; x+=Math.floor(10*Math.random())) {
              paths.push([100-x,105-Math.floor(10*Math.random())]);
            }
          }
          break;
        case (xOffset === -1 && yOffset === 0): // left
          paths.push([0,100]);
          if(ragged) {
            for(let y = 10 * Math.floor(Math.random() * 10); y < 100; y+=Math.floor(10*Math.random())) {
              paths.push([Math.floor(Math.random() * 10 - 5),100-y]);
            }
          }
          break;
        
      }
      return paths;
    } , []);
  }, []);

  return <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      gridColumn: `${cellIndex + 1}`,
      gridRow: `${rowIndex + 1}`,
      width: tileDimension,
      height: tileDimension,
      backgroundImage: background.current? `url(thethirdsequence/${background.current}512.jpg)`: background.current,
      backgroundSize: background.current? 'cover': background.current,
    }}
    >
      {map[rowIndex][cellIndex].textures.map((texture, index) => {
        let tile = texture.graphic === background.current? null: <img
          key={`texture-${rowIndex}-${cellIndex}-${index}`}
          className="tile"
          src={`thethirdsequence/${texture.graphic}512.jpg`}
          alt={texture.graphic}
          style={((): React.CSSProperties => {
            return roundCell(rowIndex, cellIndex, map, {
              width: tileDimension,
              height: tileDimension,
              clipPath: paths.current.length? `polygon(${paths.current.map(([x,y]) => `${x}% ${y}%`).join(',')})`: undefined,
            });
          })()}
        />
        return <>{tile}{texture.animation.map(c => <AnimationTexture width={tileDimension} height={tileDimension} {...c} />)}</>;
      })}
  </div>
}