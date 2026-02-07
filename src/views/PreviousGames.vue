<template>
    <div>
        <h1>Previous Games</h1>
        <div v-if="games.length === 0">
            No games played yet.
        </div>
        <table v-else>
            <thead>
                <tr>
                    <th>Game</th>
                    <th v-for="user in users" :key="user.id">{{ user.name }}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tr
                v-for="game in games"
                :key="game.id"
            >
                <td>Game {{ game.id }} - {{ game.status }}</td>
                <td
                    v-for="user in users"
                    :key="user.id"
                >
                    <span v-if="game.players.find((gp: GamePlayer) => gp.userId === user.id)">
                        {{ getPlayerScore(game.id, user.id) }} points
                    </span>
                    <span v-else>
                        -
                    </span>
                </td>
                <td>
                    <button class="bg-danger" @click="removeGame(game.id)">Delete</button>
                </td>
            </tr>
        </table>

        <router-link to="/">Back to Home</router-link>
    </div>
</template>

<script setup lang="ts">
import { useScrabble } from "../scrabble"
import type { GamePlayer, Game } from "../types"
const { games, users, deleteGame } = useScrabble()

function getPlayerScore(gameId: number, userId: number): number {
    const gp = games.value.find((g: Game) => g.id === gameId)?.players.find((gp: GamePlayer) => gp.userId === userId)
    return gp ? gp.score : 0
}

function removeGame(gameId: number) {
    if (confirm("Are you sure you want to delete this game? This action cannot be undone.")) {
        deleteGame(gameId)
    }
}
</script>