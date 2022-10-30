import React, { useEffect } from 'react';
import { useRef } from 'react';
import { Texture, Tile } from '../models/models';


function last(arr: any[]) {
  return arr[arr.length - 1];
}

function roundTopLeftCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  if(!map || !map[rowIndex] || !map[rowIndex][columnIndex]) return false;
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === 0) {
    return false
  }
  if(columnIndex === 0) {
    return false
  }
  const left = map[rowIndex][columnIndex - 1];
  const top = map[rowIndex - 1][columnIndex];
  return left.textures.length > 0 && top.textures.length > 0 && cell.textures.length > 0 && (last(left.textures).graphic ===last(top.textures).graphic) && (last(left.textures).graphic !== last(cell.textures).graphic);
}

function roundTopRightCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  if(!map || !map[rowIndex] || !map[rowIndex][columnIndex]) return false;
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === 0) {
    return false
  }
  if(columnIndex === map[0].length - 1) {
    return false
  }
  const right = map[rowIndex][columnIndex + 1];
  const top = map[rowIndex - 1][columnIndex];
  return right.textures.length > 0 && top.textures.length > 0 && cell.textures.length > 0 && (last(right.textures).graphic === last(top.textures).graphic) && (last(right.textures).graphic !== last(cell.textures).graphic);
}

function roundBottomLeftCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  if(!map || !map[rowIndex] || !map[rowIndex][columnIndex]) return false;
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === map.length - 1) {
    return false
  }
  if(columnIndex === 0) {
    return false
  }
  const left = map[rowIndex][columnIndex - 1];
  const bottom = map[rowIndex + 1][columnIndex];
  return left.textures.length > 0 && bottom.textures.length > 0 && cell.textures.length > 0 && (last(left.textures).graphic === last(bottom.textures).graphic) && (last(left.textures).graphic !== last(cell.textures).graphic);
}

function roundBottomRightCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  if(!map || !map[rowIndex] || !map[rowIndex][columnIndex]) return false;
  const cell: Tile = map[rowIndex][columnIndex];
  if(rowIndex === map.length - 1)  {
    return false
  }
  if(columnIndex === map[rowIndex].length - 1) {
    return false
  }
  const right = map[rowIndex][columnIndex + 1];
  const bottom = map[rowIndex + 1][columnIndex];
  return right.textures.length > 0 && bottom.textures.length > 0 && cell.textures.length > 0 && (last(right.textures).graphic === last(bottom.textures).graphic) && (last(right.textures).graphic !== last(cell.textures).graphic);
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
  if(!map || !map[rowIndex] || !map[rowIndex][columnIndex]) return false;
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
  return !!neighbor && neighbor.textures.length > 0 && cell.textures.length > 0 && (last(neighbor.textures).graphic !== last(cell.textures).graphic);
}

export function AnimationTexture({ graphic, direction, ms, width, height }: { graphic: string, direction: string, ms: number, width: string, height: string }) {
  const heightInt = parseInt(height);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    return;
    if(!globalThis.highPerf) return;
    const initialMarginTop = heightInt + Math.floor(Math.random() * heightInt);
    ref.current?.animate([
      { paddingTop: `-${initialMarginTop}px`, opacity: 0.3 },
      { paddingTop: 0, opacity: 0.8 },
    ], {
      duration: ms,
      iterations: Infinity,
    });
  }, [ms, heightInt]);

  return <div style={{
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.2,
  }} ref={ref}>
    <img src={graphic} alt={graphic} style={{ width: width, height: height }} />
    {/* <img src={graphic} alt={graphic} style={{ width: width, height: height }} /> */}
  </div>;
}

export function CompositeTextureElement({ rowIndex, cellIndex, map, tileDimension}: {rowIndex: number, cellIndex: number, map: Tile[][], tileDimension: string}) {
  const background = useRef<string | undefined>(undefined);
  const paths = useRef<number[][]>([]);
  useEffect(() => { 
    if(roundTopLeftCell(rowIndex, cellIndex, map) && rowIndex > 0 && cellIndex > 0) {
      const neighborCellTextures = map[rowIndex - 1][cellIndex - 1].textures;
      background.current = neighborCellTextures[neighborCellTextures.length - 1].graphic;
    }
    if(roundTopRightCell(rowIndex, cellIndex, map) && rowIndex > 0 && cellIndex < map[0].length - 1) {
      const neighborCellTextures = map[rowIndex - 1][cellIndex + 1].textures;
      background.current = neighborCellTextures[neighborCellTextures.length - 1].graphic;
    }
    if(roundBottomLeftCell(rowIndex, cellIndex, map) && rowIndex < map.length - 1 && cellIndex > 0) {
      const neighborCellTextures = map[rowIndex + 1][cellIndex - 1].textures;
      background.current = neighborCellTextures[neighborCellTextures.length - 1].graphic;
    }
    if(roundBottomRightCell(rowIndex, cellIndex, map) && rowIndex < map.length - 1 && cellIndex < map[0].length - 1) {
      const neighborCellTextures = map[rowIndex + 1][cellIndex + 1].textures;
      background.current = neighborCellTextures[neighborCellTextures.length - 1].graphic;
    }
    paths.current = [[0,-1],[1,0],[0,1],[-1,0]].reduce<number[][]>((paths, [xOffset,yOffset]) => {
      const ragged = raggedOrthogonalCell(rowIndex, cellIndex, xOffset, yOffset, map);
      if(!background.current && ragged) {
        const neighborCellTextures = map[rowIndex + yOffset][cellIndex + xOffset].textures;
        background.current = neighborCellTextures[neighborCellTextures.length - 1].graphic;
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
  }, [cellIndex, map, rowIndex]);

  if(!map || !map[rowIndex] || !map[rowIndex][cellIndex]) return null;
  

  return <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      gridColumn: `${cellIndex + 1}`,
      gridRow: `${rowIndex + 1}`,
      width: tileDimension,
      height: tileDimension,
      backgroundImage: background.current? `url(${background.current})`: background.current,
      backgroundSize: background.current? 'cover': background.current,
    }}
    >
      {map[rowIndex][cellIndex].textures.map((texture: Texture, index: number) => {
        let tile = <IndividualTile
          texture={texture} 
          tileDimension={tileDimension} 
          key={`texture-${rowIndex}-${cellIndex}-${index}-${texture.graphic}`}
          background={background.current}
          style={roundCell(rowIndex, cellIndex, map, {
            width: tileDimension,
            height: tileDimension,
            top: 0,
            left: 0,
            position: "absolute",
            clipPath: paths.current.length? `polygon(${paths.current.map(([x,y]) => `${x}% ${y}%`).join(',')})`: undefined,
          })}
        />;

        return <>{tile}{texture.animation.map(c => <AnimationTexture width={tileDimension} height={tileDimension} {...c} />)}</>;
      })}
  </div>
}

export function IndividualTile({texture,  tileDimension, style, background }: {texture: Texture, tileDimension: string, style?: React.CSSProperties, background?: string}) {
  return <img
    className="tile"
    src={texture.graphic}
    alt={texture.graphic}
    style={style? style: { 
      width: tileDimension,
      height: tileDimension,
    }}
  />
}