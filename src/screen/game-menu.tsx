import React from 'react';
export default function GameMenu({
    screenName, 
    language,
    onNewGame, 
    onLogOut, 
    onFindGame, 
    onOptions 
}: { 
    screenName: string, 
    language: string,
    onNewGame: () => void, 
    onLogOut: () => void, 
    onFindGame: () => void, 
    onOptions: () => void 
}) {
    return <>
        <h1>Game Menu</h1>
        <p>You're logged in as {screenName} </p>
        <ul>
            <li>
                <button onClick={onNewGame}>New Game</button>
            </li>
            <li>
                <button onClick={onFindGame}>Join Game</button>
            </li>
            <li>
                <button onClick={onOptions}>Options</button>
            </li>
            <li>
                <button onClick={onLogOut}>Log Out</button>
            </li>
        </ul>
    </>   
}