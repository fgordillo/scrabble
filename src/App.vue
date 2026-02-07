<template>
    <img :src="logo" alt="Scrabble Logo" style="max-width: 300px" />
    <router-view />
</template>

<script setup lang="ts">
import logo from "./assets/logo.png"
</script>
