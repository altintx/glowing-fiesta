function mainMenu({ login, language }: { login: (screenName: string) => void, language: string }) {
    const doLogin = () => {
        const name = prompt("Screen name?");
        if (name) {
            login(name);
        }
    }
    const english = language.substring(0,2) === 'en'; 
    return <>
        <h1>Main Menu</h1>
        {!english && <p>(TODO: Localize)</p>}
        <ul>
            <li>
                <button onClick={doLogin}>Login</button>
            </li>
        </ul>
    </>
}

export default mainMenu;