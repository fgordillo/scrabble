import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            manifest: {
                name: "Scrabble Game",
                short_name: "Scrabble",
                description: "A scrabble game built with Vue 3 and Vite",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "https://cdn-icons-png.flaticon.com/128/18947/18947687.png",
                        sizes: "128x128",
                        type: "image/png",
                    },
                ],
            },
            registerType: "autoUpdate",
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
            },
        }),
    ],
    base: "/scrabble/",
})
