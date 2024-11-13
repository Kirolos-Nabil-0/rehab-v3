<template>
    <v-dialog v-model="isDialogOpen" max-width="500">
        <v-card class="help-dialog-card">
            <v-card-title class="dialog-title">
                <span class="text-h6">Keyboard Shortcuts</span>
            </v-card-title>
            <v-card-text class="dialog-text">
                <ul>
                    <li><strong>Ctrl + C</strong> or <strong>Ctrl + N</strong>: Toggle the Add Hotel dialog.</li>
                    <li><strong>Ctrl + Shift + F</strong>: Focus the search bar.</li>
                    <li><strong>Ctrl + Shift+ L</strong>: Clear all filters.</li>
                    <li><strong>Ctrl + R</strong>: Refresh the hotels list.</li>
                    <!-- <li><strong>Ctrl + E</strong>: Edit the first hotel.</li>
                    <li><strong>Ctrl + D</strong>: Delete the first hotel.</li> -->
                    <li><strong>Ctrl + Shift + H</strong>: View this help dialog.</li>
                </ul>
            </v-card-text>
            <v-card-actions class="dialog-actions">
                <v-spacer></v-spacer>
                <v-btn class="close-btn" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['update:modelValue']);

const isDialogOpen = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
});

const close = () => {
    isDialogOpen.value = false;
};
</script>

<style scoped>
.help-dialog-card {
    background-color: var(--surface-color);
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border: 1px solid #E0E0E0;
}

.dialog-title {
    color: var(--primary-color);
    font-weight: bold;
    text-align: center;
}

.dialog-text {
    color: var(--secondary-color);
    font-size: 16px;
    padding: 12px 16px;
    line-height: 1.6;
}

.dialog-text ul {
    padding-left: 20px;
    margin: 0;
}

.dialog-text li {
    margin: 6px 0;
    list-style-type: disc;
}

.dialog-actions {
    padding: 8px 16px;
    border-top: 1px solid #E0E0E0;
}

.close-btn {
    background-color: var(--primary-color);
    color: #FFFFFF;
    font-weight: bold;
    border-radius: 6px;
    text-transform: uppercase;
    transition: background-color 0.3s ease;
}

.close-btn:hover {
    background-color: var(--primary-color-dark);
}
</style>
