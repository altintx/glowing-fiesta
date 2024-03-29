import { Menu } from "../components/menu";
import useLocalStorage from 'react-localstorage-hook';
import { useRef, useState } from "react";
import { LocalizedString, translate } from "../components/localized-string";
import { Col, Form, FormGroup, Row } from "react-bootstrap";

export default function MainMenu({ login, language }: { login: (screenName: string) => void, language: string }) {
    const [screenName, setScreenName] = useLocalStorage('screenName', undefined);
    const highPerfModeCheckbox = useRef<HTMLInputElement>(null);
    const [screenNameInput, setScreenNameInput] = useState(screenName || '');
    const doLogin = (name: string) => {
        if (name) {
            setScreenName(name);
            login(name);
        }
    }
    return <Menu className="spacing-2">
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
        <Form.Group as={Row} controlId="tile-openable">
          <Form.Label column sm={3}><LocalizedString language={language} translations={{ en: "High Performance Mode" }}/></Form.Label>
          <Col sm={9}>
            <Form.Check ref={highPerfModeCheckbox} type="checkbox" className="mb-3" onChange={(e) => {
                window['highPerf'] = e.target.checked;
            }} />
          </Col>
        </Form.Group>
    </Menu>
}
