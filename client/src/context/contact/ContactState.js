import React, { useReducer } from "react"
import ContactContext from "./contactContext"
import contactReducer from './contactReducer'
import ContactService from "../../services/contactsService"
import {
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    GET_CONTACTS,
    CONTACT_ERROR,
    CLEAR_CONTACTS
} from '../types'

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        loading: false
    }

    const [state, dispatch] = useReducer(contactReducer, initialState)

    // Get contacts
    const getContacts = async () => {
        const { data: { success, contacts = {}, error = null, code = 0 }} = await ContactService.getContacts()

        success
            ? dispatch({ type: GET_CONTACTS, payload: contacts })
            : dispatch({ type: CONTACT_ERROR, payload: { error, code } })
    }

    // Add contact
    const addContact = async contact => {
        const { data: { success, data = {}, error = null, code = 0 }} = await ContactService.crateContact(contact)

        success
            ? dispatch({ type: ADD_CONTACT, payload: data })
            : dispatch({ type: CONTACT_ERROR, payload: { error, code } })
    }

    // Delete contact
    const deleteContact = async id => {
        const { data: { success, error = null, code = 0 }} = await ContactService.deleteContact(id)

        success
            ? dispatch({ type: DELETE_CONTACT, payload: id })
            : dispatch({ type: CONTACT_ERROR, payload: { error, code } })
    }

    // Clear contacts
    const clearContacts = () => {
        dispatch({ type: CLEAR_CONTACTS })
    }

    // Set current contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact })
    }

    // Clear current contact
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT })
    }

    // Update contact
    const updateContact = async (contact) => {
        const { data: { success, data = {}, error = null, code = 0 }} = await ContactService.updateContact(contact.id, contact)

        success
            ? dispatch({ type: UPDATE_CONTACT, payload: data })
            : dispatch({ type: CONTACT_ERROR, payload: { error, code } })
    }

    // Filter contacts
    const filterContacts = (filter) => {
        dispatch({ type: FILTER_CONTACTS, payload: filter })
    }

    // Clear filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER })
    }

    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                current: state.current,
                filtered: state.filtered,
                addContact,
                deleteContact,
                setCurrent,
                clearCurrent,
                updateContact,
                filterContacts,
                clearFilter,
                getContacts,
                clearContacts
            }}>
            {props.children}
        </ContactContext.Provider>
    )
}

export default ContactState