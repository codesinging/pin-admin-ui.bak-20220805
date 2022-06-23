import {ElMessageBox} from "element-plus";
import 'element-plus/es/components/message-box/style/css'

export default ElMessageBox

export const alert = (message, title = '提示', options = {}) => ElMessageBox.alert(message, title, Object.assign({
    confirmButtonText: '确定'
}, options))

export const confirm = (message, title = '确认', options = {}) => ElMessageBox.confirm(message, title, Object.assign({
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
}, options))

export const prompt = (message, title = '请输入', options = {}) => ElMessageBox.prompt(message, title, Object.assign({
    confirmButtonText: '确定',
    cancelButtonText: '取消',
}))
