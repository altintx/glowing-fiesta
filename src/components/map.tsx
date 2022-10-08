import React, { ReactElement } from "react";
import { Tile } from "../models/models";
import { CompositeTextureElement } from "../components/texture";

export function Map({ 
  map, 
  augments,
  tileDimensionInt,
}: {
  map: Tile[][], 
  tileDimensionInt: number,
  augments: (x: number, y: number, cell: Tile) => Array<null | ReactElement | JSX.Element>
}) {
  const tileDimension = `${tileDimensionInt}px`;
  
  if(map.length === 0) return null;
  return <div style={{
    display:'grid',
    gridAutoColumns: `1fr`,
    gridAutoRows: `1fr`,
    border: "1em solid #222",
    borderRadius: "1em",
    gap: 0,
    width: `${map[0].length * (tileDimensionInt)}px`,
    height: `${map.length * (tileDimensionInt)}px`,
  }}>
    {map.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        return ([
          <CompositeTextureElement key={`background-${cell.uuid}`} cellIndex={cellIndex} rowIndex={rowIndex} tileDimension={tileDimension} map={map} />
        ] as Array<null | ReactElement | JSX.Element>).concat(augments(cellIndex, rowIndex, cell)).filter(v => v)
      })
    )}
  </div>;
}
