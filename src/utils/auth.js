import {authConfig} from "../config";
import storage from "./storage";

const token = () => storage.get(authConfig.tokenKey)
const user = () => storage.get(authConfig.userKey)

const login = (token, user) => {
    storage.set(authConfig.tokenKey, token, authConfig.expire)
    storage.set(authConfig.userKey, user)
}

const logout = () => {
    storage.remove(authConfig.tokenKey)
    storage.remove(authConfig.userKey)
}

const check = () => {
    if (token() === null || user() === null) {
        logout()
        return false
    }

    return true
}

export default {
    token,
    user,
    login,
    logout,
    check
}
