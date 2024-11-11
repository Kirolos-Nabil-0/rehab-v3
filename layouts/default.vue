<template>
    <v-app>
        <!-- Top App Bar -->
        <v-app-bar app class="app-bar-gradient elevation-12">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{ currentPageTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- User Menu -->
            <v-menu offset-y>
                <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
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

        <!-- Navigation Drawer -->
        <v-navigation-drawer app v-model="drawer" :permanent="!smAndDown" class="navigation-drawer-gradient">
            <v-list-item class="logo-container">
                <v-img src="https://via.placeholder.com/150x50?text=Logo" alt="Logo" height="50"
                    class="mx-auto my-4"></v-img>
            </v-list-item>

            <v-divider class="divider"></v-divider>

            <v-list dense nav>
                <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.route" link exact
                    class="menu-item">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- Main Content -->
        <v-main>
            <v-container fluid class="main-container">
                <v-card class="pa-4">
                    <NuxtPage />
                </v-card>
            </v-container>
        </v-main>

        <!-- Footer -->
        <v-footer app class="footer-gradient">
            <v-container class="text-center">
                <span>&copy; 2024 Your Company. All rights reserved.</span>
            </v-container>
        </v-footer>
    </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay();

const drawer = ref(!smAndDown.value);
const router = useRouter();
const route = useRoute();

const menuItems = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/' },
    { title: 'Users', icon: 'mdi-account-multiple', route: '/users' },
    { title: 'Settings', icon: 'mdi-cog', route: '/settings' },
    // Add more menu items as needed
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

// Watch for screen size changes to adjust the drawer state
watch(
    () => smAndDown.value,
    (newVal) => {
        drawer.value = !newVal;
    }
);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

* {
    font-family: 'Inter', sans-serif;
}

/* Global styles */
body {
    background-color: #2B3151;
}

/* Remove margins and border-radius */
.v-navigation-drawer.navigation-drawer-gradient,
.v-app-bar.app-bar-gradient,
.main-container,
.v-footer.footer-gradient {
    margin: 0 !important;
    border-radius: 0 !important;
}

/* Navigation Drawer */
.v-navigation-drawer.navigation-drawer-gradient {
    width: 280px;
    background: linear-gradient(135deg, #2B3151 0%, #5F7495 100%) !important;
    background-size: 200% 200% !important;
    animation: gradientAnimation 10s ease infinite !important;
    color: #fff !important;
}

.logo-container {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin: 8px;
}

.divider {
    margin: 0 16px;
    background-color: rgba(255, 255, 255, 0.2);
}

.menu-item {
    color: rgba(255, 255, 255, 0.9);
    transition: background-color 0.3s, color 0.3s;
    border-radius: 8px;
    margin: 4px 8px;
}

.menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

.menu-item.v-list-item--active {
    background-color: rgba(255, 255, 255, 0.2);
}

/* App Bar */
.v-app-bar.app-bar-gradient {
    height: 70px;
    background: linear-gradient(45deg, #C94F5D 30%, #5F7495 90%) !important;
    background-size: 200% 200% !important;
    animation: gradientAnimation 10s ease infinite !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
    z-index: 10;
    color: white !important;
}

.toolbar-title {
    font-weight: 600;
    font-size: 1.5rem;
}

/* Main Container */
.main-container {
    padding: 24px;
    min-height: calc(100vh - 70px - 64px);
}

/* V-Card */
.v-card {
    background: linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%) !important;
    background-size: 200% 200% !important;
    animation: gradientAnimation 15s ease infinite !important;
    border-radius: 16px !important;
}

/* Footer */
.v-footer.footer-gradient {
    padding: 16px 0;
    background: linear-gradient(135deg, #2B3151 0%, #5F7495 100%) !important;
    background-size: 200% 200% !important;
    animation: gradientAnimation 10s ease infinite !important;
    color: #fff !important;
}

/* Define keyframes for gradient animations */
@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
