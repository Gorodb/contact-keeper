import React, {useContext} from "react"
import authContext from "../../context/auth/authContext"

const ClearDb = () => {
    const { clearDb } = useContext(authContext)

    return (
        <div>
            <button className="btn btn-primary" onClick={() => clearDb()}>Очистить БД</button>
        </div>
    )
}

export default ClearDb