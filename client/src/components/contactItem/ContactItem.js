import React, { useContext } from "react"
import PropTypes from 'prop-types'
import classes from './ContactItem.module.css'
import contactContext from "../../context/contact/contactContext"

const ContactItem = ({ contact }) => {
    const { deleteContact, setCurrent, clearCurrent } = useContext(contactContext)
    const { id, name, email, phone, type } = contact

    const typeLocal = type.toLowerCase() === 'professional' ? 'Рабочий' : 'Личный'
    const contactNameClasses = 'badge ' + (type === 'professional' ? 'badge-success' : 'badge-primary')

    const onDelete = () => {
        deleteContact(id)
        clearCurrent()
    }

    return (
        <div className="card bg-light">
            <h3 className="text-primary text-left">
                { name }
                <span className={`${contactNameClasses} ${classes.contactItem}`}>
                    {typeLocal}
                </span>
            </h3>
            <ul className="list">
                {email && (<li>
                    <i className="fas fa-envelope-open" />{ email }
                </li>)}
                {phone && (<li>
                    <i className="fas fa-phone" />{ phone }
                </li>)}
            </ul>
            <p>
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(contact)}>Отредактировать</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete} >Удалить</button>
            </p>
        </div>
    )
}

ContactItem.propTypes = {
    contact: PropTypes.object.isRequired
}

export default ContactItem