import React, { ReactElement } from "react";

export function Obstacle(obstacle: { width: number, height: number, textures: [{ graphic: string }], destroyable: boolean, destructive: boolean, visible: boolean, row: number, column: number, tileDimension: number, rotate: number }): ReactElement {
    return <img
        src={obstacle.textures[0]['graphic'] + '.png'} 
        className='tile'
        style={{
            width: `${obstacle.tileDimension * obstacle.width}px`,
            height: `${obstacle.tileDimension * obstacle.height}px`,
            rotate: `-${obstacle.rotate}deg`,
            gridArea: `${obstacle.row} / ${obstacle.column} / ${obstacle.row + (obstacle.height - 1)} span / ${obstacle.column + (obstacle.width - 1)} span`,
        }}
    />;
}