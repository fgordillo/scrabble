<template>
    <div>
        <h1>Manage Users</h1>
        
        <div>
            <p
                v-for="user in users"
                :key="user.id"
                class="flex gap-2"
            >
                <span v-if="editingUserId !== user.id" class="mr-auto">{{ user.name }}</span>
                <input-text v-else v-model="user.name" class="mr-auto" />

                <button
                    v-if="editingUserId !== user.id"
                    @click="editingUserId = user.id"
                >
                    Edit
                </button>
                <button
                    v-else
                    class="bg-success"
                    @click="editingUserId = null"
                >
                    Save
                </button>
                <button
                    class="bg-danger"
                    @click="deleteUser(user.id)"
                >
                    Delete
                </button>
            </p>
        </div>

        <form
            class="flex gap-2"
            @submit.prevent="addNewUser(newUser)"
        >
            <input-text
                v-model="newUser"
                placeholder="Enter user name"
            />
            <button type="submit" class="bg-success">Add User</button>
        </form>

        <router-link to="/">Back to Home</router-link>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useScrabble } from "../scrabble"
import InputText from "../components/InputText.vue"

const { users, addUser, deleteUser } = useScrabble()
const newUser = ref("")
const editingUserId = ref<number | null>(null)

function addNewUser(name: string) {
    if (name.trim() === "") {
        alert("User name cannot be empty.")
        return
    }
    addUser(name.trim())
    newUser.value = ""
}
</script>