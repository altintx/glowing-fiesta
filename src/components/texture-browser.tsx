import { Button, Card, Stack } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { GraphicsList } from '../components/graphics-list';
import { Tile } from '../models/models';

export function TextureBrowser({
  selectedTile, 
  setGraphics, 
  graphics, 
  tileDimension,
  onSelect
}: {
  selectedTile: Tile | null,
  setGraphics: React.Dispatch<React.SetStateAction<string[]>>,
  graphics: string[],
  tileDimension: number,
  onSelect: ({ graphic, tile, action }: { graphic: string, tile: Tile, action: string }) => void
}) {
  return(<Card className="mb-3">
    <Card.Header>
      <Stack direction="horizontal" gap={3}>
        <h5>Textures</h5>
        <Button disabled={graphics.includes("")} size="sm" className="ms-auto" onClick={() => setGraphics([...graphics, ""])}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </Stack>
    </Card.Header>
    <Card.Body>
      <GraphicsList
        selectedTile={selectedTile} 
        setGraphics={setGraphics} 
        renderAs="Thumbnails" 
        graphics={graphics} 
        tileDimension={`${tileDimension}px`}
        onSelect={onSelect}
      />
    </Card.Body>
  </Card>);
}