import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { CompositeTextureElement } from '../components/texture';
import Form from 'react-bootstrap/Form';
import { Tile } from '../models/models';
import { v4 as uuid } from 'uuid';
import { Map } from '../components/map';

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

export function LevelEditor () {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [map, setMap] = useState<Tile[]>([]);
    const [tiles, setTiles] = useState<Tile[][]>([]);
    useEffect(() => {
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
    }, [width, height]);
    return <Container fluid>
        <h1>Level Editor</h1>
        <Row>
            <Col>
                <Tabs defaultActiveKey="mapUi"
                >
                    <Tab eventKey="mapUi" title="Map">
                        <Map tileDimensionInt={64} map={tiles} augments={(x, y, cell) => []} />
                    </Tab>
                    <Tab eventKey="mapJson" title="JSON">
                        <code>{JSON.stringify(map)}</code>
                    </Tab>
                </Tabs>
            </Col>
            <Col>
                <h2>Properties</h2>
                <>
                    <Form.Label htmlFor="inputWidth">Width</Form.Label>
                    <Form.Control
                        type="number"
                        id="mapWidth"
                        value={width}
                        onChange={e => setWidth(parseInt(e.target.value))}
                        aria-describedby="widthHelpBlock"
                    />
                    <Form.Text id="widthHelpBlock" muted>Map is this many tiles wide</Form.Text>
                </>
                <>
                    <Form.Label htmlFor="inputHeight">Height</Form.Label>
                    <Form.Control
                        type="number"
                        onChange={e => setHeight(parseInt(e.target.value))}
                        value={height}
                        id="mapHeight"
                        aria-describedby="heightHelpBlock"
                    />
                    <Form.Text id="heightHelpBlock" muted>Map is this many tiles high</Form.Text>
                </>
            </Col>
        </Row>
    </Container>
}