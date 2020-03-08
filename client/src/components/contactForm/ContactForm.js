import React, { useState, useContext, useEffect } from "react"
import contactContext from "../../context/contact/contactContext"

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
            <h2 className="text-primary">{current ? 'Edit contact' : 'Add contact' }</h2>
            <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
            <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
            <input type="text" placeholder="Phone" name="phone" value={phone} onChange={onChange} />
            <h5>Contact type</h5>
            <input type="radio" name="type" value="personal" checked={type === 'personal'} onChange={onChange} /> Personal{' '}
            <input type="radio" name="type" value="professional" checked={type === 'professional'} onChange={onChange} /> Professional
            <div>
                <input type="submit" value={current ? 'Update contact' : 'Add contact' } className="btn btn-primary btn-block" />
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>Clear</button>
            </div>}
        </form>
    )
}

export default ContactForm