import Axios from "axios"
import https from "https"

const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

const url = process.env.REACT_APP_API_URL

class ApiService {
    static async _postRequest (uri, body = {}) {
        const method_url = `${url}${uri}`
        try {
            return await axios.post(method_url, body)
        } catch (e) {
            return e.response
        }
    }
}

export default ApiService