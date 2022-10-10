import React, { ReactElement } from "react";
import { Tile } from "../models/models";
import { CompositeTextureElement } from "../components/texture";
import { Obstacle } from "./obstacle";

export function Map({ 
  map, 
  augments,
  tileDimensionInt,
  border = true,
  counterRotate = 0,
}: {
  map: Tile[][], 
  tileDimensionInt: number,
  border?: boolean,
  counterRotate?: number,
  augments: (x: number, y: number, cell: Tile) => Array<null | ReactElement | JSX.Element>,
}) {
  const tileDimension = `${tileDimensionInt}px`;
  
  if(map.length === 0) return null;
  return <div style={{
    display:'grid',
    gridAutoColumns: `1fr`,
    gridAutoRows: `1fr`,
    border: border? "1em solid #222": undefined,
    borderRadius: border? "1em": undefined,
    gap: 0,
    width: `${map[0].length * (tileDimensionInt)}px`,
    height: `${map.length * (tileDimensionInt)}px`,
  }}>
    {map.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        return ([
          <CompositeTextureElement key={`background-${cell.uuid}`} cellIndex={cellIndex} rowIndex={rowIndex} tileDimension={tileDimension} map={map} />,
          cell.occupant && typeof cell.occupant !== "string"? <Obstacle
          {...cell.occupant}
          key={`obstacle-${cell.occupant.uuid}`}
          row={rowIndex }
          column={cellIndex}
          tileDimension={tileDimensionInt}
          rotate={counterRotate}
        />: null, 
        ] as Array<null | ReactElement | JSX.Element>).concat(augments(cellIndex, rowIndex, cell)).filter(v => v)
      })
    )}
  </div>;
}
