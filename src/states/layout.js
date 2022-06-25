import {defineStore} from "pinia";
import {layoutConfig} from "../config";
import api from "../utils/api";
import {listToTree, treePath} from "../utils/tree";
import {warning} from "../utils/message";

const useLayout = defineStore('layout', {
    state: () => ({
        collapsed: layoutConfig.collapsed,
        initialized: false,
        pages: [],
        menus: [],
        tabs: [],
        activeMenu: null,
        activeTab: null,
    }),

    getters: {
        homeMenu(state) {
            return state.menus.find(menu => menu.default)
        },

        homeTab() {
            return this.homeMenu?.page
        },

        menuTree(state) {
            return listToTree(state.menus)
        },

        activePaths(state) {
            return state.activeMenu ? treePath(this.menuTree, 'id', state.activeMenu?.id) : (this.activeTab ? [this.activeTab] : [])
        },

        openedMenuIds(state) {
            return state.menus.filter(menu => menu.opened).map(menu => menu.id)
        },

        hasTab(state) {
            return id => state.tabs.findIndex(tab => tab.id === id) !== -1
        },

        findTabById(state) {
            return id => state.tabs.find(tab => tab.id === id)
        },

        isDefaultTab(state) {
            return id => this.findMenuByPageId(id)?.default
        },

        findPageById(state) {
            return id => state.pages.find(page => page.id === id)
        },

        findPageByPath(state) {
            return path => state.pages.find(page => page.path === path)
        },

        findMenuById(state) {
            return id => state.menus.find(menu => menu.id === id)
        },

        findMenuByPageId(state) {
            return id => state.menus.find(menu => menu.page?.id === id)
        },

        hasPage(state) {
            return path => state.pages.findIndex(page => page.path === path) !== -1
        },
    },

    actions: {
        toggleCollapsed() {
            this.collapsed = !this.collapsed
        },

        setMenus(menus) {
            menus = menus || []

            menus.forEach(menu => {
                menu.id = menu.id.toString()
                if (menu.parent_id) {
                    menu.parent_id = menu.parent_id.toString()
                }
            })

            this.menus = menus
        },

        setPages(pages) {
            this.pages = pages
        },

        activateMenu(menu) {
            this.activeMenu = menu ?? null
        },

        activateTab(page) {
            if (page) {
                this.activeTab = page
            }
        },

        addTab(page) {
            if (page && !this.hasTab(page.id)) {
                this.tabs.push(page)
            }
        },

        openPage(page) {
            if (typeof page === 'string') {
                page = this.findPageByPath(page)
            }
            if (page) {
                this.addTab(page)
                this.activateTab(page)
                this.activateMenu(this.findMenuByPageId(page.id))
            } else {
                warning('页面不存在或无访问权限')
            }
        },

        selectMenu(index) {
            const menu = this.findMenuById(index)
            this.activateMenu(menu)
            this.activateTab(menu.page)
            this.addTab(menu.page)
        },

        load() {
            return new Promise((resolve, reject) => {
                if (this.initialized) {
                    resolve()
                } else {
                    Promise.all([
                        api('auth/menus').catch(true).message(false).get(),
                        api('auth/pages').catch(true).message(false).get(),
                    ]).then(responses => {
                        this.setMenus(responses[0])
                        this.setPages(responses[1])
                        this.addTab(this.homeTab)
                        this.initialized = true
                        resolve()
                    }).catch(() => {
                        reject()
                    })
                }
            })
        },

        init(route) {
            const page = this.findPageByPath(route.path)

            if (page) {
                this.addTab(page)
                this.activateTab(page)
                this.activateMenu(this.findMenuByPageId(page.id))
            }
        },

        clear() {
            this.collapsed = layoutConfig.collapsed
            this.initialized = false
            this.menus = []
            this.pages = []
            this.tabs = []
            this.activeMenu = null
            this.activeTab = null
        }
    }
})

export default useLayout
