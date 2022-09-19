import React, { CSSProperties } from "react";

export function Menu({ children, style, className }: {children: React.ReactNode, style?: CSSProperties, className?: string}): JSX.Element {
    return <div className={className} style={{
        ...style,
        width: "040em",
        backgroundColor: "rgba(240, 240, 200, 0.6)",
        bottom: "1em",
        margin: "0 auto",
        padding: "1em",
    }}>
        {children}
    </div>
}