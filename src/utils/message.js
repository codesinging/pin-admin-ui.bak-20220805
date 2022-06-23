import {ElMessage} from "element-plus";
import 'element-plus/es/components/message/style/css'

export default ElMessage

export const success = (message) => {
    ElMessage({
        type: 'success',
        message,
        showClose: true,
    })
}

export const warning = (message) => {
    ElMessage({
        type: 'warning',
        message,
        showClose: true,
    })
}

export const info = (message) => {
    ElMessage({
        type: 'info',
        message,
        showClose: true,
    })
}

export const error = (message) => {
    ElMessage({
        type: 'error',
        message,
        showClose: true,
    })
}
