<template>
    <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
</template>

<script setup lang="ts">
const { modelValue, placeholder = "", type = "text" } = defineProps<{
    modelValue: string | number
    placeholder?: string
    type?: "text" | "number"
}>()

defineEmits(["update:modelValue"])
</script>

<style scoped>
input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}
</style>