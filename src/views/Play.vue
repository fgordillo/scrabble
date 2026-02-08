<template>
    <div>
        <h1>{{ t("Play Game") }}</h1>
        <section v-if="!currentGame">
            <p>{{ t("No active game. Please create a new game first.") }}</p>
        </section>

        <template v-else>
            <participant-selection
                v-if="currentGame.status === 'waiting'"
                :users="users"
                :gamePlayers="currentGamePlayers"
                @toggle-player="togglePlayer"
                @select-all-participants="selectAllParticipants"
                @start-new-game="startNewGame"
            />

            <turn-registration
                v-else-if="
                    currentGame &&
                    currentGame.status === 'playing' &&
                    currentGame.currentTurnPlayerId
                "
                :game="currentGame"
                :gamePlayers="currentGamePlayers"
                :users="users"
                @end-game="endCurrentGame"
                @record-turn="recordTurn"
            />

            <section v-else-if="currentGame.status === 'finished'">
                <h2>{{ t("Game Finished") }}</h2>
                <p>{{ t("Final Scores") }}:</p>
                <ol>
                    <li v-for="pr in playersRanking" :key="pr.id">
                        {{ pr.name }}: {{ pr.score }} {{ t("points") }}
                    </li>
                </ol>
                <button @click="createGame">{{ t("Start New Game") }}</button>
            </section>
        </template>

        <p>
            <router-link class="mt-4" to="/">{{
                t("Back to Home")
            }}</router-link>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useScrabble } from "../scrabble"

import type { Game, GamePlayer, User } from "../types"
import TurnRegistration from "../components/TurnRegistration.vue"
import ParticipantSelection from "../components/ParticipantSelection.vue"

const {
    games,
    users,
    createGame,
    startGame,
    endGame,
    addPlayer,
    deletePlayer,
    recordTurn,
} = useScrabble()
const { t } = useI18n()

const currentGamePlayers = computed(() => {
    if (!currentGame.value) return []
    return currentGame.value.players as GamePlayer[]
})

const currentGame = computed(
    () => games.value[games.value.length - 1] as Game | null,
)

if (!currentGame.value || currentGame.value.status === "finished") {
    // If there's no game, we can start one immediately
    createGame()
}

const playersRanking = computed(() => {
    if (!currentGame.value) return []
    return [...currentGamePlayers.value]
        .sort((a: GamePlayer, b: GamePlayer) => b.score - a.score)
        .map((gp: GamePlayer) => {
            const user = users.value.find((u: User) => u.id === gp.userId)
            return {
                id: gp.id,
                name: user ? user.name : t("Unknown"),
                score: gp.score,
            }
        })
})

function togglePlayer(userId: number, checked: boolean) {
    if (!currentGame.value) return
    const gp = currentGamePlayers.value.find(
        (gp: GamePlayer) => gp.userId === userId,
    )
    if (checked) {
        addPlayer(currentGame.value.id, userId)
    } else {
        if (!gp) return
        deletePlayer(currentGame.value.id, gp.id)
    }
}

function selectAllParticipants() {
    if (!currentGame.value) return
    users.value.forEach((user: User) => {
        const gp = currentGamePlayers.value.find(
            (gp: GamePlayer) => gp.userId === user.id,
        )
        if (!gp) {
            addPlayer(currentGame.value!.id, user.id)
        }
    })
}

function startNewGame() {
    if (!currentGame.value) return
    if (currentGame.value.players.length < 2) {
        alert(t("At least 2 players are required to start the game"))
        return
    }
    startGame(currentGame.value.id)
}

function endCurrentGame() {
    if (currentGame.value) {
        endGame(currentGame.value.id)
    }
}
</script>
