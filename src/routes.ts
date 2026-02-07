import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("./views/Home.vue")
    },
    {
        path: "/previous-games",
        name: "previous-games",
        component: () => import("./views/PreviousGames.vue")
    },
    {
        path: "/users",
        name: "users",
        component: () => import("./views/Users.vue")
    },
    {
        path: "/play",
        name: "play",
        component: () => import("./views/Play.vue")
    },
]

const router = createRouter({
    history: createWebHistory("/"),
    routes
})

export default router