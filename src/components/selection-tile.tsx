import React, { ReactElement, CSSProperties, HTMLAttributes } from "react";
import "./selection-tile.css";

function parseColor(html: string): number[] {
    return [
        html.substring(1,3), 
        html.substring(3,5), 
        html.substring(5,7)
    ].map(hex => parseInt(hex, 16))
}

export function SelectionTile({x, y, size, tint, borderColor, borderThrob, onClick, enabled, hover}:{x: number, y: number, size: string, tint?: string, borderColor?: string, borderThrob?: boolean, onClick?: () => void, enabled: boolean, hover?: boolean }): ReactElement<HTMLDivElement>|null {
    let _opacity = 0;
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
