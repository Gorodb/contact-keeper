import React from "react"
import Contacts from "../contacts/Contacts"
import ContactForm from "../contactForm/ContactForm"
import ContactFilter from "../contactFilter/ContactFilter"

const Home = () => {
    return (
        <div className="grid-2">
            <div>
                <ContactForm />
            </div>
            <div>
                <ContactFilter />
                <Contacts />
            </div>
        </div>
    )
}

export default Home