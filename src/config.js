export const appConfig = {
    name: '品凡后台管理系统',
    home: '/home',
}

export const storageConfig = {
    prefix: 'pin_admin__',
    driver: window.localStorage,
}

export const authConfig = {
    expire: 3600000,
    login: '/login',
    tokenKey: 'auth_token',
    userKey: 'auth_user',
    excludes: [
        '/login',
    ],
}

export const httpConfig = {
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10 * 1000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
}
