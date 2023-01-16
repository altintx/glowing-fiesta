import { Row, Form, Col, ListGroup, Card, ListGroupItem } from 'react-bootstrap';
import { Texture } from '../models/texture';
import { TextureConfig } from './texture-config';
export function ObstacleConfig(props: any) {
  const { occupant, setOccupant } = props;

    return <> 
      <Form.Group as={Row} controlId="obstacle-name">
        <Form.Label column sm={3}>Name</Form.Label>
        <Col sm={9}>
          <Form.Control type="text" className="mb-3" onChange={(e) => {
            setOccupant({ ...occupant, name: { en: e.target.value } });
          }} value={occupant.name.en} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="obstacle-destructive">
        <Form.Label column sm={3}>Destructive</Form.Label>
        <Col sm={9}>
          <Form.Check type="checkbox" className="mb-3" onChange={(e) => {
            setOccupant({ ...occupant, destructive: e.target.checked });
          }} checked={occupant.destructive} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="obstacle-destructable">
        <Form.Label column sm={3}>Destructable</Form.Label>
        <Col sm={9}>
          <Form.Check type="checkbox" className="mb-3" onChange={(e) => {
            setOccupant({ ...occupant, destructable: e.target.checked });
          }} checked={occupant.destructable} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="obstacle-destroyed">
        <Form.Label column sm={3}>Destroyed</Form.Label>
        <Col sm={9}>
          <Form.Check type="checkbox" className="mb-3" onChange={(e) => {
            setOccupant({ ...occupant, destroyed: e.target.checked });
          }} checked={occupant.destroyed} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="obstacle-cover-bonus">
        <Form.Label column sm={3}>Cover Bonus</Form.Label>
        <Col sm={9}>
          <Form.Control type="number" className="mb-3" onChange={(e) => {
            setOccupant({ ...occupant, coverBonus: parseInt(e.target.value) });
          }} value={occupant.coverBonus} />
        </Col>
      </Form.Group>
      <Card>
        <Card.Header>Textures</Card.Header>
        <Card.Body>
          <ListGroup>
            {occupant.textures.map((texture: any, index: number) => <ListGroupItem>
              <TextureConfig texture={texture} graphics={props.graphics} onChange={(t: Texture) => {
                const textures = [...occupant.textures];
                textures[index] = t;
                setOccupant({ ...occupant, textures });
              }} />
            </ListGroupItem>)}
          </ListGroup>
        </Card.Body>
      </Card>
    </>
}