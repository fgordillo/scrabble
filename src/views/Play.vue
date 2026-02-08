<template>
    <div>
        <h1>{{ t("Play Game") }}</h1>
        <section v-if="!currentGame">
            <p>{{ t("No active game. Please create a new game first.") }}</p>
        </section>

        <template v-else>
            <section v-if="currentGame.status === 'waiting'">
                <h2>{{ t("Select the participants") }}</h2>
                <div v-if="users.length === 0">
                    {{ t("No users available.") }}
                    <router-link to="/users">{{
                        t("Please add users first.")
                    }}</router-link>
                </div>
                <div class="flex gap-2">
                    <input-checkbox
                        v-for="user in users"
                        :key="user.id"
                        :modelValue="
                            currentGamePlayers.some(
                                (gp: GamePlayer) => gp.userId === user.id,
                            )
                        "
                        @update:modelValue="togglePlayer(user.id, $event)"
                    >
                        {{ user.name }}
                    </input-checkbox>

                    <button
                        :disabled="users.length === 0"
                        @click="selectAllParticipants"
                    >
                        {{ t("Select All") }}
                    </button>

                    <button @click="startNewGame">
                        {{ t("Start Game") }}
                    </button>
                </div>
            </section>

            <section
                v-else-if="
                    currentGame.status === 'playing' &&
                    currentGame &&
                    currentGame.currentTurnPlayerId
                "
            >
                <h2>{{ t("Game in Progress") }}</h2>
                <p>{{ t("Current Turn") }}: {{ currentTurnPlayerName }}</p>
                <form class="turn" @submit.prevent="saveTurn()">
                    <input-text
                        id="word"
                        type="text"
                        :placeholder="t('Enter word')"
                        v-model="newWord"
                    />
                    <label class="flex w-100">
                        <span class="mr-auto">{{ t("Points") }}:</span>
                        <input-text
                            type="number"
                            :placeholder="t('Enter score')"
                            v-model.number="newScore"
                        />
                    </label>
                    <input-text
                        type="text"
                        :placeholder="t('Optional comment')"
                        v-model="newComment"
                    />
                    <button type="submit" class="bg-success">
                        {{ t("Submit Turn") }}
                    </button>
                    <button
                        type="button"
                        class="bg-warning"
                        :disabled="verifyingWord"
                        @click="checkWord"
                    >
                        {{ t("Check Word") }}
                    </button>
                    <div class="flex gap-2">
                        <button
                            type="button"
                            class="bg-warning w-100"
                            @click="skipTurn"
                        >
                            {{ t("Skip turn") }}
                        </button>
                        <button
                            type="button"
                            class="bg-danger w-100"
                            @click="endCurrentGame"
                        >
                            {{ t("End Game") }}
                        </button>
                    </div>
                </form>
            </section>

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
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useScrabble } from "../scrabble"

import type { Game, GamePlayer, User } from "../types"
import WordService from "../WordService"
import InputText from "../components/InputText.vue"
import InputCheckbox from "../components/InputCheckbox.vue"

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
const { t, locale } = useI18n()

const newWord = ref("")
const newScore = ref<number>(0)
const newComment = ref("")

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

const currentTurnPlayerName = computed(() => {
    if (!currentGame.value) return t("Unknown")
    const currentPlayerId = currentGame.value.currentTurnPlayerId
    const currentPlayer = currentGamePlayers.value.find(
        (gp: GamePlayer) => gp.id === currentPlayerId,
    )
    if (!currentPlayer) return t("Unknown")
    const user = users.value.find((u: User) => u.id === currentPlayer.userId)
    return user ? user.name : t("Unknown")
})

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

function saveTurn() {
    if (!currentGame.value) return
    if (newWord.value.length > 0 && newScore.value <= 0) {
        alert(t("Remember to include a valid score for the word"))
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

const verifyingWord = ref(false)

async function checkWord() {
    if (newWord.value.trim() === "") {
        alert(t("Please enter a word to check"))
        return
    }
    const language = locale.value.split("-")[0]! as "en" | "es" // Get language code (e.g., "en" from "en-US")
    try {
        verifyingWord.value = true
        const isValid = await WordService.validateWord(newWord.value, language)
        if (isValid) {
            alert(t("The word is valid!"))
        } else {
            alert(t("The word is not valid."))
        }
    } catch (error) {
        console.error("Error validating word:", error)
        alert(
            t(
                "An error occurred while validating the word. Please try again later.",
            ),
        )
    } finally {
        verifyingWord.value = false
    }
}

function skipTurn() {
    if (!currentGame.value) return
    // Record a turn with 0 score and a comment indicating it was skipped
    recordTurn(currentGame.value.id, {
        playerId: currentGame.value.currentTurnPlayerId!,
        word: "",
        score: 0,
        comment: t("Turn skipped"),
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

<style scoped>
.turn {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 360px;
    width: 100%;
}
</style>
