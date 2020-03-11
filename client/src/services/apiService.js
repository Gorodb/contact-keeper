import Axios from "axios"
import https from "https"

const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

const baseUrl = process.env.REACT_APP_API_URL

class ApiService {
    static async _postRequest (uri, body = {}) {
        const methodUrl = new URL(uri, baseUrl)
        try {
            return await axios.post(methodUrl.href, body)
        } catch (e) {
            return e.response
        }
    }

    static async _getRequest (uri, ...params) {
        const methodUrl = new URL(uri, baseUrl)
        if (params.length > 0) {
            params.forEach(value => methodUrl.searchParams.set(value[0], value[1]))
        }
        try {
            return await axios.get(methodUrl)
        } catch (e) {
            return e.response
        }
    }

    static async _putRequest (uri, body = {}) {
        const methodUrl = new URL(uri, baseUrl)
        try {
            return await axios.put(methodUrl.href, body)
        } catch (e) {
            return e.response
        }
    }

    static async _deleteRequest (uri) {
        const methodUrl = new URL(uri, baseUrl)
        try {
            return await axios.delete(methodUrl.href)
        } catch (e) {
            return e.response
        }
    }

    static _setAuthToken (token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }
}

export default ApiService