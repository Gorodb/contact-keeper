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
    CLEAR_ERRORS,
    CLEAR_DB
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
    const loadUser = async () => {
        if (localStorage.token) {
            AuthService.setToken(localStorage.token)
            const { data: { success, data = '', error = '', code = 0 } } = await AuthService.getUser()

            success
                ? dispatch({
                    type: USER_LOADED,
                    payload: data
                })
                : dispatch({
                    type: AUTH_ERROR,
                    payload: { error: error, errorCode: code }
                })
        } else {
            dispatch({ type: LOGOUT })
        }
    }

    // Register user
    const register = async user => {
        const { data: { success, token = '', error = '', code = 0 } } = await AuthService.regUser(user)

        if (success) {
            localStorage.setItem('token', token)
            dispatch({
                type: REGISTER_SUCCESS,
                payload: token
            })
            await loadUser()
        } else {
            dispatch({
                type: REGISTER_FAIL,
                payload: { error: error, errorCode: code }
            })
        }
    }

    // Login user
    const loginUser = async (user) => {
        const { data: { success, token = '', error = '', code = 0 } } = await AuthService.authUser(user)

        if (success) {
            localStorage.setItem('token', token)
            dispatch({
                type: LOGIN_SUCCESS,
                payload: token
            })
            await loadUser()
        } else {
            dispatch({
                type: LOGIN_FAIL,
                payload: { error: error, errorCode: code }
            })
        }
    }

    // Logout user
    const logoutUser = async () => {
        await AuthService.logoutUser()

        dispatch({ type: LOGOUT })
    }

    // Clear errors
    const clearErrors = () => {
        dispatch({ type: CLEAR_ERRORS })
    }

    const clearDb = async () => {
        const { data: { success = false } } = await AuthService.clearDb()
        if (success) {
            dispatch({ type: CLEAR_DB })
        }
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
                clearErrors,
                clearDb
            }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState