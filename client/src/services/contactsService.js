import ApiService from "./apiService";

class ContactService extends ApiService {
    static getContact (id) {
        return this._getRequest(`/api/contacts/${id}`)
    }

    static getContacts () {
        return this._getRequest(`/api/contacts`)
    }

    static crateContact (contact) {
        return this._postRequest('/api/contacts', contact)
    }

    static updateContact (id, contact) {
        return this._putRequest(`/api/contacts/${id}`, contact)
    }

    static deleteContact (id) {
        return this._deleteRequest(`/api/contacts/${id}`)
    }
}

export default ContactService