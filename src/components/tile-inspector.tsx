import React from 'react';
import { Tile } from '../models/models';

export function TileInspector({tile, occupant }: { tile: Tile | null, occupant: any | null }) {
  return <div style={{position:'absolute', bottom: 0, right: 0, textAlign: 'right', width: '10em',height:'15em'}}>
    {tile && <>
      <div>occupant: {JSON.stringify(occupant)}</div>
      <div>cover: {tile.cover}</div>
      <div>elevation: {tile.elevation}</div>
      <div>openable: {tile.openable? 'true': 'false'}</div>
      <div>type: {tile.type}</div>
      <div>pos: ({tile.x}, {tile.y})</div>
    </>}
    {!tile && <>
      <div>no selection</div>
    </>}
  </div>
}