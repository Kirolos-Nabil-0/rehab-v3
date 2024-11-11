<template>
    <v-card class="hotels-table-card" elevation="2" rounded>
        <v-card-title>
            <span class="text-h6">Hotels Management</span>
            <v-spacer></v-spacer>
            <v-btn @click="createHotel" class="add-hotel-btn">
                <v-icon left>mdi-plus</v-icon>
                Add Hotel
            </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="hotels" :items-per-page="5" class="hotels-table" hover>
            <template #header.hotel_name="{ header }">
                <v-icon small class="mr-1">mdi-bed</v-icon>
                Hotel Name
            </template>
            <template #header.hotel_location="{ header }">
                <v-icon small class="mr-1">mdi-map-marker</v-icon>
                Hotel Location
            </template>
            <template #header.hotel_category="{ header }">
                <v-icon small class="mr-1">mdi-star-outline</v-icon>
                Hotel Category
            </template>
            <template #item.actions="{ item }">
                <v-icon small class="mr-2 action-icon edit-icon" @click="editHotel(item)">
                    mdi-pencil-outline
                </v-icon>
                <v-icon small class="action-icon delete-icon" @click="deleteHotel(item)">
                    mdi-trash-can-outline
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
    { title: 'Name', value: 'hotel_name', align: 'left' },
    { title: 'Location', value: 'hotel_location', align: 'left' },
    { title: 'Category', value: 'hotel_category', align: 'left' },
    { title: 'Actions', value: 'actions', sortable: false, align: 'right' },
];

const fetchHotels = async () => {
    await hotelStore.fetchHotels();
    hotels.value = hotelStore.hotels.value;
};

const createHotel = () => {
    // TODO: Implement create hotel functionality
};

const editHotel = (hotel) => {
    // TODO: Implement edit hotel functionality
};

const deleteHotel = (hotel) => {
    // TODO: Implement delete hotel functionality
};

onMounted(() => {
    fetchHotels();
});
</script>

<style scoped>
.hotels-table-card {
    margin: 24px;
    background-color: var(--v-theme-surface);
    border-radius: 8px;
}

.hotels-table {
    color: var(--v-theme-on-surface);
}

/* Header Styling */
.v-data-table-header th {
    background-color: #f3f4f6;
    /* Light gray */
    color: #333333;
    /* Dark gray */
    font-weight: bold;
}

/* Increase padding inside table cells */
.v-data-table-header th,
.v-data-table td {
    padding: 12px 15px;
}

/* Alternating row colors */
.v-data-table tbody tr:nth-child(odd) {
    background-color: #ffffff;
}

.v-data-table tbody tr:nth-child(even) {
    background-color: #f1f8ff;
    /* Very pale blue */
}

/* Table borders and dividers */
.v-data-table {
    border: 1px solid #e0e0e0;
    /* Light gray border */
}

.v-data-table thead th {
    border-bottom: 1px solid #e0e0e0;
}

.v-data-table tbody td {
    border-bottom: 1px solid #e0e0e0;
}

/* Action icons styling */
.edit-icon {
    color: #1565c0;
    /* Medium blue */
    cursor: pointer;
}

.delete-icon {
    color: #d32f2f;
    /* Muted red */
    cursor: pointer;
}

/* Adjust "Add Hotel" button */
.add-hotel-btn {
    padding: 10px 20px;
    font-size: 16px;
    margin-left: 16px;
    background-color: #ff6f61;
    /* Coral */
    color: #fff;
    /* White text */
}

/* Increase font size for better readability */
.v-data-table {
    font-size: 16px;
}

.text-h6 {
    font-size: 24px;
    font-weight: bold;
}
</style>
