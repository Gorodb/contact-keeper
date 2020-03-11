import React, {Fragment, useContext} from "react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import authContext from "../../context/auth/authContext"

const Navbar = ({ title, icon }) => {
    const { isAuthenticated, logoutUser, user } = useContext(authContext)

    const onLogout = () => {
        logoutUser()
    }

    const authLinks = (
        <Fragment>
            <h3>Hello { user && user.name }</h3>
            <ul>
                <li>
                    <Link to={'/'}>Home</Link>
                </li>
                <li>
                    <Link to={'/about'}>About</Link>
                </li>
                <li>
                    <a onClick={onLogout} href="#">
                        <i className="fas fa-sign-out-alt" /> <span className="hide-sm">Logout</span>
                    </a>
                </li>
            </ul>
        </Fragment>
    )
    const guestLinks = (
        <Fragment>
            <ul>
                <li>
                    <Link to={'/registration'}>Registration</Link>
                </li>
                <li>
                    <Link to={'/login'}>Login</Link>
                </li>
            </ul>
        </Fragment>
    )

    const preloader = () => {
        if (isAuthenticated === null) {
            return (
                <div>loading...</div>
            )
        }
    }

    return (
        <div className="navbar bg-primary">
            <h1>
                <Link to={'/'}><i className={icon} /> {title}</Link>
            </h1>
                {isAuthenticated === null ? preloader : isAuthenticated ? authLinks : guestLinks}
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