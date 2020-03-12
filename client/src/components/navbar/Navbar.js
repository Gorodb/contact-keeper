import React, {Fragment, useContext} from "react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import authContext from "../../context/auth/authContext"
import contactContext from "../../context/contact/contactContext"

const Navbar = ({ title, icon }) => {
    const { isAuthenticated, logoutUser, user } = useContext(authContext)
    const { clearContacts } = useContext(contactContext)

    const onLogout = () => {
        logoutUser()
        clearContacts()
    }

    const authLinks = (
        <Fragment>
            <h3>Привет { user && user.name }</h3>
            <ul>
                <li>
                    <Link to={'/about'}>О приложении</Link>
                </li>
                <li>
                    <a onClick={onLogout} href="#">
                        <i className="fas fa-sign-out-alt" /> <span className="hide-sm">Выход</span>
                    </a>
                </li>
            </ul>
        </Fragment>
    )
    const guestLinks = (
        <Fragment>
            <ul>
                <li>
                    <Link to={'/registration'}>Зарегистрироваться</Link>
                </li>
                <li>
                    <Link to={'/login'}>Войти</Link>
                </li>
            </ul>
        </Fragment>
    )

    const preloader = () => {
        if (isAuthenticated === null) {
            return authLinks
        }
    }

    return (
        <div className="navbar bg-primary">
            <h1>
                <Link to={'/'}><i className={icon} /> {title}</Link>
            </h1>
                {isAuthenticated === null ? preloader() : isAuthenticated ? authLinks : guestLinks}
        </div>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
}

Navbar.defaultProps = {
    title: 'Contact Keeper',
    icon: 'fas fa-id-card-alt'
}

export default Navbar