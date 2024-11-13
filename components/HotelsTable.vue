<template>
    <v-card class="hotels-table-card" elevation="2" rounded>
        <v-card-title>
            <span class="text-h6">Hotels Management</span>
            <v-spacer></v-spacer>
            <v-btn @click="openAddHotelForm" class="add-hotel-btn">
                <v-icon left>mdi-plus</v-icon>
                Add Hotel
            </v-btn>
        </v-card-title>

        <!-- Info for keyboard shortcuts -->
        <v-card-subtitle>
            <span class="shortcut-info">Press <strong>Ctrl+C</strong> to toggle the Add Hotel dialog.</span>
        </v-card-subtitle>

        <!-- Search Bar and Location Filter -->
        <v-card-text class="filters-container">
            <!-- Search Bar -->
            <v-text-field v-model="search" label="Search Hotels" prepend-icon="mdi-magnify" clearable
                @keyup.enter="focusSearch" @focus="onSearchFocus" ref="searchInputRef"></v-text-field>

            <!-- Location Filter -->
            <v-select v-model="selectedLocation" :items="locationOptions" label="Filter by Location" clearable
                prepend-icon="mdi-map-marker" @change="onLocationChange"></v-select>
        </v-card-text>

        <v-data-table :headers="headers" :items="filteredHotels" :items-per-page="5" class="hotels-table" hover>
            <!-- Existing table templates -->
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

            <template #item.hotel_category="{ item }">
                <span v-if="item.hotel_category == 'building'">building</span>
                <v-rating v-else-if="item.hotel_category[0] > 1" v-model="item.hotel_category[0]" dense
                    readonly></v-rating>
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
        <AddHotelDialog v-model:isDialogOpen="isDialogOpen" />
        <HelpDialog v-model="isHelpDialogOpen" />
    </v-card>

</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useHotelStore } from '@/stores/useHotelStore';

import { useMagicKeys } from '@vueuse/core';
// import { debounce } from 'lodash-es'; // Optional: For debouncing search input

const keys = useMagicKeys();

// Define keyboard shortcuts
const CtrlC = keys['Ctrl+c'];
const CtrlN = keys['Ctrl+n'];
const CtrlShiftF = keys['Ctrl+Shift+f'];
const CtrlShiftL = keys['Ctrl+Shift+l'];
const CtrlR = keys['Ctrl+r'];
const CtrlE = keys['Ctrl+e'];
const CtrlD = keys['Ctrl+d'];
const CtrlShiftH = keys['Ctrl+Shift+h'];




// Dialog states
const isDialogOpen = ref(false);
const isHelpDialogOpen = ref(false);

// Toggle Add Hotel dialog with Ctrl+C or Ctrl+N
watch([CtrlC, CtrlN], ([c, n]) => {
    if (c || n) {
        isDialogOpen.value = !isDialogOpen.value;
    }
});

// Focus search bar with Ctrl+F
watch(CtrlShiftF, (v) => {

    if (v && searchInputRef.value) {
        focusSearch();
    }
});

// Clear filters with Ctrl+L
watch(CtrlShiftL, (v) => {
    console.log('Ctrl+Shift+L pressed');
    if (v) {
        clearFilters();
    }
});

// Refresh hotels list with Ctrl+R
watch(CtrlR, async (v) => {
    if (v) {
        await fetchHotels();
    }
});

// Edit the first hotel with Ctrl+E
watch(CtrlE, (v) => {
    if (v && filteredHotels.value.length > 0) {
        editHotel(filteredHotels.value[0]);
    }
});

// Delete the first hotel with Ctrl+D
watch(CtrlD, (v) => {
    if (v && filteredHotels.value.length > 0) {
        deleteHotel(filteredHotels.value[0]);
    }
});

// Show help dialog with Ctrl+H
watch(CtrlShiftH, (v) => {
    console.log('Ctrl+Shift+H pressed');

    if (v) {
        isHelpDialogOpen.value = true;
    }
});

const hotelStore = useHotelStore();
const hotels = ref([]);
const locationOptions = ref(hotelStore.locations);

let pollingIntervalId = null;

