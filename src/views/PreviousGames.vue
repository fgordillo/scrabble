<template>
    <div>
        <h1>{{ t("Previous Games") }}</h1>
        <div v-if="games.length === 0">
            {{ t("No games played yet.") }}
        </div>
        <table v-else>
            <thead>
                <tr>
                    <th>{{ t("Game") }}</th>
                    <th v-for="user in users" :key="user.id">
                        {{ user.name }}
                    </th>
                    <th>{{ t("Actions") }}</th>
                </tr>
            </thead>
            <tr v-for="game in games" :key="game.id">
                <td>{{ game.id }} - {{ t(game.status) }}</td>
                <td v-for="user in users" :key="user.id">
                    <span
                        v-if="
                            game.players.find(
                                (gp: GamePlayer) => gp.userId === user.id,
                            )
                        "
                    >
                        {{ getPlayerScore(game.id, user.id) }} {{ t("points") }}
                    </span>
                    <span v-else> - </span>
                </td>
                <td>
                    <button
                        class="bg-danger"
                        :title="t('Delete')"
                        :aria-label="t('Delete')"
                        @click="removeGame(game.id)"
                    >
                        <delete-icon />
                    </button>
                </td>
            </tr>
        </table>

        <router-link to="/">{{ t("Back to Home") }}</router-link>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useScrabble } from "../scrabble"
import DeleteIcon from "../components/DeleteIcon.vue"
import type { GamePlayer, Game } from "../types"

const { games, users, deleteGame } = useScrabble()
const { t } = useI18n()

function getPlayerScore(gameId: number, userId: number): number {
    const gp = games.value
        .find((g: Game) => g.id === gameId)
        ?.players.find((gp: GamePlayer) => gp.userId === userId)
    return gp ? gp.score : 0
}

function removeGame(gameId: number) {
    if (
        confirm(
            t(
                "Are you sure you want to delete this game? This action cannot be undone.",
            ),
        )
    ) {
        deleteGame(gameId)
    }
}
</script>
