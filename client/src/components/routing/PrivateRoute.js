import React, {useContext} from "react"
import { Redirect, Route } from 'react-router-dom'

import authContext from "../../context/auth/authContext"

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useContext(authContext)

    return (
        <Route {...rest} render={props => !isAuthenticated && !loading ? (
            <Redirect to='/login' />
        ) : (
            <Component {...props} />
        )} />
    )
}

export default PrivateRoute