import {reactive, ref} from "vue";
import useStatus from "../states/status";

class Dialog {
    states = reactive({
        visible: false,
        title: '',
        subtitle: '',
    })

    icon = null

    label = null

    constructor(title = '', icon = null) {
        this.states.title = title
        this.icon = icon
        this.label = 'dialog_' + new Date().getTime()
    }

    open(subtitle) {
        subtitle && (this.states.subtitle = subtitle)
        this.states.visible = true
    }

    close() {
        this.states.visible = false
    }

    loading() {
        const status = useStatus()
        return status.get(this.label)
    }
}

const useDialog = (title, icon) => new Dialog(title, icon)

export default useDialog
