<!-- layouts/default.vue -->

<template>
    <v-app>
        <!-- Top App Bar -->
        <v-app-bar app class="app-bar elevation-12">
            <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{ currentPageTitle }}</v-toolbar-title>

            <!-- Spacer to push the toggle to the right -->
            <v-spacer></v-spacer>

            <!-- TTS Toggle Switch -->
            <!-- <v-switch v-model="isTtsEnabled" :label="'Text-to-Speech'" @change="toggleTts" class="mr-4"></v-switch> -->

            <!-- Help Icon with Tooltip -->
            <v-btn icon v-tooltip.bottom="'Help press CTRL+ Shift + H'" class="nav-icon">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>

            <!-- Notifications Icon with Badge -->
            <v-menu offset-y>
                <template #activator="{ on, attrs }">
                    <v-badge :content="notificationCount" color="var(--primary-color)" overlap
                        v-if="notificationCount > 0" class="nav-icon">
                        <v-btn icon v-bind="attrs" v-on="on" class="nav-icon">
                            <v-icon>mdi-bell-outline</v-icon>
                        </v-btn>
                    </v-badge>
                    <v-btn icon v-bind="attrs" v-on="on" v-else class="nav-icon">
                        <v-icon>mdi-bell-outline</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="navigateTo('/notifications')">
                        <v-list-item-title>View Notifications</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <!-- User Menu -->
            <v-menu offset-y>
                <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" class="nav-icon">
                        <v-avatar size="32">
                            <img src="https://via.placeholder.com/32" alt="User" />
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="navigateTo('/profile')">
                        <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <!-- Navigation Drawer with Transition -->
        <transition name="drawer-transition">
            <v-navigation-drawer v-if="isDrawerVisible" app :permanent="!smAndDown" :mini-variant="miniVariant"
                class="navigation-drawer" @click.stop>
                <v-list-item class="logo-container">
                    <v-img src="/logo.png" alt="Logo" height="50" class="mx-auto my-4"></v-img>
                </v-list-item>

                <v-divider class="divider"></v-divider>

                <v-list dense nav>
                    <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.route" link exact
                        class="menu-item" @click="handleMenuItemClick">
                        <v-list-item-icon>
                            <v-icon>
                                {{ item.icon + (item.route === route.path ? '' : '-outline') }}
                            </v-icon>
                            {{ item.title }}
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </transition>

        <!-- Main Content -->
        <v-main>
            <v-container fluid class="main-container">
                <NuxtPage />
            </v-container>
        </v-main>

        <!-- Floating Action Button -->
        <v-btn fab dark class="fab-button" @click="scrollToTop">
            <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
    </v-app>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { startSpeechRecognition } from '~/utils/speechRecognition.js';
import { speak } from '~/utils/speechSynthesis.js';

const { smAndDown } = useDisplay();
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const drawer = ref(!smAndDown.value);
const miniVariant = ref(false);
const router = useRouter();
const route = useRoute();

const menuItems = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/' },
    { title: 'Hotels', icon: 'mdi-bed', route: '/hotels' },
];

const navigateTo = (path) => {
    router.push(path);
};

const logout = () => {
    // Implement your logout logic here
    router.push('/login');
};

const currentPageTitle = computed(() => {
    const currentItem = menuItems.find((item) => item.route === route.path);
    return currentItem ? currentItem.title : 'Admin Panel';
});

const searchQuery = ref('');

const userName = ref('John Doe');

const timeOfDay = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
});

const toggleMiniVariant = () => {
    miniVariant.value = !miniVariant.value;
};

// Function to toggle the drawer's visibility
const isDrawerVisible = computed(() => {
    return drawer.value;
});

// Function to toggle drawer
const toggleDrawer = () => {
    drawer.value = !drawer.value;
};

// Handle menu item click for responsive behavior
const handleMenuItemClick = () => {
    if (smAndDown.value) {
        drawer.value = false;
    }
};

const notificationCount = ref(0); // Example notification count

// Watch for screen size changes to adjust the drawer state
watch(
    () => smAndDown.value,
    (newVal) => {
        drawer.value = !newVal;
    }
);

// TTS Enabled State
const isTtsEnabled = ref(true); // Default to enabled

