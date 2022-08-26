import { Menu } from "../components/menu";

function mainMenu({ login, language }: { login: (screenName: string) => void, language: string }) {
    const doLogin = () => {
        const name = prompt("Screen name?");
        if (name) {
            login(name);
        }
    }
    const english = language.substring(0,2) === 'en'; 
    return <Menu>
        <h1>Main Menu</h1>
        {!english && <p>(TODO: Localize)</p>}
        <ul>
            <li>
                <button onClick={doLogin}>Login</button>
            </li>
        </ul>
    </Menu>
}

export default mainMenu;