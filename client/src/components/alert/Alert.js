import React, {useContext} from "react"
import alertContext from "../../context/alert/alertContext"

const Alert = () => {
    const { alerts, setAlert } = useContext(alertContext)

    return (
        alerts.length > 0 && alerts.map(alert => (
            <div className={`alert alert-${alert.type}`} key={alert.id}>
                <i className="fas fa-info-circle"/> {alert.msg}
            </div>
        ))
    )
}

export default Alert
