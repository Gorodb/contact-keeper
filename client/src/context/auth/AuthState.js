import React, { useReducer } from "react"

import AuthService from "../../services/authService"
import AuthContext from "./authContext"
import authReducer from './authReducer'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        error: null,
        errorCode: 0
    }

    const [state, dispatch] = useReducer(authReducer, initialState)

    // Load user
    const loadUser = () => {
        dispatch({
            type: USER_LOADED
        })
    }

    // Register user
    const register = async user => {
        const { data } = await AuthService.regUser(user)

        data.success
            ? dispatch({
                type: REGISTER_SUCCESS,
                payload: data.token
            })
            : dispatch({
                type: REGISTER_FAIL,
                payload: { error: data.error, errorCode: data.code }
            })
    }

    // Login user
    const loginUser = async (user) => {
        const { data } = await AuthService.authUser(user)

        data.success
            ? dispatch({
                type: LOGIN_SUCCESS,
                payload: data.token
            })
            : dispatch({
                type: LOGIN_FAIL,
                payload: { error: data.error, errorCode: data.code }
            })
    }

    // Logout user
    const logoutUser = () => {
        dispatch({
            type: LOGOUT
        })
    }

    // Clear errors
    const clearErrors = () => {
        dispatch({
            type: CLEAR_ERRORS
        })
    }

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                errorCode: state.errorCode,
                register,
                loadUser,
                loginUser,
                logoutUser,
                clearErrors
            }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState