import { Card, Row, Form, Col } from "react-bootstrap";

export function MapConfig(
  {
    width,
    height,
    setWidth,
    setHeight,
    updateGrid
  }: {
    width: number,
    height: number,
    setWidth: React.Dispatch<React.SetStateAction<number>>,
    setHeight: React.Dispatch<React.SetStateAction<number>>,
    updateGrid: (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => void
  }
) {
  return <Card>
    <Card.Header>
      <h5>Map Config</h5>
    </Card.Header>
    <Card.Body>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="inputWidth">Width</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="number"
            id="inputWidth"
            value={width}
            onChange={e => updateGrid(setWidth, e.target.value)}
            aria-describedby="widthHelpBlock"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} htmlFor="inputHeight">Height</Form.Label>
          <Col sm={9}>
            <Form.Control
              type="number"
              onChange={e => updateGrid(setHeight, e.target.value)}
              value={height}
              id="inputHeight"
              aria-describedby="heightHelpBlock"
            />
          </Col>
        </Form.Group>
    </Card.Body>
  </Card>
}