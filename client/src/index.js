import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import AuthService from "./services/authService";

if (localStorage.token) {
    AuthService.setToken(localStorage.token)
}

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
