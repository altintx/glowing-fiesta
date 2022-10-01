import React, { ReactElement, CSSProperties } from "react";
import "./selection-tile.css";

function parseColor(html: string): number[] {
    return [
        html.substring(1,3), 
        html.substring(3,5), 
        html.substring(5,7)
    ].map(hex => parseInt(hex, 16))
}

export function SelectionTile({x, y, size, tint, borderColor, borderThrob, onClick, enabled, hover, cursor,zoom}:{x: number, y: number, size: string, tint?: string, borderColor?: string, borderThrob?: boolean, onClick?: () => void, enabled: boolean, hover?: boolean, cursor?: string, zoom?: number }): ReactElement<HTMLDivElement>|null {
    let _opacity = 0;
    const _radiuses: { [key: string]: string } = {
        "-1": "4px",
        "0": "8px",
        "1": "12px",
        "2": "16px",
        "3": "20px" 
    }
    let style: CSSProperties = {
        borderWidth: "0.2em",
        borderStyle: "solid",
        borderRadius: zoom === undefined? "1em": _radiuses[zoom.toString()],
        boxSizing: "border-box",
        width: size,
        height: size,
        gridColumn: x,
        gridRow: y,
        cursor: cursor
    }
    let lighten = false;
    if(typeof tint === "string") {
        style.backgroundColor = tint;
        _opacity += 0.1;
    }
    if(!borderColor && borderThrob && typeof tint === 'string') {
        borderColor = tint;
        lighten = true;
    }
    if(typeof borderColor === "string") {
        if(borderColor[0] === '#' && borderColor.length === 7) {
            const [red, green, blue] = parseColor(borderColor);
            style.borderColor = `rgba(${red}, ${green}, ${blue}, ${lighten? 1 : 0.6})`;
        } else {
            style.borderColor = borderColor;
        }
    }
    if(hover) {
        _opacity += 0.2;
    }
    if(_opacity > 0) {
        style.opacity = _opacity;
    }
    const classes = ["tile"];
    if(borderThrob) {
        classes.push("animated-throbber");
    }
    if(enabled)
        return <div 
            className={classes.join(" ")}
            style={style}
            onClick={onClick}
        />
    else 
        return null;
}
