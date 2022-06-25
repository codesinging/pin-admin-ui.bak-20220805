import {createRouter, createWebHashHistory} from "vue-router";
import routes from '~pages';
import {appConfig, authConfig} from "../config";
import auth from "../utils/auth";

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from) => {
    if (to.path === '/') {
        return appConfig.home
    } else if (!authConfig.excludes.includes(to.path) && !auth.check()) {
        return authConfig.login
    }
})

export default router
