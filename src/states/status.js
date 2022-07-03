import {defineStore} from "pinia";

const useStatus = defineStore('status', {
    state: () => ({
        status: {
            loading: false,
        }
    }),

    getters: {
        get: state => {
            return (...keys) => !!state.status[keys.join('_')]
        },
        any: state => {
            return (...labels) => labels.map(label => state.status[label]).every(status => !!status)
        }
    },

    actions: {
        set(...keys) {
            this.status[keys.join('_')] = true
        },

        unset(...keys) {
            this.status[keys.join('_')] = false
        }
    },
})

export default useStatus
