<template>
    <v-card class="hotels-table-card">
        <v-card-title>
            <span class="text-h6">Hotels Management</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="createHotel">Add Hotel</v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="hotels" :items-per-page="5" class="hotels-table">
            <template #item.actions="{ item }">
                <v-icon small class="mr-2" @click="editHotel(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="deleteHotel(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHotelStore } from '@/stores/useHotelStore';

const hotelStore = useHotelStore();
const hotels = ref([]);
const headers = [
    { title: 'Name', value: 'hotel_name' },
    { title: 'Location', value: 'hotel_location' },
    { title: 'hotel_category', value: 'hotel_category' },
    { title: 'Actions', value: 'actions', sortable: false },
];

const fetchHotels = async () => {
    await hotelStore.fetchHotels();
    hotels.value = hotelStore.hotels.value;
};

const createHotel = () => {
    // Logic to open a dialog for creating a new hotel
};

const editHotel = (hotel) => {
    // Logic to open a dialog for editing the selected hotel
};

const deleteHotel = (hotel) => {
    // Logic to confirm and delete the selected hotel
};

onMounted(() => {
    fetchHotels();
});
</script>

<style scoped>
.hotels-table-card {
    margin: 24px;
    background-color: var(--surface-color);
}

.hotels-table {
    color: var(--text-color);
}

.v-data-table-header th {
    background-color: var(--primary-color);
    color: #FFFFFF;
}

.v-data-table {
    background-color: var(--surface-color);
}

.v-icon {
    color: var(--primary-color);
    cursor: pointer;
}

.v-icon:hover {
    color: var(--primary-color-dark);
}
</style>