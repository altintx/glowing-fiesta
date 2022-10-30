import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Stack, Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Texture, Tile } from "../models/models";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GraphicsList } from "./graphics-list";

export function SpriteBrowser({
  selectedTile, 
  setSprites, 
  sprites, 
  tileDimension,
  onSelect,
}: {
  selectedTile: Tile | null,
  setSprites: React.Dispatch<React.SetStateAction<string[]>>,
  sprites: string[],
  tileDimension: number,
  onSelect: ({ graphic, tile, action }: { graphic: string, tile: Tile, action: string }) => void,
}) {
  const disabled = !selectedTile;
  return(<Card className="mb-3">
    <Card.Header>
      <Stack direction="horizontal" gap={3}>
        <h5>Sprites</h5>
        <Button disabled={sprites.includes("")} size="sm" className="ms-auto" onClick={() => setSprites([...sprites, ""])}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </Stack>
    </Card.Header>
    <Card.Body>
      {sprites.map((sprite, index) => {
        const isSelected = selectedTile && selectedTile.occupant && selectedTile.occupant?.textures?.some((t: Texture) => t.graphic === sprite);
        return (<Dropdown key={index} as={ButtonGroup}>
          <Dropdown.Toggle variant={isSelected? 'primary': 'light'}>
            <img src={sprite} key={index} width={tileDimension} height={tileDimension} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item disabled={disabled} as="button" onClick={() => selectedTile && onSelect({ graphic: sprite, tile: selectedTile, action: "set" })}>Set Tile's Sprite</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              as="button"
              onClick={() => {
                const newGraphic = prompt("Enter new graphic name", sprite);
                if (newGraphic) {
                  setSprites?.(sprites.map((g, ix) => ix === index ? newGraphic : g));
                }
              }}
            >Change Sprite's Graphic</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>);
      })}
    </Card.Body>
  </Card>);
}