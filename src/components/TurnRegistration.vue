<template>
    <section>
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
                    @click="emit('end-game')"
                >
                    {{ t("End Game") }}
                </button>
            </div>
        </form>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import InputText from "../components/InputText.vue"
import WordService from "../WordService"
import type { Game, GamePlayer, User } from "../types"

const { game, gamePlayers, users } = defineProps<{
    game: Game
    gamePlayers: GamePlayer[]
    users: User[]
}>()

const emit = defineEmits(["record-turn", "end-game"])

const { t, locale } = useI18n()
const newWord = ref("")
const newScore = ref<number>(0)
const newComment = ref("")
const verifyingWord = ref(false)

const currentTurnPlayerName = computed(() => {
    const currentPlayerId = game.currentTurnPlayerId
    const currentPlayer = gamePlayers.find(
        (gp: GamePlayer) => gp.id === currentPlayerId,
    )
    if (!currentPlayer) return t("Unknown")
    const user = users.find((u: User) => u.id === currentPlayer.userId)
    return user ? user.name : t("Unknown")
})

function saveTurn() {
    if (newWord.value.length > 0 && newScore.value <= 0) {
        alert(t("Remember to include a valid score for the word"))
        return
    }
    emit("record-turn", game.id, {
        playerId: game.currentTurnPlayerId!,
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
    emit("record-turn", game.id, {
        playerId: game.currentTurnPlayerId!,
        word: "",
        score: 0,
        comment: t("Turn skipped"),
    })
}

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
