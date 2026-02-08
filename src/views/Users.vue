<template>
    <div>
        <h1>{{ t("Manage Users") }}</h1>

        <div>
            <p v-for="user in users" :key="user.id" class="flex gap-2">
                <span v-if="editingUserId !== user.id" class="mr-auto">{{
                    user.name
                }}</span>
                <input-text v-else v-model="user.name" class="mr-auto" />

                <button
                    v-if="editingUserId !== user.id"
                    :aria-label="t('Edit')"
                    :title="t('Edit')"
                    @click="editingUserId = user.id"
                >
                    <img :src="editIcon" />
                </button>
                
                <button
                    v-else
                    class="bg-success"
                    :title="t('Save')"
                    :aria-label="t('Save')"
                    @click="editingUserId = null"
                >
                    <img :src="saveIcon" />
                </button>
                
                <button
                    class="bg-danger"
                    :title="t('Delete')"
                    :aria-label="t('Delete')"
                    @click="deleteUser(user.id)"
                >
                    <img :src="deleteIcon" />
                </button>
            </p>
        </div>

        <form class="flex gap-2" @submit.prevent="addNewUser(newUser)">
            <input-text v-model="newUser" :placeholder="t('Enter user name')" />
            <button type="submit" class="bg-success">
                {{ t("Add User") }}
            </button>
        </form>

        <div class="flex gap-2 mt-4">
            <router-link v-if="users.length > 1" to="/play" class="button">
                {{ t("Play Game") }}
            </router-link>

            <router-link to="/" class="button">{{
                t("Back to Home")
            }}</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useScrabble } from "../scrabble"
import InputText from "../components/InputText.vue"
import editIcon from "../assets/edit.svg"
import saveIcon from "../assets/save.svg"
import deleteIcon from "../assets/delete.svg"

const { users, addUser, deleteUser } = useScrabble()
const { t } = useI18n()
const newUser = ref("")
const editingUserId = ref<number | null>(null)

function addNewUser(name: string) {
    if (name.trim() === "") {
        alert(t("User name cannot be empty."))
        return
    }
    addUser(name.trim())
    newUser.value = ""
}
</script>
