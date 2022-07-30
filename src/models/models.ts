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
}

