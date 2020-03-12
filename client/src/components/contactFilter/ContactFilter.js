import React, {useContext, useEffect, useRef} from "react"
import contactContext from "../../context/contact/contactContext"

const ContactFilter = () => {
    const { filtered, filterContacts, clearFilter } = useContext(contactContext)
    const text = useRef('')

    useEffect(() => {
        if (filtered === null) {
            text.current.value = ''
        }
    }, [filtered, text])

    const onChange = e => {
        text.current.value !== '' ? filterContacts(e.target.value) : clearFilter()
    }

    return (
        <form>
            <h2 className="text-primary">Список контактов</h2>
            <input ref={text} type="text" placeholder="Введите имя или email" onChange={onChange} />
        </form>
    )
}

export default ContactFilter