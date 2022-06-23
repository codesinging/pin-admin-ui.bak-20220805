import {ElNotification} from "element-plus";
import 'element-plus/es/components/notification/style/css'

export default ElNotification

export const success = (message, title = '提示', options = {}) => ElNotification(Object.assign({
    type: 'success',
    message,
    title
}, options))

export const warning = (message, title = '提示', options = {}) => ElNotification(Object.assign({
    type: 'warning',
    message,
    title
}, options))

export const info = (message, title = '提示', options = {}) => ElNotification(Object.assign({
    type: 'info',
    message,
    title
}, options))

export const error = (message, title = '提示', options = {}) => ElNotification(Object.assign({
    type: 'error',
    message,
    title
}, options))
