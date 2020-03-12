import React, {useContext, useState, useEffect} from "react"
import authContext from "../../context/auth/authContext"
import alertContext from "../../context/alert/alertContext"

const Login = (props) => {
    const { setAlert } = useContext(alertContext)
    const { loginUser, error, errorCode, clearErrors, isAuthenticated } = useContext(authContext)

    const [user, setUser] = useState({
        email: '',
        password: ''
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

    const { email, password } = user

    const onchange = e => setUser({ ...user, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault()
        if (email === '' || password === '') {
            setAlert('Необходимо заполнить все поля', 'danger')
        } else {
            loginUser({ email, password })
        }
    }

    return (
        <div className='form-container'>
            <h1>Вход</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email} onChange={onchange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input type="password" name="password" value={password} onChange={onchange}/>
                </div>
                <input type="submit" value="Войти" className="btn btn-primary btn-block"/>
            </form>
        </div>
    )
}

export default Login
