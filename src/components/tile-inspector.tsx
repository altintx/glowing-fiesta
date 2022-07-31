import React from 'react';
import { Tile } from '../models/models';

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
  return <div style={{position:'absolute', bottom: 0, right: 0, textAlign: 'right', width: '15em',height:'15em'}}>
    {occupant && <ul>
      <li>Name: {occupant.name}</li>
      <li>Alignment: {FACTIONS[occupant.faction]}</li>
      <li>Class: {t(occupant.class.name, language)}</li>
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
function t(translations: any, language: string): string {
  if(language in translations) {
    return translations[language];
  }
  if(language.includes("-")) {
    const [generic] = language.split("-");
    if(generic in translations) {
        return translations[generic];
    }
  }
  throw new Error(
    "not translated error",
    // language: language, 
    // detail: `Only languages ${Object.keys(translations).join(", ")} are available`
  );
}

