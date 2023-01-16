import { CoverType } from "./cover_type";
import { Texture } from "./texture";

export type Tile = {
  cover: CoverType;
  elevation: number;
  occupant: any;
  openable: boolean;
  textures: Texture[];
  type: any;
  x: number;
  y: number;
  uuid: string;
}
