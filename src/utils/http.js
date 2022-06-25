import message from "./message";
import useStatus from "../states/status";
import axios from "axios";
import {httpConfig} from "../config";
import auth from "./auth";

const defaultLabel = 'loading'

/**
 * 设置请求状态
 * @param label
 */
const setStatus = label => {
    const status = useStatus()
    status.set(defaultLabel)
    if (label) {
        status.set(label)
    }
}

/**
 * 重置请求状态
 * @param label
 */
const unsetStatus = label => {
    const status = useStatus()
    status.unset(defaultLabel)
    if (label) {
        status.unset(label)
    }
}

/**
 * 控制台输出错误
 * @param title
 * @param content
 */
const showLog = (title, content) => {
    console.log(title, ':', content)
}

/**
 * 显示成功信息，如果配置中设置了 message 或者 success ，则显示提示信息
 * @param content
 * @param config
 */
const showSuccess = (content, config) => {
    if (config.message !== false && config.success !== false && !!content) {
        message.success(content)
    }
}

/**
 * 显示错误信息，如果配置中设置了 message 或者 error ，则显示提示信息
 * @param content
 * @param config
 */
const showError = (content, config) => {
    if (!!content && (!config || (config.message !== false && config.error !== false))) {
        message.error(content)
    }
}

/**
 * 初始化配置信息
 * @param config
 * @returns {{}|*}
 */
const initConfig = config => {
    config = typeof config === 'string' ? {label: config} : config

    config.message = config.message ?? true
    config.success = config.success ?? true
    config.error = config.error ?? true
    config.catch = config.catch ?? false

    setStatus(config.label)

    return config
}

/**
 * 处理请求
 * @param request
 * @param config
 */
const handle = (request, config) => {
    // 为了避免原请求 Promise 中没有响应结果也会执行 then 回调，重新封装一层 Promise。
    return new Promise((resolve, reject) => {
        request.then(res => {
            if (res.status === 200 && res?.data?.code === 0) {
                showSuccess(res?.data?.message, config)
                if (res?.data?.data !== undefined) {
                    resolve(res.data.data)
                }
            } else {
                let error = `[${res.data?.code}]${res.data.message || res.statusText || '请求响应结果错误'}`

                showError(error, config)
                showLog('[900100]http response status error', error)

                if (config.catch) {
                    reject(error)
                }
            }
        }).catch(error => {
            let status = error.response?.status || error.status
            let detail = error.response || error.toJSON()

            let content = error.response?.data?.message || error.response?.message || error.message || '请求响应错误'
            content = (status === null || status === undefined) ? '网络或服务器连接错误' : `[${status}]${content}`

            if (status === 401) {
                showError('[900101]授权令牌失效，请重新登录')
                auth.logout()
            } else {
                showError(content, config)
            }

            showLog('[900102]http response error', detail)

            if (config.catch) {
                reject(content)
            }
        }).finally(() => {
            unsetStatus(config.label)
        })
    })
}

// 新建一个 axios 请求实例
const http = axios.create(httpConfig)

// 请求拦截器中添加认证信息
http.interceptors.request.use(config => {
    if (auth.token()) {
        config.headers.Authorization = 'Bearer ' + auth.token()
    }

    return config
})

// 对外暴露方法
export default {
    get: (url, config = {}) => {
        config = initConfig(config)
        return handle(http.get(url, config), config)
    },

    post: (url, data = {}, config = {}) => {
        config = initConfig(config)
        return handle(http.post(url, data, config), config)
    },

    put: (url, data = {}, config = {}) => {
        config = initConfig(config)
        return handle(http.put(url, data, config), config)
    },

    delete: (url, config = {}) => {
        config = initConfig(config)
        return handle(http.delete(url, config), config)
    },
}
