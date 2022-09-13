import { Menu } from "../components/menu";
import useLocalStorage from 'react-localstorage-hook';
import { useState } from "react";
import { LocalizedString, translate } from "../components/localized-string";

export default function MainMenu({ login, language }: { login: (screenName: string) => void, language: string }) {
    const [screenName, setScreenName] = useLocalStorage('screenName', undefined);
    const [screenNameInput, setScreenNameInput] = useState(screenName || '');
    const doLogin = (name: string) => {
        if (name) {
            setScreenName(name);
            login(name);
        }
    }
    const english = language.substring(0,2) === 'en'; 
    return <Menu>
        <h1><LocalizedString language={language} translations={{ en: "Main Menu" }}/></h1>
        <div style={{
            display: "flex",
        }}>
            <div style={{
                flex: 1,
            }}>
                {screenName && 
                    <button onClick={() => doLogin(screenName)}>Return as {screenName}</button>
                }
            </div>
            <div style={{
                flex: 1,
            }}>
                <form onSubmit={e => { e.preventDefault(); doLogin(screenNameInput)}}>
                    <label>
                        <LocalizedString language={language} translations={{ en: "Screen Name" }}/>
                        <input type="text" value={screenNameInput} onChange={(e) => setScreenNameInput(e.target.value)} />
                    </label>
                    <input type="submit" value={translate({ en: "Login" }, language)} />
                </form>
            </div>
        </div>
    </Menu>
}