// Load TTS preference from localStorage on mount
onMounted(() => {
    const savedTts = localStorage.getItem('isTtsEnabled');
    if (savedTts !== null) {
        isTtsEnabled.value = JSON.parse(savedTts);
    } else {
        isTtsEnabled.value = true;
    }
});

// Function to toggle TTS
const toggleTts = () => {
    localStorage.setItem('isTtsEnabled', JSON.stringify(isTtsEnabled.value));
    if (isTtsEnabled.value) {
        speak('Text-to-speech has been enabled.');
    } else {
        speak('Text-to-speech has been disabled.');
    }
};

// Conditional speak function based on TTS state
function speakIfEnabled(text, options = {}) {
    if (isTtsEnabled.value) {
        speak(text, options);
    }
}

// Commands for Speech Recognition
const commands = {
    'open dashboard': () => {
        navigateTo('/');
        speakIfEnabled('Opening dashboard.');
    },
    'open hotels': () => {
        navigateTo('/hotels');
        speakIfEnabled('Opening hotels.');
    },
    'open profile': () => {
        navigateTo('/profile');
        speakIfEnabled('Opening your profile.');
    },
    'open notifications': () => {
        navigateTo('/notifications');
        speakIfEnabled('Opening notifications.');
    },
    logout: () => {
        logout();
        speakIfEnabled('Logging out.');
    },
    'toggle menu': () => {
        toggleDrawer();
        speakIfEnabled('Toggling the menu.');
    },
    'scroll to top': () => {
        scrollToTop();
        speakIfEnabled('Scrolling to the top.');
    },
    'search *query': (query) => {
        searchQuery.value = query;
        speakIfEnabled(`Searching for ${query}.`);
    },
    help: () => {
        alert('Help: Use voice commands to navigate the app.');
        speakIfEnabled('Help: Use voice commands to navigate the app.');
    },
};

// Initialize Speech Recognition
startSpeechRecognition(commands);
</script>

<style>
:root {
    --primary-color: #C94F5D;
    --primary-color-light: #D46B77;
    /* Lighter shade of primary color */
    --primary-color-dark: #B03E4D;
    /* Darker shade of primary color */
    --secondary-color: #2B3151;
    --secondary-color-light: #4A5A74;
    --accent-color: #5F7495;
    --background-color: #F8F9FA;
    --surface-color: #FFFFFF;
    --text-color: #212121;
    --muted-text-color: #757575;
}

.default-layout {}

/* Remove margins and border-radius */
.v-navigation-drawer,
.v-app-bar,
.main-container {
    margin: 0 !important;
    border-radius: 0 !important;
}

/* Navigation Drawer */
.navigation-drawer {
    width: 280px;
    background: var(--secondary-color) !important;
    color: #FFFFFF !important;
    transition: transform 0.3s ease, width 0.3s ease;
    padding-top: 20px;
    padding-bottom: 20px;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.v-navigation-drawer--mini-variant {
    width: 80px;
}

.logo-container {
    margin: 8px;
}

.logo-container .v-img {
    max-height: 50px;
    max-width: 100%;
    object-fit: contain;
}

/* Divider */
.divider {
    margin: 16px;
    background: linear-gradient(to right, var(--primary-color), var(--primary-color-light));
    height: 1px;
    border: none;
}

/* Menu Item */
.menu-item {
    color: #FFFFFF;
    transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
    border-radius: 8px;
    margin: 8px 16px;
    padding: 10px 16px;
}

.menu-item:hover,
.menu-item:focus {
    background-color: var(--primary-color-light);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* Active Menu Item */
.menu-item.v-list-item--active {
    background-color: var(--primary-color);
    color: #FFFFFF;
}

.menu-item.v-list-item--active:hover,
.menu-item.v-list-item--active:focus {
    background-color: var(--primary-color-dark);
}

/* Menu Item Icon */
.menu-item .v-list-item-icon .v-icon {
    color: #FFFFFF;
    font-size: 20px;
}

.menu-item.v-list-item--active .v-list-item-icon .v-icon {
    color: #FFFFFF;
}

/* Menu Item Title */
.menu-item .v-list-item-title {
    font-size: 16px;
    font-weight: 500;
}

/* App Bar */
.v-app-bar {
    height: 70px;
    background: var(--secondary-color) !important;
    color: #FFFFFF !important;
    z-index: 10;
    padding-left: 16px;
    padding-right: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
}

.v-app-bar::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: linear-gradient(to right, var(--primary-color), var(--primary-color-light));
}

.toolbar-title {
    font-weight: 600;
    font-size: 1.5rem;
    color: #FFFFFF;
}

/* Search Bar */
.search-bar {
    max-width: 400px;
    margin-right: 16px;
}

.search-bar .v-text-field__slot {
    background-color: var(--surface-color);
    border: 1px solid var(--accent-color);
    border-radius: 8px;
}

.search-bar .v-field__input {
    color: var(--text-color);
}

.search-bar input::placeholder {
    color: var(--accent-color);
}

.search-bar .v-input__prepend-inner .v-icon {
    color: var(--accent-color);
    margin-left: 8px;
}

.search-bar .v-field__append-inner {
    margin-right: 8px;
}

/* Navbar Icons */
.nav-icon .v-icon {
    color: var(--primary-color);
    transition: color 0.3s;
}

.nav-icon:hover .v-icon {
    color: var(--primary-color-dark);
}

.nav-icon {
    margin-left: 8px;
    margin-right: 8px;
}

/* Notification Badge */
.v-badge .v-badge__badge {
    background-color: var(--primary-color);
    border-radius: 8px;
    animation: bounce 0.5s;
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-10px);
    }

    60% {
        transform: translateY(-5px);
    }
}

