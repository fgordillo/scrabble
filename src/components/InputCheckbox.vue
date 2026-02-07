<template>
    <label class="flex gap-1">
        <input
            type="checkbox"
            :checked="modelValue"
            @change="
                $emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).checked,
                )
            "
        />
        <slot></slot>
    </label>
</template>

<script setup lang="ts">
defineProps({
    modelValue: Boolean,
})
defineEmits(["update:modelValue"])
</script>

<style scoped>
input {
    width: 20px;
    height: 20px;
}
</style>
