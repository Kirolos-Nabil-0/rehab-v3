<template>
    <!-- Dialog with animations -->
    <v-dialog v-model="dialogOpen" max-width="600px" transition="dialog-transition" persistent
        aria-label="Add New Hotel">
        <v-card class="dialog-card" :style="{ '--header-gradient': headerGradient }" elevation="2">
            <!-- Dialog Header with Fade-In Animation -->
            <v-card-title class="dialog-header">
                <v-icon left large color="white" aria-hidden="true" class="fade-in">
                    mdi-hotel
                </v-icon>
                <span class="dialog-title fade-in" id="dialog-title">Add New Hotel</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog" class="close-button fade-in" :aria-label="'Close'">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <!-- Dialog Content with Staggered Animations -->
            <v-card-text>
                <v-form ref="form" v-model="isFormValid" class="dialog-form">
                    <transition-group name="fade-slide-stagger" tag="div">
                        <!-- Hotel Name Field -->
                        <v-text-field v-model="hotel.hotel_name" label="Hotel Name"
                            :rules="[v => !!v || 'Name is required']" outlined dense prepend-icon="mdi-bed"
                            class="form-field" aria-labelledby="hotel-name-label" key="hotel_name"></v-text-field>

                        <!-- Hotel Location Field -->
                        <v-text-field v-model="hotel.hotel_location" label="Hotel Location"
                            :rules="[v => !!v || 'Location is required']" outlined dense prepend-icon="mdi-map-marker"
                            class="form-field" aria-labelledby="hotel-location-label"
                            key="hotel_location"></v-text-field>

                        <!-- Hotel Category Rating -->
                        <div class="form-field" key="hotel_category">
                            <label for="hotel-category-rating" class="rating-label">Hotel Category</label>
                            <v-rating id="hotel-category-rating" v-model="hotel.hotel_category" length="5" hover
                                color="var(--primary-color)" background-color="var(--descriptionGray)"
                                aria-labelledby="hotel-category-label"
                                :rules="[v => !!v || 'Category is required']"></v-rating>

                            <!-- Display selected stars -->
                            <div class="selected-stars">
                                {{ hotel.hotel_category || 0 }} Stars
                            </div>

                            <span v-if="hotelCategoryError" class="error-message">{{
                                hotelCategoryError
                            }}</span>
                        </div>
                    </transition-group>
                </v-form>
            </v-card-text>

            <!-- Dialog Actions with Button Animations -->
            <v-card-actions class="dialog-actions">
                <v-spacer></v-spacer>
                <v-btn color="primary" class="add-button" @click="submitForm" :disabled="!isFormValid || isSubmitting"
                    elevation="2" :class="{ 'button-loading': isSubmitting }">
                    <v-icon left v-if="!isSubmitting">mdi-plus</v-icon>
                    <v-progress-circular v-else indeterminate color="white" size="20"
                        aria-label="Loading"></v-progress-circular>
                    <span v-if="!isSubmitting">{{ 'Add Hotel' }}</span>
                </v-btn>
                <v-btn color="error" text class="cancel-button" @click="closeDialog" :disabled="isSubmitting">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Success Snackbar with Slide-In Animation -->
        <v-snackbar v-model="showSnackbar" :timeout="3000" top right color="success" transition="snackbar-transition"
            aria-label="Notification">
            {{ 'Hotel added successfully' }}
            <v-btn text @click="showSnackbar = false">{{ 'Close' }}</v-btn>
        </v-snackbar>
    </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useHotelStore } from '@/stores/useHotelStore';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    isDialogOpen: {
        type: Boolean,
        required: true,
    },
});

const emits = defineEmits(['update:isDialogOpen']);

const hotelStore = useHotelStore();
const isFormValid = ref(false);
const hotel = ref({
    hotel_name: '',
    hotel_location: '',
    hotel_category: null, // Changed to null to work with v-rating
});

const dialogOpen = computed({
    get: () => props.isDialogOpen,
    set: (value) => emits('update:isDialogOpen', value),
});

const isSubmitting = ref(false);
const showSnackbar = ref(false);

const closeDialog = () => {
    if (!isSubmitting.value) {
        dialogOpen.value = false;
        resetForm();
    }
};

const resetForm = () => {
    hotel.value = {
        hotel_name: '',
        hotel_location: '',
        hotel_category: null,
    };
    isFormValid.value = false;
};

const submitForm = async () => {
    if (isFormValid.value && hotel.value.hotel_category) {
        isSubmitting.value = true;
        try {
            await hotelStore.addHotel(hotel.value);
            showSnackbar.value = true;
            //clear form and close dialog
            resetForm();
            closeDialog();
        } catch (error) {
            console.error('Failed to add hotel:', error);
        } finally {
            isSubmitting.value = false;
        }
        closeDialog();

    } else {
        // Trigger validation
        hotelCategoryError.value = 'Category is required';
    }

};

