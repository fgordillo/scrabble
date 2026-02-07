<template>
    <div>
        <h1>Scrabble</h1>
        <p>Welcome to the Scrabble game!</p>
        <p>Use the navigation menu to explore different sections of the game.</p>
        <div>
            <p>
                <template v-if="thereIsAGameInProgress">
                    <span>A game is currently in progress. </span>
                    <router-link to="/play">Continue playing</router-link>
                </template>

                <router-link
                    v-else-if="users.length > 1"
                    to="/play"
                >
                    Play Game
                </router-link>
                
                <span v-else>
                    Play Game (requires at least 2 users)
                </span>
            </p>
            <p>
                <router-link
                    v-if="users.length > 0"
                    to="/users"
                >
                    Manage users
                </router-link>
                <router-link
                    v-else
                    to="/users"
                >
                    Add users so you can play
                </router-link>
            </p>
            <p v-if="games.length > 0">
                <router-link to="/previous-games">See previous games</router-link>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useScrabble } from "../scrabble"
const { games, users } = useScrabble()

const thereIsAGameInProgress = computed(() => {
    return games.value.some((g) => g.status === "playing")
})
</script>