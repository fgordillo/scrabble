<template>
    <div>
        <h1>Scrabble</h1>
        <p>{{ t("Welcome to the Scrabble game!") }}</p>
        <p>
            {{
                t(
                    "Use the navigation menu to explore different sections of the game.",
                )
            }}
        </p>
        <div>
            <p>
                <template v-if="thereIsAGameInProgress">
                    <p>{{ t("A game is currently in progress.") }}</p>
                    <p>
                        <router-link to="/play">{{
                            t("Continue playing")
                        }}</router-link>
                    </p>
                </template>

                <router-link v-else-if="users.length > 1" to="/play">
                    {{ t("Play Game") }}
                </router-link>

                <span v-else>
                    {{ t("Play Game (requires at least 2 users)") }}
                </span>
            </p>
            <p>
                <router-link v-if="users.length > 0" to="/users">
                    {{ t("Manage Users") }}
                </router-link>
                <router-link v-else to="/users">
                    {{ t("Add users so you can play") }}
                </router-link>
            </p>
            <p v-if="games.length > 0">
                <router-link to="/previous-games">{{
                    t("See previous games")
                }}</router-link>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useScrabble } from "../scrabble"

const { games, users } = useScrabble()
const { t } = useI18n()

const thereIsAGameInProgress = computed(() => {
    return games.value.some((g) => g.status === "playing")
})
</script>
