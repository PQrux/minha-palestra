import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from "firebase";
import "firebase/auth";
import secret from "./secret";
import $ from "jquery";
import strings from "./strings.json";

window.strings = strings;
window.app_version = "1.0.0";
firebase.initializeApp(secret.firebase_key);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

setTimeout(function () {
    let viewheight = $(window).height();
    let viewwidth = $(window).width();
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
}, 300);

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
