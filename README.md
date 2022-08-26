[Glowing-Fiesta](https://www.github.com/altintx/glowing-fiesta) is an HTML front end for
[Urban-Memory](https://www.github.com/altintx/urban-memory). Together they form an unnamed
game. It's a tactical, turn based war strategy game. 

At this point, things are not yet very game-like. There's no design, no theme, animation, 
anything conventional toward a game. 

Eventually this will be a single or multi-player game. Single player is effectively a
multiplayer game session with a single connected player. Urban Memory holds game state, rule
enforcement, turn ordering, stuff like that. Glowing Fiesta is what a normal user would
start. 

Single player will pit human versus AI. Human controls the "good" guys, while the AI
controls the "bad" guys. 

Multiplayer will have 2 modes: cooperative and competitive. 

Cooperative mode plays like single player, but control of the "good" characters is shared
amongst players. Subject to change, this will be between 1-6 humans. 

Competitive mode is styled like PVP. There is no AI. One human controls the entire
"good" squad of characters, while the other human controls the entire "bad" squad.

## Running

1. Clone both repos.
2. I think it's easiest to start with urban-memory
3. `cd urban-memory`
4. `yarn`
5. `yarn serve`
6. `cd glowing-fiesta`
7. `yarn`
8. `DANGEROUSLY_DISABLE_HOST_CHECK=1 yarn start`
9. A tab will open and launch into a playfield.
10. For debug's sake, initial set up is scripted away, but to work on those hidden features set `const accelDebug = false;` in `src/App.tsx:componentDidMount`