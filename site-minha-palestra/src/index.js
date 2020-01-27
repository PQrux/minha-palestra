import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from "firebase";
import secret from "./secret";

if(process.env.REACT_APP_PRODUCTION !== "s"){
    console.log("VERSÃO DE DESENVOLVIMENTO");
}
else{
    console.log("VERSÃO DE PRODUÇÃO");
}

firebase.initializeApp(secret.firebase_key);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
