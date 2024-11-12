<template>
    <v-container fluid class="hotels-page">
        <Suspense>
            <template #default>
                <HotelsTable />
            </template>
            <template #fallback>
                <!-- Fallback content while HotelsTable is loading -->
                <v-row justify="center" align="center" style="height: 100vh;">
                    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                </v-row>
            </template>
        </Suspense>
        <HotelStatistics />

    </v-container>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

// Import HotelsTable as an async component
const HotelsTable = defineAsyncComponent(() => import('@/components/HotelsTable.vue'));




</script>

<style scoped>
.hotels-page {
    padding: 24px;
    background-image: url('/images/escheresque.png');
    background-size: auto;
    background-repeat: repeat;
    background-position: center;
    background-attachment: fixed;
    background-color: rgba(255, 255, 255, 0.9);
}

/* Ensure the container fills the viewport */
.v-application--wrap {
    min-height: 100vh;
}
</style>
