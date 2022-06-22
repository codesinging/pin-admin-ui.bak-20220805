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
}
