import React, { useContext, useState, useEffect } from "react"
import alertContext from "../../context/alert/alertContext"
import authContext from "../../context/auth/authContext"

const Registration = (props) => {
    const { setAlert } = useContext(alertContext)
    const { register, error, errorCode, clearErrors, isAuthenticated } = useContext(authContext)

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/')
        }

        if (errorCode > 0) {
            setAlert(error, 'danger')
            clearErrors()
        }
    }, [error, isAuthenticated, props.history])

    const { name, email, password, password2 } = user

    const onchange = e => setUser({ ...user, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault()
        if (name === '' || email === '' || password === '' || password2 === '') {
            setAlert('Please enter all fields', 'danger')
        } else if (password !== password2) {
            setAlert('Password do not match', 'danger')
        } else {
            register({ name, email, password })
        }
    }

    return (
        <div className='form-container'>
            <h1>
                Account <span className="text-primary">Register</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Имя</label>
                    <input type="text" name="name" value={name} onChange={onchange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" required name="email" value={email} onChange={onchange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input type="password" required minLength={6} name="password" value={password} onChange={onchange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Подтверждение пароля</label>
                    <input type="password" name="password2" value={password2} onChange={onchange}/>
                </div>
                <input type="submit" required value="Register" className="btn btn-primary btn-block"/>
            </form>
        </div>
    )
}

export default Registration
