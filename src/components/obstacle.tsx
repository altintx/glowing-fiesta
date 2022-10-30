import React, { ReactElement } from "react";
import { translate } from "./localized-string";

export function Obstacle(obstacle: { width: number, height: number, textures: [{ graphic: string }], destroyable: boolean, destructive: boolean, visible: boolean, row: number, column: number, tileDimension: number, rotate: number }): ReactElement {
    return <img
        alt={translate({ en: "Obstacle" }, "en")}
        src={obstacle.textures[0]['graphic']} 
        className='tile'
        style={{
            width: `${obstacle.tileDimension * obstacle.width}px`,
            zIndex: 100,
            height: `${obstacle.tileDimension * obstacle.height}px`,
            // rotate: `-${obstacle.rotate}deg`, // this worked well with assets that weren't to perspective but awful with perspective
            gridArea: `${obstacle.row + 1} / ${obstacle.column + 1} / ${obstacle.row + obstacle.height} span / ${obstacle.column + obstacle.width} span`,
        }}
    />;
}