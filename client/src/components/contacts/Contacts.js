import React, {Fragment, useContext, useEffect} from "react"
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import ContactContext from "../../context/contact/contactContext"

import ContactItem from "../contactItem/ContactItem"
import Spinner from "../spinner/Spinner"

const Contacts = () => {
    const { contacts, filtered, getContacts, loading } = useContext(ContactContext)

    useEffect(() => {
        getContacts()
    }, [])

    if (contacts !== null && contacts.length === 0 && !loading) {
        return <h4>Please add a contact</h4>
    }

    const renderContact = contact => (
        <CSSTransition key={contact.id} timeout={500} className="item" >
            <ContactItem contact={contact} />
        </CSSTransition>)

    return (
        <Fragment>
            { contacts !== null && !loading ? (
                <TransitionGroup>
                    { filtered ? filtered.map(renderContact) : contacts.map(renderContact) }
                </TransitionGroup>
            ) : <Spinner /> }
        </Fragment>
    )
}

export default Contacts