// Validation for hotel category
const hotelCategoryError = ref('');

watch(
    () => hotel.value.hotel_category,
    (newVal) => {
        if (newVal && newVal > 0) {
            hotelCategoryError.value = '';
        } else {
            hotelCategoryError.value = 'Category is required';
        }
    }
);

// Computed property for header gradient
const headerGradient = computed(() => {
    const star = hotel.value.hotel_category || 0;
    let gradient;
    switch (star) {
        case 1:
            gradient = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
            break;
        case 2:
            gradient = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
            break;
        case 3:
            gradient = 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)';
            break;
        case 4:
            gradient = 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)';
            break;
        case 5:
            gradient = 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)';
            break;
        default:
            gradient = `var(--primary-color)`; // Default color
            break;
    }
    return gradient;
});
</script>

<style scoped>
/* Dialog Card Styling */
.dialog-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--surface-color);
    color: var(--text-color);
}

/* Dialog Header */
.dialog-header {
    /* Apply dynamic gradient */
    background: var(--header-gradient, var(--primary-color));
    color: var(--surface-color);
    display: flex;
    align-items: center;
    padding: 16px;
}

.dialog-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-left: 8px;
}

/* Close Button */
.close-button {
    color: var(--surface-color);
}

/* Form Styling */
.dialog-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px;
}

.form-field {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.form-field:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Rating Label */
.rating-label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: var(--text-color);
}

/* Error Message */
.error-message {
    color: var(--error);
    font-size: 12px;
    margin-top: 4px;
}

/* Selected Stars Display */
.selected-stars {
    margin-top: 4px;
    font-size: 14px;
    color: var(--text-color);
}

/* Dialog Actions */
.dialog-actions {
    padding: 16px;
    background-color: var(--surface-color);
}

/* Buttons Styling */
.add-button {
    background-color: var(--primary-color);
    color: var(--surface-color);
    transition: background 0.3s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-button:hover {
    animation: pulse 1s infinite;
    background: var(--primary-color-light);
}

.add-button:active {
    transform: scale(0.98);
}

/* Loading State Styling */
.button-loading {
    pointer-events: none;
}

/* Cancel Button Styling */
.cancel-button {
    color: var(--error);
    font-weight: 500;
    transition: color 0.3s ease;
}

.cancel-button:hover {
    color: var(--primary-color-dark);
}

/* Snackbar Styling */
.v-snackbar {
    background-color: var(--success) !important;
    color: var(--surface-color) !important;
}

.v-snackbar .v-btn {
    color: var(--surface-color) !important;
}

/* Transition Animations */

/* Dialog Transition */
.dialog-transition-enter-active,
.dialog-transition-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.dialog-transition-enter-from,
.dialog-transition-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.dialog-transition-enter-to,
.dialog-transition-leave-from {
    opacity: 1;
    transform: scale(1);
}

/* Fade-In Animation for Header Elements */
.fade-in {
    animation: fadeInDown 0.5s ease forwards;
}

/* Staggered Fade and Slide Animations */
.fade-slide-stagger-enter-active,
.fade-slide-stagger-leave-active {
    transition: all 0.5s ease;
}

.fade-slide-stagger-enter-from,
.fade-slide-stagger-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.fade-slide-stagger-enter-to,
.fade-slide-stagger-leave-from {
    opacity: 1;
    transform: translateY(0);
}

/* Staggered Animations for Form Fields */
.fade-slide-stagger-enter-active>*:nth-child(1),
.fade-slide-stagger-leave-active>*:nth-child(1) {
    transition-delay: 0s;
}

.fade-slide-stagger-enter-active>*:nth-child(2),
.fade-slide-stagger-leave-active>*:nth-child(2) {
    transition-delay: 0.1s;
}

.fade-slide-stagger-enter-active>*:nth-child(3),
.fade-slide-stagger-leave-active>*:nth-child(3) {
    transition-delay: 0.2s;
}

/* Pulse Animation for Add Button */
@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(201, 79, 93, 0.7);
    }

    70% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(201, 79, 93, 0);
    }

    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(201, 79, 93, 0);
    }
}

/* Fade In Down Animation */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Snackbar Slide-In Animation */
.snackbar-transition-enter-active,
.snackbar-transition-leave-active {
    transition: all 0.5s ease;
}

.snackbar-transition-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.snackbar-transition-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.snackbar-transition-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.snackbar-transition-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
    .dialog-card {
        max-width: 90%;
    }

    .dialog-title {
        font-size: 1.25rem;
    }

    .add-button {
        width: 100%;
        justify-content: center;
    }
}
</style>