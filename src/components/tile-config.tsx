import { useRef, useState } from "react";
import { TextureConfig } from "./texture-config";
import { CoverType, Texture, Tile } from "../models/models";
import { ObstacleConfig } from "./obstacle-config";
import { Button, ButtonGroup, ListGroup, ListGroupItem, Row, Col, Card, Stack, Form } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const occupantType = (occupant: any): string => {
  if (occupant === null) {
    return "empty";
  } else if (typeof occupant === "string") {
    return "spawnpoint";
  }
  return "obstacle";
}

export function TileConfig({ tile: originalTile, onSave, onCancel, graphics, sprites }: { tile: Tile, graphics: string[], sprites: string[], onSave: (tile: Tile) => void, onCancel: () => void }) {
  const [tile, setTile] = useState(originalTile);
  const [tileType, setTileType] = useState(originalTile.type);
  const [tileCover, setTileCover] = useState(originalTile.cover);
  const [tileElevation, setTileElevation] = useState(originalTile.elevation);
  const [tileOpenable, setTileOpenable] = useState(originalTile.openable);
  const [tileTextures, setTileTextures] = useState(originalTile.textures);
  const [tileOccupant, setTileOccupant] = useState(originalTile.occupant);
  const lastProps = useRef<any>(tile);
  if (lastProps.current !== tile) {
    console.log("corrupt!");
    setTileType(tile.type);
    setTileCover(tile.cover);
    setTileElevation(tile.elevation);
    setTileOpenable(tile.openable);
    setTileTextures(tile.textures);
    setTileOccupant(tile.occupant);
    lastProps.current = tile;
  }
  return <div className="tile-config">
    <Card className="mb-3">
      <Card.Header>
        <h5>Tile Config</h5>
      </Card.Header>
      <Card.Body>
        <Form.Group as={Row} controlId="tile-type" style={{display:"none"}}>
          <Form.Label column sm={3}>Type</Form.Label>
          <Col sm={9}>
            <Form.Select className="mb-3"  onChange={(e) => {
              setTileType(e.target.value);
              const newTile = { ...tile, type: e.target.value };
              // setTile({ ...tile, type: e.target.value });
              onSave(newTile);
            }} value={tileType}>
              <option value="None">None</option>
              <option value="Wall">Wall</option>
              <option value="Floor">Floor</option>
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="tile-cover">
          <Form.Label column sm={3}>Cover</Form.Label>
          <Col sm={9}>
            <Form.Select className="mb-3" onChange={(e) => {
              setTileCover(e.target.value as CoverType);
              const newTile = { ...tile, cover: e.target.value as CoverType };
              onSave(newTile);
            }
            } value={tileCover}>
              <option value="None">None</option>
              <option value="Half">Half</option>
              <option value="Full">Full</option>
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="tile-elevation">
          <Form.Label column sm={3}>Elevation</Form.Label>
          <Col sm={9}>
            <Form.Control type="number" className="mb-3" onChange={(e) => {
              setTileElevation(parseInt(e.target.value));
              const newTile = { ...tile, elevation: parseInt(e.target.value) };
              onSave(newTile);
            }} value={tileElevation} disabled />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="tile-openable">
          <Form.Label column sm={3}>Openable</Form.Label>
          <Col sm={9}>
            <Form.Check type="checkbox" className="mb-3" onChange={(e) => {
              setTileOpenable(e.target.checked);
              const newTile = { ...tile, openable: e.target.checked };
              onSave(newTile);
            }} checked={tileOpenable} />
          </Col>
        </Form.Group>
      </Card.Body>
    </Card>
    <Card className="mb-3">
      <Card.Header>
        <Stack direction="horizontal" gap={3}>
          <h5>Textures</h5>
          <Button size="sm" className="ms-auto" onClick={() => {
            const textures = [
              ...tileTextures,
              {
                uuid: uuid(),
                graphic: "", 
                offset: [0, 0, 0], 
                animation: [{
                  graphic: "", 
                  ms: 5000, 
                  direction: "down"
                }]
              } as Texture
            ];
            setTileTextures(textures);
            const newTile = { ...tile, textures };
            onSave(newTile);
          }}><FontAwesomeIcon icon={faPlus} /></Button>
        </Stack>
      </Card.Header>
      <Card.Text>
      <ListGroup>
        {tileTextures.map((texture: Texture, index: number) => (
          <ListGroupItem key={(texture as any).uuid}>
            <Row>
              <Col sm={11}>
                <TextureConfig texture={texture} graphics={graphics} onChange={(texture: Texture) => {
                  const textures = [...tileTextures];
                  textures[index] = texture;
                  setTileTextures(textures);
                  const newTile = { ...tile, textures };
                  onSave(newTile);

                }} />
              </Col>
              <Col sm={1}>
                <ButtonGroup vertical size="sm">
                  <Button onClick={() => {
                    const textures = [...tileTextures];
                    const t = textures[index];
                    textures[index] = textures[index - 1];
                    textures[index - 1] = t;
                    setTileTextures(textures);
                    const newTile = { ...tile, textures };
                    onSave(newTile);
                  }} disabled={index === 0}><FontAwesomeIcon icon={faArrowUp} /></Button>
                  <Button onClick={() => {
                    const textures = [...tileTextures];
                    textures.splice(index, 1);
                    setTileTextures(textures);
                    const newTile = { ...tile, textures };
                    onSave(newTile);
                  }} variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
                  <Button onClick={() => {
                    const textures = [...tileTextures];
                    const t = textures[index];
                    textures[index] = textures[index + 1];
                    textures[index + 1] = t;
                    setTileTextures(textures);
                    const newTile = { ...tile, textures };
                    onSave(newTile);
                  }} disabled={index + 1 === tileTextures.length}><FontAwesomeIcon icon={faArrowDown} /></Button>
                </ButtonGroup>
              </Col>
            </Row>
          </ListGroupItem>))}
        </ListGroup>
      </Card.Text>
    </Card>
    <Card className="mb-3">
      <Card.Header>
        <Row>
          <Col>
            <h5 className="mt-1">Occupant</h5>
          </Col>
          <Col>
          <Form.Select onChange={(e) => { }} value={occupantType(tileOccupant)}>
            <option value="empty">Empty</option>
            <option value="spawnpoint">Spawn Point</option>
            <option value="obstacle">Obstacle</option>
          </Form.Select>
          </Col>
        </Row>
        
      </Card.Header>
      <Card.Body>
        {typeof tileOccupant === "string" ? "Character":
          typeof tileOccupant === "object" && tileOccupant !== null ?
            <ObstacleConfig occupant={tileOccupant} setOccupant={(occupant: any) => {
              console.log("set occupant");
              setTileOccupant(occupant);
              onSave({...tile, occupant});
            }} graphics={sprites} />:
            "Empty"}
      </Card.Body>
    </Card>
  </div>;
}