const fetchHotels = async () => {
    await hotelStore.fetchHotels();
    hotels.value = hotelStore.hotels;
};

const startPolling = (interval = 5000) => {
    pollingIntervalId = setInterval(fetchHotels, interval);
};

const stopPolling = () => {
    if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
        pollingIntervalId = null;
    }
};

onMounted(() => {
    fetchHotels();
    startPolling();
});

onUnmounted(() => {
    stopPolling();
});

const openAddHotelForm = () => {
    isDialogOpen.value = true;
};

// Define headers for the data table
const headers = [
    { text: 'Hotel Name', value: 'hotel_name' },
    { text: 'Location', value: 'hotel_location' },
    { text: 'Category', value: 'hotel_category' },
    { text: 'Actions', value: 'actions', sortable: false }
];

// Placeholder methods for edit and delete actions
const editHotel = (hotel) => {
    // Implement edit functionality, e.g., open an edit dialog
    console.log('Editing hotel:', hotel);
};

const deleteHotel = (hotel) => {
    // Implement delete functionality, e.g., confirm and delete
    console.log('Deleting hotel:', hotel);
};

// Search Functionality
const search = ref('');
const debouncedSearch = ref('');

// Optional: Debounce search input to reduce the number of computations
// import { debounce } from 'lodash-es';
// const debouncedSearch = ref('');
// watch(search, debounce((newVal) => {
//     debouncedSearch.value = newVal;
// }, 300));

watch(search, (newVal) => {
    debouncedSearch.value = newVal;
});

// Location Filter Functionality
const selectedLocation = ref(null);

// Compute the list of unique locations from the hotels data
const locations = computed(() => {
    const locSet = new Set();
    hotels.value.forEach(hotel => {
        if (hotel.hotel_location) {
            locSet.add(hotel.hotel_location);
        }
    });
    return Array.from(locSet);
});

// Computed property to filter hotels based on search query and selected location
const filteredHotels = computed(() => {
    let filtered = hotels.value;

    // Apply search filter
    if (debouncedSearch.value) {
        const query = debouncedSearch.value.toLowerCase();
        filtered = filtered.filter(hotel => {
            return (
                hotel.hotel_name.toLowerCase().includes(query) ||
                hotel.hotel_location.toLowerCase().includes(query) ||
                (typeof hotel.hotel_category === 'string'
                    ? hotel.hotel_category.toLowerCase().includes(query)
                    : hotel.hotel_category.join(' ').toLowerCase().includes(query))
            );
        });
    }

    // Apply location filter
    if (selectedLocation.value) {
        filtered = filtered.filter(hotel => hotel.hotel_location === selectedLocation.value);
    }

    return filtered;
});

// Optional: Function to focus on the search bar when needed
const searchInputRef = ref(null); // Reference to the search input

const focusSearch = () => {
    if (searchInputRef.value) {
        searchInputRef.value.focus();
    }
};

// Clear filters function
const clearFilters = () => {
    search.value = '';
    selectedLocation.value = null;
};

// Handle Ctrl+F to focus the search bar
// Already handled above

// Optional: Handle focus events
const onSearchFocus = () => {
    // Implement any actions when the search bar is focused
};
</script>
<style scoped>
/* Existing styles */
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

/* Style for the search bar and location filter */
.filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px 24px;
}

.v-text-field,
.v-select {
    flex: 1 1 300px;
}

/* Optional: Adjust the icon color */
.mdi-magnify,
.mdi-map-marker {
    color: #757575;
    /* Grey color for subtle emphasis */
}

/* Shortcut info styling */
.shortcut-info {
    padding: 16px 24px;
    font-size: 14px;
    color: #555;
}

.shortcut-info ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 8px 0;
}

.shortcut-info li {
    margin-bottom: 4px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .hotels-table-card {
        margin: 12px;
    }

    .add-hotel-btn {
        padding: 8px 16px;
        font-size: 14px;
    }

    .text-h6 {
        font-size: 20px;
    }

    .filters-container {
        flex-direction: column;
    }

    .shortcut-info {
        font-size: 12px;
    }
}
</style>