/* Main Container */
.main-container {
    padding: 24px;
    min-height: calc(100vh - 70px);
    background-color: var(--background-color);
    background-repeat: no-repeat;
    background-position: top right;
    background-size: contain;
}

/* Header Section */
.header-section {
    margin-bottom: 24px;
    text-align: center;
}

.header-section h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--primary-color);
}

.header-section p {
    font-size: 1.2rem;
    color: var(--accent-color);
    font-weight: 400;
}

/* V-Card */
.content-card {
    background-color: var(--surface-color) !important;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px !important;
    color: var(--text-color);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.content-card:hover {
    transform: translateY(-2px);
}

.content-card .v-card-title {
    color: var(--accent-color);
    font-weight: 600;
}

.content-card .v-card-text {
    color: var(--text-color);
}

.card-icon {
    color: var(--primary-color);
    margin-right: 8px;
}

/* Floating Action Button */
.fab-button {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--primary-color) !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 56px;
    height: 56px;
}

.fab-button:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
}

/* Sidebar Toggle Button */
.sidebar-toggle-button .v-icon {
    color: var(--accent-color);
}

/* Focus Styles for Accessibility */
.v-btn:focus,
.v-list-item:focus,
.v-app-bar-nav-icon:focus {
    outline: 2px solid var(--secondary-color);
    outline-offset: 2px;
}

/* Ensure V-Icon has appropriate contrast */
.v-icon {
    color: inherit;
}

/* Subtle Animations */
.menu-item,
.v-btn,
.v-icon {
    transition: all 0.3s ease;
}

/* Transition for Navigation Drawer */
.drawer-transition-enter-active,
.drawer-transition-leave-active {
    transition: all 0.3s ease;
}

.drawer-transition-enter-from,
.drawer-transition-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.drawer-transition-enter-to,
.drawer-transition-leave-from {
    transform: translateX(0);
    opacity: 1;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
    .header-section {
        text-align: center;
    }

    .header-section h1 {
        font-size: 2rem;
    }

    .header-section p {
        font-size: 1rem;
    }

    .fab-button {
        width: 48px;
        height: 48px;
    }
}

.v-application {
    min-height: 100vh !important;
}

.v-main {
    flex: 1 0 auto !important;
}

/* Optional: Adjust the main container to allow the background to show */
.main-container {
    background-image: url('/images/escheresque.png');
    background-size: auto;
    background-repeat: repeat;
    background-position: center;
    background-attachment: fixed;
    /* Optional: Overlay with a semi-transparent color */
    background-color: rgba(255, 255, 255, 0.9);
}

/* Align the TTS toggle switch vertically centered */
.v-switch {
    display: flex;
    align-items: center;
}
</style>