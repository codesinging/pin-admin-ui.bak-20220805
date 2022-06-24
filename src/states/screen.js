import {defineStore} from "pinia";

const useScreen = defineStore('screen', {
    state: () => ({
        visible: false,
        text: '',
    }),

    actions: {
        show(text) {
            this.visible = true
            this.text = text
        },

        hide(timeout = 0) {
            setTimeout(() => {
                this.visible = false
                this.text = ''
            }, timeout)
        }
    }
})
