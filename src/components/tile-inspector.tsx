import React from 'react';
import { Tile } from '../models/models';
import { LocalizedString } from './localized-string';

const FACTIONS = ['Hero', 'Villain'];
export function TileInspector({
  language,
  tile, 
  occupant 
}: {
  language: string,
  tile: Tile | null,
  occupant: any | null
}) {
  return <div style={{position:'absolute', bottom: 0, right: 0, textAlign: 'right', width: '15em',height:'15em', zIndex:1000, backgroundColor:"rgba(220,220,220,0.5)"}}>
    {occupant && <ul>
      <li>Name: {occupant.name}</li>
      <li>Alignment: {FACTIONS[occupant.faction]}</li>
      <li>Class: <LocalizedString translations={occupant.class.name} language={language} /></li>
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


