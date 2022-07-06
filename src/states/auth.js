import {defineStore} from "pinia";
import storage from "../utils/storage.js";
import {authConfig} from "../config.js";

const useAuth = defineStore('auth', {
    state: () => ({
        _token: storage.get(authConfig.tokenKey),
        user: storage.get(authConfig.userKey),
        expire: storage.get(authConfig.expireKey, 0),
    }),

    actions: {
        expireTime(){
            return new Date().getTime() + authConfig.expire
        },

        expired(){
            return this.expire < new Date().getTime()
        },

        token(){
            if (this.expired()){
                this.clear()
                return null
            }

            this.fresh()

            return this._token
        },

        set(token, user) {
            this._token = storage.set(authConfig.tokenKey, token)
            this.user = storage.set(authConfig.userKey, user)
            this.expire = storage.set(authConfig.expireKey, this.expireTime())
        },

        update(user) {
            this.user = storage.set(authConfig.userKey, user)
        },

        clear() {
            this._token = null
            this.user = null
            this.expire = 0
            storage.remove(authConfig.tokenKey)
            storage.remove(authConfig.userKey)
            storage.remove(authConfig.expireKey)
        },

        fresh() {
            this.expire = storage.set(authConfig.expireKey, this.expireTime())
        },

        check() {
            if (!this._token || !this.user || this.expired()) {
                this.clear()
                return false
            }

            this.fresh()

            return true
        },
    }
})

export default useAuth
