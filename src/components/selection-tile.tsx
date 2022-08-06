import React, { ReactElement, CSSProperties, HTMLAttributes } from "react";

export function SelectionTile({x, y, size, tint, borderColor, borderThrob, onClick, enabled}:{x: number, y: number, size: string, tint?: string, borderColor?: string, borderThrob?: boolean, onClick?: () => void, enabled: boolean}): ReactElement<HTMLDivElement>|null {
    let style: CSSProperties = {
        borderWidth: "0.2em",
        borderStyle: "solid",
        borderRadius: "0.5em",
        boxSizing: "border-box",
        width: size,
        height: size,
        gridColumn: x,
        gridRow: y

    }
    if(typeof tint === "string") {
        style.backgroundColor = tint;
        style.opacity = 0.2;
    }
    if(typeof borderColor === "string") {
        style.borderColor = borderColor;
    }
    if(enabled)
        return <div 
            className="tile"
            style={style}
            onClick={onClick}
        />
    else 
        return null;
}
