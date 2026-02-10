import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router"

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("./views/Home.vue"),
    },
    {
        path: "/previous-games",
        name: "previous-games",
        component: () => import("./views/PreviousGames.vue"),
    },
    {
        path: "/users",
        name: "users",
        component: () => import("./views/Users.vue"),
    },
    {
        path: "/play",
        name: "play",
        component: () => import("./views/Play.vue"),
    },
    {
        path: "/game/:id",
        name: "game",
        component: () => import("./views/GameDetail.vue"),
        props: (route: RouteLocationNormalized) => ({
            gameId: Number(route.params.id),
        }),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
