import React, { useState } from "react";
import { LocalizedString } from "../components/localized-string";
import { Menu } from "../components/menu";

export function Games({ games, connect, language, onBack }: { games?: any[], connect: (gameId: string) => void, language: string, onBack: () => void }): React.ReactElement {
  const [gameId, setGameId] = useState("");
  return <Menu className="spacing-2" style={{
    display: "flex"
  }}>
    <div style={{
        flex: 2
    }}>
        <h2>Public Games</h2>
        {!games && <p>Loading...</p>}
        {games && games.length === 0 && <p>No public games found.</p>}
        {games && games.length > 0 && <ul>
            {games.map(game => <li key={game.gameId}>
                <button onClick={() => connect(game.gameId)}><strong><LocalizedString language={language} translations={game.campaign} />: <LocalizedString language={language} translations={game.mission} /></strong> ({game.operators.length} Operators)</button>
            </li>)}
        </ul>}
    </div>
    <form style={{
        flex: 1
    }}
    onSubmit={(e) => {
        e.preventDefault();
        connect(gameId);
    }}>
        <h2>Private Games</h2>
        <hr />
        <label htmlFor="game-id">Game ID</label>
        <input type="text" id="game-id" value={gameId} onChange={e => setGameId(e.target.value)} />
        <button type="submit">Connect</button>
        <hr />
        <button onClick={onBack}><LocalizedString language={language} translations={{en: "Back"}} /></button>
    </form>
  </Menu>
}