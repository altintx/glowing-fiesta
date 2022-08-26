import React from "react";

export function Menu({ children }: {children: React.ReactNode}): JSX.Element {
    return <div style={{
        width: "040em",
        backgroundColor: "rgba(240, 240, 200, 0.6)",
        bottom: "1em",
        margin: "0 auto",
    }}>
        {children}
    </div>
}