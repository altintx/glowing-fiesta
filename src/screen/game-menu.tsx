import React from 'react';
import { Operator } from '../models/models';
export default function GameMenu({
    operator, 
    language,
    onNewGame, 
    onLogOut, 
    onFindGame, 
    onOptions 
}: { 
    operator: Operator,
    language: string,
    onNewGame: () => void, 
    onLogOut: () => void, 
    onFindGame: () => void, 
    onOptions: () => void 
}) {
    if(!operator) return <>Loading...</>
    return <>
        <h1>Game Menu</h1>
        <p>You're logged in as {operator.screenName} </p>
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