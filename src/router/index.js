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
        return {path: appConfig.home}
    } else if (!authConfig.excludes.includes(to.path) && !auth.check()) {
        return {path: authConfig.login}
    }
})

export default router
