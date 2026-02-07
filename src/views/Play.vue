<template>
    <div>
        <h1>Play Game</h1>
        <section v-if="!currentGame">
            <p>No active game. Please create a new game first.</p>
        </section>

        <template v-else>
            <section v-if="currentGame.status === 'waiting'">
                <h2>Select the participants</h2>
                <div v-if="users.length === 0">No users available. <router-link to="/users">Please add users first.</router-link></div>
                <input-checkbox
                    v-for="user in users"
                    :key="user.id"
                    :modelValue="currentGamePlayers.some((gp: GamePlayer) => gp.userId === user.id)"
                    @update:modelValue="togglePlayer(user.id, $event)"
                >
                    {{ user.name }}
                </input-checkbox>

                <button :disabled="users.length === 0" @click="selectAllParticipants">Select All</button>
                <button @click="startNewGame" :disabled="currentGamePlayers.length < 2">Start Game</button>
            </section>

            <section v-else-if="currentGame.status === 'playing' && currentGame && currentGame.currentTurnPlayerId">
                <h2>Game in Progress</h2>
                <p>Current Turn: {{ currentTurnPlayerName }}</p>
                <form class="turn" @submit.prevent="saveTurn()">
                    <input-text id="word" type="text" placeholder="Enter word" v-model="newWord" />
                    <input-text type="number" placeholder="Enter score" v-model.number="newScore" />
                    <input-text type="text" placeholder="Optional comment" v-model="newComment" />
                    <button type="submit" class="bg-success">Submit Turn</button>
                    <div class="flex gap-2">
                        <button type="button" class="bg-warning w-100" @click="skipTurn">Skip turn</button>
                        <button type="button" class="bg-danger w-100" @click="endCurrentGame">End Game</button>
                    </div>
                </form>
            </section>

            <section v-else-if="currentGame.status === 'finished'">
                <h2>Game Finished</h2>
                <p>Final Scores:</p>
                <ul>
                    <li
                        v-for="pr in playersRanking"
                        :key="pr.id"
                    >
                        {{ pr.name }}: {{ pr.score }} points
                    </li>
                </ul>
                <button @click="createGame">Start New Game</button>
            </section>
        </template>

        <router-link to="/">Back to Home</router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useScrabble } from "../scrabble"
const {
    games,
    users,
    createGame,
    startGame,
    endGame,
    addPlayer,
    removePlayer,
    recordTurn,
} = useScrabble()
import type { Game, GamePlayer, User } from "../types"
import InputText from "../components/InputText.vue"
import InputCheckbox from "../components/InputCheckbox.vue"

const newWord = ref("")
const newScore = ref<number>(0)
const newComment = ref("")

const currentGamePlayers = computed(() => {
    if (!currentGame.value) return []
    return currentGame.value.players as GamePlayer[]
})

const currentGame = computed(() => games.value[games.value.length - 1] as Game | null)

if (!currentGame.value || currentGame.value.status === "finished") {
    // If there's no game, we can start one immediately
    createGame()
}

const currentTurnPlayerName = computed(() => {
    if (!currentGame.value) return "Unknown"
    const currentPlayerId = currentGame.value.currentTurnPlayerId
    const currentPlayer = currentGamePlayers.value.find((gp: GamePlayer) => gp.id === currentPlayerId)
    if (!currentPlayer) return "Unknown"
    const user = users.value.find((u: User) => u.id === currentPlayer.userId)
    return user ? user.name : "Unknown"
})

const playersRanking = computed(() => {
    if (!currentGame.value) return []
    return [...currentGamePlayers.value].sort((a: GamePlayer, b: GamePlayer) => b.score - a.score).map((gp: GamePlayer) => {
        const user = users.value.find((u: User) => u.id === gp.userId)
        return {
            id: gp.id,
            name: user ? user.name : "Unknown",
            score: gp.score,
        }
    })
})

function togglePlayer(userId: number, event: Event) {
    if (!currentGame.value) return
    const gp = currentGamePlayers.value.find((gp: GamePlayer) => gp.userId === userId)
    const isChecked = (event.target as HTMLInputElement).checked
    if (isChecked) {
        addPlayer(currentGame.value.id, userId)
    } else {
        if (!gp) return
        removePlayer(currentGame.value.id, gp.id)
    }
}

function selectAllParticipants() {
    if (!currentGame.value) return
    users.value.forEach((user: User) => {
        const gp = currentGamePlayers.value.find((gp: GamePlayer) => gp.userId === user.id)
        if (!gp) {
            addPlayer(currentGame.value!.id, user.id)
        }
    })
}

function saveTurn() {
    if (!currentGame.value) return
    if (newWord.value.length > 0 && newScore.value <= 0) {
        alert("Remember to include a valid score for the word.")
        return
    }
    recordTurn(currentGame.value.id, {
        playerId: currentGame.value.currentTurnPlayerId!,
        word: newWord.value,
        score: newScore.value,
        comment: newComment.value,
    })
    // Clear input fields after recording the turn
    newWord.value = ""
    newScore.value = 0
    newComment.value = ""
    document.getElementById("word")?.focus()
}

function skipTurn() {
    if (!currentGame.value) return
    // Record a turn with 0 score and a comment indicating it was skipped
    recordTurn(currentGame.value.id, {
        playerId: currentGame.value.currentTurnPlayerId!,
        word: "",
        score: 0,
        comment: "Turn skipped",
    })
}

function startNewGame() {
    if (!currentGame.value) return
    startGame(currentGame.value.id)
}

function endCurrentGame() {
    if (currentGame.value) {
        endGame(currentGame.value.id)
    }
}
</script>

<style scoped>
.turn {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
}
</style>