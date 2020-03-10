import React from "react"
import ContactState from "../../context/contact/ContactState"
import AuthState from "../../context/auth/AuthState"
import AlertState from "../../context/alert/AlertState"

const withStates = (App) => {
    return (props) => {
        return (
            <AuthState>
                <ContactState>
                    <AlertState>
                        <App {...props} />
                    </AlertState>
                </ContactState>
            </AuthState>
        )
    }
}

export default withStates
