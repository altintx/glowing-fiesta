import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Texture, Tile } from '../models/models';
import { v4 as uuid } from 'uuid';
import { Map } from '../components/map';
import { SelectionTile } from '../components/selection-tile';
import { TileConfig } from '../components/tile-config';
import { flatten } from 'array-flatten';
import unique from 'array-unique';

function mapToTable(cells: Tile[], width: number, height: number): Tile[][] {
  const table = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(cells[y * width + x]);
    }
    table.push(row);
  }
  console.log(table);
  return table;
}

export function MapEditor() {
  const tileDimension = 64;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [map, setMap] = useState<Tile[]>([]);
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const [mapUuid, setMapUuid] = useState(uuid());
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [graphics, setGraphics] = useState<string[]>([]);
  const [sprites, setSprites] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const updateGrid = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    setter(parseInt(value));
    const a: Tile[] = Array(width * height).fill(null).map((_, i) => ({
      cover: "None",
      elevation: 0,
      occupant: null,
      openable: false,
      textures: [],
      type: null,
      x: i % width,
      y: Math.floor(i / width),
      uuid: uuid()
    }))
    setMap(a);
    setTiles(mapToTable(a, width, height));
  }
  const loadMap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const json = JSON.parse(e.target.value);
    setWidth(json.width);
    setHeight(json.height);
    setMap(json.grid);
    setMapUuid(json.uuid);
    setTiles(mapToTable(json.grid, json.width, json.height));
    setGraphics(unique(flatten(json.grid.map((t: Tile) => t.textures.map(t => t.graphic)))));
    const __sprites = json.grid.map((t: Tile) => t.occupant && typeof t.occupant === "object"? t.occupant.textures.map((t: Texture) => t.graphic): [])
    setSprites(unique(flatten(__sprites)));
  }
  const onSave = (tile: Tile) => {
    console.log(tile);
    const newMap = map.map(t => t.uuid === tile.uuid? tile: t);
    setMap(newMap);
    setTiles(mapToTable(newMap, width, height));
    setSelectedTile(tile);
  }
  return <><Container fluid>
    <h1>Map Editor</h1>
    <Row>
      <Col className="col-7">
        <Tabs defaultActiveKey="mapUi"
        >
          <Tab eventKey="mapUi" title="Map">
            <div ref={ref} style={{
              overflow: "scroll",
              height: '80vh'
            }}>
              <div
                onMouseMove={(e) => {
                  var bounds = ref?.current?.getBoundingClientRect();
                  if(!bounds || !ref.current) return;
                  var x = e.clientX - bounds.left + ref.current.scrollLeft;
                  var y = e.clientY - bounds.top + ref.current.scrollTop;
                  const [tileX, tileY] = [Math.floor(x / tileDimension), Math.floor(y / tileDimension)];
                  if (tileY in map && tileX in tiles[tileY] && hoveredTile !== tiles[tileY][tileX]) {
                    setHoveredTile(tiles[tileY][tileX])
                  }
                }}
              >
                <Map
                  border={false}
                  tileDimensionInt={tileDimension}
                  map={tiles}
                  augments={(x, y, cell) => {
                    const hovered = hoveredTile === cell;
                    const selected = selectedTile === cell;
                    return [
                      <SelectionTile
                        enabled={hovered}
                        key={`hover-${cell.uuid}`}
                        borderColor="rgba(255,255,255,0.5)"
                        x={x}
                        y={y}
                        size={`${tileDimension}px`}
                        borderThrob={true}
                        onClick={() => setSelectedTile(cell)}
                        zIndex={200}
                      />,
                      <SelectionTile
                        enabled={selected}
                        key={`selected-${cell.uuid}`}
                        borderColor="rgba(64,255,64,0.5)"
                        x={x}
                        y={y}
                        size={`${tileDimension}px`}
                        borderThrob={true}
                        onClick={() => setSelectedTile(null)}
                        zIndex={300}
                      />
                    ];
                  }} />
              </div>
            </div>
          </Tab>
          <Tab eventKey="mapJson" title="JSON">
            <Form.Control
              as="textarea"
              style={{
                height: '80vh'
              }}
              onChange={loadMap}
              value={JSON.stringify({ width, height, grid: map, uuid: mapUuid })}
            />
          </Tab>
        </Tabs>
      </Col>
      <Col className="col-5" style={{overflowY:"scroll",height:"90vh"}}>
        <h2>Properties</h2>
        {selectedTile && <TileConfig key={selectedTile.uuid} tile={selectedTile} graphics={graphics} sprites={sprites} onSave={onSave} onCancel={() => void 0} />}
      </Col>
    </Row>
  </Container>
  <Container fluid style={{
    position: "fixed",
    bottom: 0,
  }}>
    <Row>
      <Col>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="inputWidth">Width</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              id="mapWidth"
              value={width}
              onChange={e => updateGrid(setWidth, e.target.value)}
              aria-describedby="widthHelpBlock"
            />
          </Col>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="inputHeight">Height</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              onChange={e => updateGrid(setHeight, e.target.value)}
              value={height}
              id="mapHeight"
              aria-describedby="heightHelpBlock"
            />
          </Col>
        </Form.Group>
      </Col>
    </Row>
  </Container>
  </>
}