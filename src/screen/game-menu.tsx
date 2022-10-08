import React from 'react';
import { Caption } from '../components/caption';
import { Menu } from '../components/menu';
import { Operator } from '../models/models';
export default function GameMenu({
    operator, 
    language,
    onNewGame, 
    onLogOut, 
    onFindGame, 
    onLevelEditor,
    onOptions 
}: { 
    operator: Operator,
    language: string,
    onNewGame: () => void, 
    onLogOut: () => void, 
    onFindGame: () => void, 
    onLevelEditor: () => void,
    onOptions: () => void 
}) {
    if(!operator) return <Caption>Loading...</Caption>
    return <Menu className="spacing-2">
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
                <button onClick={onLevelEditor}>Level Editor</button>
            </li>
            <li>
                <button onClick={onOptions}>Options</button>
            </li>
            <li>
                <button onClick={onLogOut}>Log Out</button>
            </li>
        </ul>
    </Menu>   
}