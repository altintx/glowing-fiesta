import { Tile, Texture } from '../models/models';

function roundTopLeftCell(rowIndex: number, columnIndex: number, map: Tile[][]): boolean {
  const cell: Tile = map[rowIndex][columnIndex];
  if ((rowIndex === 0) && (columnIndex === 0)) {
    return true;
  }
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
  if ((rowIndex === 0) && (columnIndex === map[0].length - 1)) {
    return true;
  }
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
  if ((rowIndex === map.length - 1) && (columnIndex === 0)) {
    return true;
  }
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
  if ((rowIndex === map.length - 1) && (columnIndex === map[map[rowIndex].length - 1].length - 1)) {
    return true;
  }
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
  let background;
  if(roundTopLeftCell(rowIndex, cellIndex, map) && rowIndex > 0 && cellIndex > 0) {
    background = map[rowIndex - 1][cellIndex - 1].textures[0].graphic;
  } else if(roundTopRightCell(rowIndex, cellIndex, map) && rowIndex > 0 && cellIndex < map[0].length - 1) {
    background = map[rowIndex - 1][cellIndex + 1].textures[0].graphic;
  } else if(roundBottomLeftCell(rowIndex, cellIndex, map) && rowIndex < map.length - 1 && cellIndex > 0) {
    background = map[rowIndex + 1][cellIndex - 1].textures[0].graphic;
  } else if(roundBottomRightCell(rowIndex, cellIndex, map) && rowIndex < map.length - 1 && cellIndex < map[0].length - 1) {
    background = map[rowIndex + 1][cellIndex + 1].textures[0].graphic;
  }
  return <div
    style={{
      gridColumn: `${cellIndex + 1}`,
      gridRow: `${rowIndex + 1}`,
      width: tileDimension,
      height: tileDimension,
      backgroundImage: background? `url(thethirdsequence/${background}512.jpg)`: background,
      backgroundSize: background? 'cover': background,
    }}
    >
      {map[rowIndex][cellIndex].textures.map((texture, index) =>
        <img
          key={`texture-${rowIndex}-${cellIndex}-${index}`}
          className="tile"
          src={`thethirdsequence/${texture.graphic}512.jpg`}
          alt={texture.graphic}
          style={((): React.CSSProperties => {
            return roundCell(rowIndex, cellIndex, map, {
              width: tileDimension,
              height: tileDimension,
            });
          })()}
        />
    )}
  </div>
}