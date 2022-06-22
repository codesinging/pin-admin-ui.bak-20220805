import {createRouter, createWebHashHistory} from "vue-router";
import routes from '~pages';
import {appConfig, authConfig} from "../config";
import auth from "../utils/auth";

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.path === '/'){
        next(appConfig.home)
    } else {
        if (authConfig.excludes.includes(to.path)){
            next()
        } else {
            if (auth.check()){
                next()
            } else {
                next(authConfig.login)
            }
        }
    }
})

export default router
