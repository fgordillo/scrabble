<template>
    <div v-if="game">
        <h1>{{ t("Game") }} {{ game.id }}</h1>
        <table v-if="game.turns.length > 0">
            <thead>
                <tr>
                    <th>{{ t("Turn") }}</th>
                    <th>{{ t("Player") }}</th>
                    <th>{{ t("Word") }}</th>
                    <th>{{ t("Score") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="turn in game.turns" :key="turn.id">
                    <td>{{ turn.id }}</td>
                    <td>{{ getName(turn.playerId) }}</td>
                    <td>{{ turn.word }}</td>
                    <td>{{ turn.score }}</td>
                </tr>
            </tbody>
        </table>
        <div v-else>
            {{ t("No turns played yet.") }}
        </div>

        <h2>{{ t("Ranking") }}</h2>
        <table>
            <thead>
                <tr>
                    <th>{{ t("Player") }}</th>
                    <th>{{ t("Score") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="player in rankedPlayers"
                    :key="player.id"
                >
                    <td>{{ getName(player.id) }}</td>
                    <td>{{ player.score }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-else>
        {{ t("Game not found.") }}
    </div>

    <router-link to="/">{{ t("Back to Home") }}</router-link>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useScrabble } from "../scrabble"
import type { Game, GamePlayer } from "../types"

const { games, users } = useScrabble()
const { t } = useI18n()

const { gameId } = defineProps<{ gameId: number }>()

const game = computed<Game | undefined>(
    () => games.value.find((g) => g.id === gameId),
)

const rankedPlayers = computed(() => {
    if (!game.value) return []
    const playerScores: { id: GamePlayer["id"]; score: GamePlayer["score"] }[] = game.value.players.map(
        (p: GamePlayer) => ({
            id: p.id,
            score: game.value?.turns
                .filter((t) => t.playerId === p.id)
                .reduce((sum, t) => sum + t.score, 0) ?? 0,
        }),
    )
    return playerScores.sort((a, b) => b.score - a.score)
})

function getName(playerId: number): string {
    const player = game.value?.players.find((p) => p.id === playerId)
    if (!player) return t("Unknown")
    const user = users.value.find((u) => u.id === player.userId)
    return user ? user.name : t("Unknown")
}
</script>