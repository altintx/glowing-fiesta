import { ButtonGroup, Dropdown } from "react-bootstrap";
import { Tile } from "../models/models";
import { IndividualTile } from "./texture";

export type RenderAsOptions = 'Thumbnails';
export function GraphicsList({
  graphics, 
  renderAs, 
  children, 
  tileDimension, 
  selectedTile,
  onSelect,
  setGraphics,
}: {
  graphics: string[], 
  renderAs?: RenderAsOptions, 
  children?: React.ReactNode,
  tileDimension?: string,
  selectedTile: Tile | null,
  onSelect: ({ graphic, tile, action }: { graphic: string, tile: Tile, action: string }) => void,
  setGraphics?: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const disabled = !selectedTile;
  return (
    <div className="graphics-list" style={{
      display: 'flex',
      gap: '0.5em',
      flexWrap: 'wrap',
      columns: 4,
    }}>
      {graphics.map((g, i) => {
        const isSelected = selectedTile?.textures.some(t => t.graphic === g);
        const hasMoreThanOneTexture = (selectedTile?.textures.length || 0) > 1;
        return (<Dropdown key={i} as={ButtonGroup}>
          <Dropdown.Toggle variant={isSelected? 'primary': 'light'}>
            <IndividualTile
              texture={{graphic: g, offset: [0,0,], animation: []}}
              tileDimension={tileDimension || "100px"}          
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              disabled={disabled} 
              as="button" 
              onClick={() => selectedTile && onSelect({ graphic: g, tile: selectedTile, action: "add"})}
            >Add Texture to Tile</Dropdown.Item>
            <Dropdown.Item
              disabled={disabled || hasMoreThanOneTexture} 
              as="button"
              onClick={() => selectedTile && onSelect({ graphic: g, tile: selectedTile, action: "set"})}
            >Replace Tile's Texture</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              as="button"
              onClick={() => {
                const newGraphic = prompt("Enter new graphic name", g);
                if (newGraphic) {
                  setGraphics?.(graphics.map((g, ix) => ix === i ? newGraphic : g));
                }
              }}
            >Change Texture's Graphic</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>);
})}
      {children}
    </div>
  );
}