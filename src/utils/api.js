import http from "./http";

class Api {
    _paths = []
    _config = {}

    constructor(resource = null, id = null) {
        resource !== null && this._paths.push(resource)
        id !== null && this._paths.push(id)
    }

    config(config = {}) {
        Object.assign(this._config, config)
        return this
    }

    label(label) {
        this._config.label = label
        return this
    }

    params(params) {
        this._config.params = params
        return this
    }

    message(showMessage) {
        this._config.message = !!showMessage
        return this
    }

    success(showSuccess) {
        this._config.success = !!showSuccess
        return this
    }

    error(showError) {
        this._config.error = !!showError
        return this
    }

    catch(returnCatch) {
        this._config.catch = !!returnCatch
        return this
    }

    url(path) {
        path = path ? (Array.isArray(path) ? path : [path]) : []
        return this._paths.concat(path).join('/')
    }

    get(path) {
        return http.get(this.url(path), this._config)
    }

    post(path, data) {
        return http.post(this.url(path), data, this._config)
    }

    put(path, data) {
        return http.put(this.url(path), data, this._config)
    }

    delete(path) {
        return http.delete(this.url(path), this._config)
    }

    list() {
        return this.get()
    }

    store(data) {
        return this.post(null, data)
    }

    update(data) {
        return this.put(data.id, data)
    }

    show(data) {
        return this.get(typeof data === 'object' ? data.id : data)
    }

    destroy(data) {
        return this.delete(typeof data === 'object' ? data.id : data)
    }
}
