import { Socket } from 'socket.io';
export type Texture = {
  graphic: string;
  offset: number[];
  animation: any[];
}
export type Tile = {
  cover: 'None' | 'Full' | 'Half';
  elevation: number;
  occupant: any;
  openable: boolean;
  textures: Texture[];
  type: any;
  x: number;
  y: number;
  uuid: string;
}

export type Operator = {
  screenName: string;
  socket?: Socket;
}

export type Action = {
  name: Record<string, string>;
  ap: number;
  cooldown: number;
  xp: number,
  uuid: string, 
}

export type Character = {
  name: string;
  uuid: string;
  class: any;
  race: any;
  faction: any;
}

export type OperatorArrows = {
  operator: Operator;
  tile: Tile;
  mode: string;
}

export type Uuid = string;

