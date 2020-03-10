import ApiService from "./apiService";

class AuthService extends ApiService {
    static regUser (user) {
        return this._postRequest(`/api/users`, user)
    }

    static authUser (user) {
        return this._postRequest(`/api/auth`, user)
    }
}

export default AuthService