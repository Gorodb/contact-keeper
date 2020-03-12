import ApiService from "./apiService";

class AuthService extends ApiService {
    static regUser (user) {
        return this._postRequest(`/api/users`, user)
    }

    static authUser (user) {
        return this._postRequest(`/api/auth/login`, user)
    }

    static logoutUser () {
        return this._postRequest(`/api/auth/logout`)
    }

    static getUser () {
        return this._getRequest(`/api/auth/me`)
    }

    static clearDb () {
        return this._postRequest(`/api/secret/clear`)
    }

    static setToken (token) {
        this._setAuthToken(token)
    }
}

export default AuthService