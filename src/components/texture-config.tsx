import { useState } from "react";
import { Form, Row, Col } from 'react-bootstrap';
import { Texture } from "../models/texture";
import { IndividualTile } from "./texture";

export function TextureConfig({ texture, onChange, graphics }: { texture: Texture, onChange: (texture: Texture) => void, graphics: string[] }) {
  const [graphic, setGraphic] = useState(texture.graphic);
  const [offset, setOffset] = useState(texture.offset);
  return <>
    <Form.Group as={Row} controlId="texture-graphic">
      <Col sm={3}>
        <IndividualTile texture={{graphic, animation: [], offset:[0,0,0] }} tileDimension="6em" />
      </Col>
      <Col sm={7}>
        <Form.Label sm={3}>Graphic</Form.Label>
        <Form.Select className="mb-3" onChange={e => {
          setGraphic(e.target.value);
          onChange({ ...texture, graphic: e.target.value });
        }} value={graphic}>
          {graphics.map((g: any) => <option value={g}>{g}</option>)}
        </Form.Select>
      </Col>
    </Form.Group>
    <Form.Group as={Row} style={{display:"none"}}>
      <Form.Label column sm={3}>Offset X/Y/Z</Form.Label>
      <Col sm={3}>
        <Form.Control type="number" value={offset[0]} onChange={e => {
          setOffset([parseInt(e.target.value), offset[1], offset[2]]);
          onChange({ ...texture, offset: [parseInt(e.target.value), offset[1], offset[2]] });
        }} />
      </Col>
      <Col sm={3}>
        <Form.Control type="number" value={offset[1]} onChange={e => {
          setOffset([offset[0], parseInt(e.target.value), offset[2]]);
          onChange({ ...texture, offset: [offset[0], parseInt(e.target.value), offset[2]] });
        }} />
      </Col>
      <Col sm={3}>
        <Form.Control type="number" value={offset[2]} onChange={e => {
          setOffset([offset[0], offset[1], parseInt(e.target.value)]);
          onChange({ ...texture, offset: [offset[0], offset[1], parseInt(e.target.value)] });
        }} />
      </Col>
    </Form.Group>
  </>;
}