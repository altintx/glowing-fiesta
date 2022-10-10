import { useState } from "react";

export function TextureConfig(props: any) {
  const [graphic, setGraphic] = useState(props.texture.graphic);
  const [offset, setOffset] = useState(props.texture.offset);
  return <>
    <div className="texture-config">
      <div className="texture-config-header">
        <h3>Texture Config</h3>
      </div>
      <div className="texture-config-body">
        <div className="texture-config-row">
          <label>Graphic</label>
          <input type="text" value={graphic} onChange={(e) => setGraphic(e.target.value)} />
        </div>
        <div className="texture-config-row">
          <label>Offset X</label>
          <input type="text" value={offset.x} onChange={(e) => setOffset({ ...offset, x: e.target.value })} />
        </div>
        <div className="texture-config-row">
          <label>Offset Y</label>
          <input type="text" value={offset.y} onChange={(e) => setOffset({ ...offset, y: e.target.value })} />
        </div>
        <div className="texture-config-row">
          <label>Offset Z</label>
          <input type="text" value={offset.y} onChange={(e) => setOffset({ ...offset, y: e.target.value })} />
        </div>
      </div>
    </div>
  </>;
}