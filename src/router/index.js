import VueRouter from "vue-router";

const routes = [
    {
        path: '/HomePage',
        name: 'HomePage',
        component: () => import('../components/HomePage.vue'),
        children: [
            {
                path: 'Aside',
                name: 'Aside',
                component: () => import('../components/Aside.vue')
            },
            {
                path: 'Header',
                name: 'Header',
                component: () => import('../components/Header.vue')
            },
            {
                path: 'Index',
                name: 'Index',
                component: () => import('../components/Index.vue')
            },
            {
                path: 'TreeInfo',
                name: 'TreeInfo',
                component: () => import('../components/TreeInfo.vue')
            },
            {
                path: 'TreeSearch',
                name: 'TreeSearch',
                component: () => import('../components/TreeSearch.vue')
            },
            {
                path: 'GraphSearch',
                name: 'GraphSearch',
                component: () => import('../components/GraphSearch.vue'),
                children: [
                    {
                        path: 'GraphShow',
                        name: 'GraphShow',
                        component: () => import('../components/GraphShow.vue'),
                    }
                ]
            },
            {
                path: 'Statistics',
                name: 'Statistics',
                component: () => import('../components/Statistics.vue')
            },
            {
                path: 'ClassifyInfo',
                name: 'ClassifyInfo',
                component: () => import('../components/ClassifyInfo.vue')
            },
            {
                path: 'PlaceInfo',
                name: 'PlaceInfo',
                component: () => import('../components/PlaceInfo.vue')
            },

        ]
    },
    {
        path: '/AdminLogin',
        name: 'AdminLogin',
        component: () => import('../components/AdminLogin.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export function resetRouter() {
    router.matcher = new VueRouter({
        mode: 'history',
        routes: []
    }).matcher
}

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

export default router;