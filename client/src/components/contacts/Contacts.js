import React, {Fragment, useContext} from "react"
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import ContactContext from "../../context/contact/contactContext"

import ContactItem from "../contactItem/ContactItem"

const Contacts = () => {
    const { contacts, filtered } = useContext(ContactContext)

    if (contacts.length === 0) {
        return <h4>Please add a contact</h4>
    }

    const renderContact = contact => (
        <CSSTransition key={contact.id} timeout={500} className="item" >
            <ContactItem contact={contact} />
        </CSSTransition>)

    return (
        <Fragment>
            <TransitionGroup>
                { filtered ? filtered.map(renderContact) : contacts.map(renderContact) }
            </TransitionGroup>
        </Fragment>
    )
}

export default Contacts