import {createRouter, createWebHashHistory} from "vue-router";
import routes from '~pages';
import {appConfig, authConfig} from "../config";
import useAuth from "../states/auth.js";

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from) => {
    const auth = useAuth()

    if (to.path === '/') {
        return appConfig.home
    } else if (!authConfig.excludes.includes(to.path) && !auth.check()) {
        return authConfig.login
    }
})

export default router
