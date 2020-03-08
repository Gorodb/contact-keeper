import React from "react"
import ContactState from "../../context/contact/ContactState"
import AuthState from "../../context/auth/AuthState"

const withStates = (App) => {
    return (props) => {
        return (
            <AuthState>
                <ContactState>
                    <App {...props} />
                </ContactState>
            </AuthState>
        )
    }
}

export default withStates
