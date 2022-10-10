import { useRef, useState } from "react";
import { TextureConfig } from "./texture-config";
import { Tile } from "../models/models";
import { ObstacleConfig } from "./obstacle-config";

export function TileConfig({ tile: originalTile, onSave, onCancel }: { tile: Tile, onSave: (tile: Tile) => void, onCancel: () => void }) {
  const [tile, setTile] = useState(originalTile);
  const [tileType, setTileType] = useState(tile.type);
  const [tileCover, setTileCover] = useState(tile.cover);
  const [tileElevation, setTileElevation] = useState(tile.elevation);
  const [tileOpenable, setTileOpenable] = useState(tile.openable);
  const [tileTextures, setTileTextures] = useState(tile.textures);
  const [tileOccupant, setTileOccupant] = useState(tile.occupant);
  const lastProps = useRef<any>(tile);
  if (lastProps.current !== tile) {
    setTileType(tile.type);
    setTileCover(tile.cover);
    setTileElevation(tile.elevation);
    setTileOpenable(tile.openable);
    setTileTextures(tile.textures);
    setTileOccupant(tile.occupant);
    lastProps.current = tile;
  }
  return <div className="tile-config">
    <div className="tile-config-header">
      <h3>Tile Config</h3>
    </div>
    <div className="tile-config-body">
      <div className="tile-config-row">
        <label htmlFor="tile-type">Type</label>
        <select id="tile-type" value={tileType} onChange={(e) => {
          setTileType(e.target.value);
          setTile({ ...tile, type: e.target.value });
        }
        }>
          <option value="None">None</option>
          <option value="Wall">Wall</option>
          <option value="Floor">Floor</option>
        </select>
      </div>
      <div className="tile-config-row">
        <label htmlFor="tile-cover">Cover</label>
        <select id="tile-cover" value={tileCover} onChange={(e) => {
          const v = e.target.value as "None" | "Full" | "Half";
          setTileCover(v);
          setTile({ ...tile, cover: v });
        }
        }>
          <option value="None">None</option>
          <option value="Full">Full</option>
          <option value="Half">Half</option>
        </select>
      </div>
      <div className="tile-config-row">
        <label htmlFor="tile-elevation">Elevation</label>
        <input id="tile-elevation" type="number" value={tileElevation} onChange={(e) => {
          setTileElevation(parseInt(e.target.value));
          setTile({ ...tile, elevation: parseInt(e.target.value) });
        }
        } />
      </div>
      <div className="tile-config-row">
        <label htmlFor="tile-openable">Openable</label>
        <input id="tile-openable" type="checkbox" checked={tileOpenable} onChange={(e) => {
          setTileOpenable(e.target.checked);
          setTile({ ...tile, openable: e.target.checked });
        }
        } />
      </div>
      <div className="tile-config-row">
        <label htmlFor="tile-textures">Textures</label>
        {tileTextures.map((texture: any, index: number) => (<TextureConfig texture={texture} />))}
      </div>
      <div className="tile-config-row">
        <label htmlFor="tile-occupant">Occupant</label>
        <ObstacleConfig obstacle={tileOccupant} />
      </div>
    </div>
    <div className="tile-config-footer">
      <button onClick={() => onSave(tile)}>Save</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  </div>;
}
