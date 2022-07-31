import React from 'react';
import { Tile } from '../models/models';

const FACTIONS = ['Hero', 'Villain'];
export function TileInspector({tile, occupant }: { tile: Tile | null, occupant: any | null }) {
  return <div style={{position:'absolute', bottom: 0, right: 0, textAlign: 'right', width: '15em',height:'15em'}}>
    {occupant && <ul>
      <li>Name: {occupant.name}</li>
      <li>Alignment: {FACTIONS[occupant.faction]}</li>
      <li>Class: {t(occupant.class.name)}</li>
      <li>AP: {occupant.ap}</li>
    </ul>}
    {tile && <>
      <div>Cover: {tile.cover}</div>
      <div>Elevation: {tile.elevation}</div>
      <div>Openable: {tile.openable? 'true': 'false'}</div>
      <div>Position: ({tile.x}, {tile.y})</div>
    </>}
    {!tile && <>
      <div>no selection</div>
    </>}
  </div>
}
function t(translation: any): string {
  return translation['en'];
}

