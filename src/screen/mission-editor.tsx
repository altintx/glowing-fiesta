import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Tile } from '../models/tile';
import { v4 as uuid } from 'uuid';
import { Map } from '../components/map';
import { SelectionTile } from '../components/selection-tile';

function mapToTable(cells: Tile[], width: number, height: number): Tile[][] {
    const table = [];
    for(let y = 0; y < height; y++) {
        const row = [];
        for(let x = 0; x < width; x++) {
            row.push(cells[y * width + x]);
        }
        table.push(row);
    }
    console.log(table);
    return table;
}

export function MissionEditor () {
    const tileDimension = 64;
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [map, setMap] = useState<Tile[]>([]);
    const [tiles, setTiles] = useState<Tile[][]>([]);
    const [mapUuid, setMapUuid] = useState(uuid());
    const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
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
        try {
            const json = JSON.parse(e.target.value);
            setWidth(json.width);
            setHeight(json.height);
            setMap(json.grid);
            setMapUuid(json.uuid);
            setTiles(mapToTable(json.grid, json.width, json.height));
        } catch (e) {

        }
    }
    return <Container fluid>
        <h1>Mission Editor</h1>
        <Row>
            <Col>
                <Tabs defaultActiveKey="mapUi"
                >
                    <Tab eventKey="mapUi" title="Map">
                        <div ref={ref} style={{
                            overflow: "scroll",
                            height: '80vh'
                        }}>
                            <div
                                onMouseMove={(e) => {
                                    const [mouseX, mouseY] = [e.clientX - e.nativeEvent.offsetX + tileDimension + (ref.current?.scrollLeft || 0), e.clientY - e.nativeEvent.offsetY + (ref.current?.scrollTop || 0)];
                                    const [transformX, transformY] = [mouseX, mouseY];
                                    const [tileX, tileY] = [Math.floor(transformX / tileDimension), Math.floor(transformY / tileDimension)];
                                    if(tileY in map && tileX in tiles[tileY] && hoveredTile !== tiles[tileY][tileX]) {
                                        setHoveredTile(tiles[tileY][tileX])
                                    } 
                                }}
                            >
                                <Map border={false} tileDimensionInt={tileDimension} map={tiles} augments={(x, y, cell) => {
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
                                        />
                                    ];
                                }} />
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="mapJson" title="JSON">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            onChange={loadMap}
                            value={JSON.stringify({width, height, grid: map, uuid: mapUuid})}
                        />
                    </Tab>
                </Tabs>
            </Col>
            <Col>
                <h2>Properties</h2>
                <Form.Group>
                    <Form.Label htmlFor="inputWidth">Width</Form.Label>
                    <Form.Control
                        type="number"
                        id="mapWidth"
                        value={width}
                        onChange={e => updateGrid(setWidth, e.target.value)}
                        aria-describedby="widthHelpBlock"
                    />
                    <Form.Text id="widthHelpBlock" muted>Map is this many tiles wide</Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="inputHeight">Height</Form.Label>
                    <Form.Control
                        type="number"
                        onChange={e => updateGrid(setHeight, e.target.value)}
                        value={height}
                        id="mapHeight"
                        aria-describedby="heightHelpBlock"
                    />
                    <Form.Text id="heightHelpBlock" muted>Map is this many tiles high</Form.Text>
                </Form.Group>
            </Col>
        </Row>
    </Container>
}