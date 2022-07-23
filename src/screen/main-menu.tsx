function mainMenu({ login }: { login: (screenName: string) => void }) {
    const doLogin = () => {
        const name = prompt("Screen name?");
        if (name) {
            login(name);
        }
    }
    return <>
        <h1>Main Menu</h1>
        <ul>
            <li>
                <button onClick={doLogin}>Login</button>
            </li>
        </ul>
    </>
}

export default mainMenu;