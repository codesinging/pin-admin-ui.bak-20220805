import {authConfig} from "../config";
import storage from "./storage";
import api from "./api";
import useLayout from "../states/layout";

const token = () => storage.get(authConfig.tokenKey)
const user = () => storage.get(authConfig.userKey)

const set = (token, user) => {
    storage.set(authConfig.tokenKey, token, authConfig.expire)
    storage.set(authConfig.userKey, user)
}

const clear = () => {
    storage.remove(authConfig.tokenKey)
    storage.remove(authConfig.userKey)
}

const fresh = () => storage.set(authConfig.tokenKey, token(), authConfig.expire)

const check = () => {
    if (token() === null || user() === null) {
        clear()
        return false
    }

    fresh()

    return true
}

const logout = () => new Promise(resolve => {
    const layout = useLayout()

    api('auth/logout').label('logout').catch(true).put().finally(() => {
        clear()
        layout.clear()
        resolve()
    })
})

export default {
    token,
    user,
    set,
    clear,
    check,
    logout,
}
