import "./caption.css";

export function Caption({children}: { children: React.ReactNode }) {
    return children? <h1
        className="motion"
        style={{
            position: "absolute",
            bottom: '1em',
            width: '100%',
            zIndex: 1000,
            textAlign: 'center',
            textShadow: '2px 2px white',
            animationIterationCount: 'infinite',
        }}
    >{children}</h1>: null;
}