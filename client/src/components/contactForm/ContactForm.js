import React, { useState, useContext, useEffect } from "react"
import contactContext from "../../context/contact/contactContext"
import classes from './ContactForm.module.css'

const ContactForm = () => {
    const { addContact, current, clearCurrent, updateContact } = useContext(contactContext)

    const emptyContact = {
        name: '',
        email: '',
        phone: '',
        type: 'personal'
    }

    useEffect(() => {
        current ? setContact(current) : setContact(emptyContact)
    }, [current])

    const [contact, setContact] = useState(emptyContact)

    const { name, email, phone, type } = contact

    const onChange = (e) => setContact({
        ...contact,
        [e.target.name]: e.target.value
    })

    const onSubmit = e => {
        e.preventDefault()
        if (!current) {
            addContact(contact)
        } else {
            updateContact(contact)
            clearCurrent()
        }
        setContact(emptyContact)
    }

    const clearAll = () => {
        clearCurrent()
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? 'Редактировать контакт' : 'Добавить контакт' }</h2>
            <input type="text" placeholder="Имя" name="name" value={name} onChange={onChange} />
            <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
            <input type="text" placeholder="Телефон" name="phone" value={phone} onChange={onChange} />
            <h5>Contact type</h5>
            <span className={classes.radioInput}>
                <input type="radio" name="type" value="personal" checked={type === 'personal'} onChange={onChange} /> Линчый
            </span>
            <span>
                <input type="radio" name="type" value="professional" checked={type === 'professional'} onChange={onChange} /> Рабочий
            </span>
            <div>
                <input type="submit" value={current ? 'Обновить контакт' : 'Добавить контакт' } className="btn btn-primary btn-block" />
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Отмена</button>
            </div>}
        </form>
    )
}

export default ContactForm