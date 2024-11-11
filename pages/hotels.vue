<template>
    <v-container fluid class="hotels-page">
        <v-row justify="center">

            <HotelsTable />

        </v-row>
    </v-container>
</template>

<script setup>
import HotelsTable from '@/components/HotelsTable.vue';

const createHotel = () => {
    // Logic to open a dialog or navigate to a form for adding a new hotel
};
</script>

<style scoped>
.hotels-page {
    padding: 24px;
}

.hotels-page-card {
    background-color: var(--surface-color);
}
</style>