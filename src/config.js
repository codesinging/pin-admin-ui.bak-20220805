export const appConfig = {
    name: '品凡后台管理系统',
    home: '/home',
}

export const storageConfig = {
    prefix: 'pin_admin__',
    driver: window.localStorage,
}

export const authConfig = {
    expire: 3600 * 1000,
    login: '/login',
    forbidden: '/forbidden',
    tokenKey: 'auth_token',
    userKey: 'auth_user',
    expireKey: 'auth_expire',
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

export const layoutConfig = {
    collapsed: false,
    sidebarWidth: 200,
    sidebarCollapseWidth: 54,
}
