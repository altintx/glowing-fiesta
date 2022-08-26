import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { io } from 'socket.io-client';
import "./index.css";

declare global {
  var highPerf: boolean;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
window['highPerf'] = false;
var socket = io();
root.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
