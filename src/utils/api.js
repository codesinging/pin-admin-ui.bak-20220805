import http from "./http";

class Api {
    _paths = []
    _config = {}

    constructor(...paths) {
        this._paths = paths
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

    catch(returnCatch = true) {
        this._config.catch = !!returnCatch
        return this
    }

    url(...paths) {
        this._paths = this._paths.concat(paths)
        return this
    }

    _url() {
        return this._paths.join('/')
    }

    get(params = []) {
        this.params(params)
        return http.get(this._url(), this._config)
    }

    post(data) {
        return http.post(this._url(), data, this._config)
    }

    put(data) {
        return http.put(this._url(), data, this._config)
    }

    delete() {
        return http.delete(this._url(), this._config)
    }

    list(params = []) {
        return this.get(params)
    }

    store(data) {
        return this.post(data)
    }

    update(data) {
        return this.url(data.id).put(data)
    }

    show(id) {
        return this.url(id).get()
    }

    destroy(id) {
        return this.url(id).delete()
    }
}

export default (...paths) => new Api(...paths)
