import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import withStates from "./components/hoc/withStates"
import './App.css'
import Navbar from "./components/navbar/Navbar"
import Home from "./components/pages/Home"
import About from "./components/pages/About"
import Registration from "./components/registration/Registration"
import Login from "./components/login/Login"
import Alert from "./components/alert/Alert"
import PrivateRoute from "./components/routing/PrivateRoute"

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Alert />
                <Switch>
                    <PrivateRoute exact path='/' component={Home} />
                    <Route exact path='/about' component={About} />
                    <Route exact path="/registration" component={Registration} />
                    <Route exact path="/login" component={Login} />
                </Switch>
            </div>
        </Router>
    )
}

export default withStates(App)
