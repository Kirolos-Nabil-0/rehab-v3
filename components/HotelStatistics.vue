<template>
    <v-card class="statistics-card" elevation="2" rounded>
        <v-card-title class="title">
            <v-icon large color="primary" class="title-icon">mdi-bed</v-icon>
            <span class="text-h6">Hotel Statistics</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="statistics-content">
            <!-- Total Hotels -->
            <v-row>
                <v-col cols="12" class="stat-item total-hotels">
                    <v-icon large color="primary" class="stat-icon">mdi-bed</v-icon>
                    <span class="stat-value">{{ totalHotels }}</span>
                    <span class="stat-label">Total Hotels</span>
                </v-col>
            </v-row>

            <!-- Category Section -->
            <v-row>
                <v-col cols="12">
                    <v-card class="sub-card" elevation="1">
                        <v-card-title>
                            <span class="text-subtitle-1">Hotels by Category</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12" md="4" v-for="(count, category) in hotelsByCategory" :key="category"
                                    class="stat-item">
                                    <v-icon color="primary" class="stat-icon">mdi-star</v-icon>
                                    <span class="stat-value">{{ count }}</span>
                                    <span class="stat-label">{{ category }}</span>
                                    <v-progress-linear :value="(count / totalHotels) * 100" height="6" color="primary"
                                        class="progress-bar"></v-progress-linear>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Location Section -->
            <v-row>
                <v-col cols="12">
                    <v-card class="sub-card" elevation="1">
                        <v-card-title>
                            <span class="text-subtitle-1">Hotels by Location</span>
                        </v-card-title>
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12" md="4" v-for="(count, location) in hotelsByLocation" :key="location"
                                    class="stat-item">
                                    <v-icon color="primary" class="stat-icon">mdi-map-marker</v-icon>
                                    <span class="stat-value">{{ count }}</span>
                                    <span class="stat-label">{{ location }}</span>
                                    <v-progress-linear :value="(count / totalHotels) * 100" height="6" color="primary"
                                        class="progress-bar"></v-progress-linear>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHotelStore } from '@/stores/useHotelStore';

// Initialize the store
const hotelStore = useHotelStore();

// Fetch hotel data when the component is mounted
onMounted(async () => {
    await hotelStore.fetchHotels();
});

// Reactive references to store properties
// const totalHotels = hotelStore.totalHotels
// const hotelsByCategory = hotelStore.hotelsByCategory;
// const hotelsByLocation = hotelStore.hotelsByLocation;
// console.log(hotelsByCategory, hotelsByLocation);

const { totalHotels, hotelsByCategory, hotelsByLocation } = storeToRefs(hotelStore);
</script>

<style scoped>
.statistics-card {
    padding: 24px;
    margin-bottom: 16px;
    background-color: var(--surface);
    border-radius: 12px;
}

.title {
    display: flex;
    align-items: center;
}

.title-icon {
    margin-right: 8px;
}

.statistics-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.sub-card {
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.stat-icon {
    margin-bottom: 8px;
    font-size: 28px;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary);
}

.stat-label {
    font-size: 16px;
    color: var(--descriptionGray);
}

.progress-bar {
    margin-top: 8px;
}
</style>