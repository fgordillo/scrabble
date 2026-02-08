import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
            },
        }),
    ],
    base: "/scrabble/",
})
