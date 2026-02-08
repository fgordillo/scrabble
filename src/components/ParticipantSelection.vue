<template>
    <section>
        <h2>{{ t("Select the participants") }}</h2>
        <div v-if="users.length === 0">
            {{ t("No users available.") }}
            <router-link to="/users">{{
                t("Please add users first.")
            }}</router-link>
        </div>

        <div>
            <div class="checkboxes">
                <input-checkbox
                    v-for="user in users"
                    :key="user.id"
                    :modelValue="
                        gamePlayers.some(
                            (gp: GamePlayer) => gp.userId === user.id,
                        )
                    "
                    @update:modelValue="emit('toggle-player', user.id, $event)"
                >
                    {{ user.name }}
                </input-checkbox>
            </div>
            <div class="flex gap-2">
                <button
                    :disabled="users.length === 0"
                    @click="emit('select-all-participants')"
                >
                    {{ t("Select All") }}
                </button>

                <button @click="emit('start-new-game')">
                    {{ t("Start Game") }}
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import InputCheckbox from "./InputCheckbox.vue"
import type { User, GamePlayer } from "../types"

const { t } = useI18n()

const { users, gamePlayers } = defineProps<{
    users: User[]
    gamePlayers: GamePlayer[]
}>()

const emit = defineEmits([
    "toggle-player",
    "select-all-participants",
    "start-new-game",
])
</script>

<style scoped>
.checkboxes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}
.checkboxes label {
    cursor: pointer;
}
</style>
