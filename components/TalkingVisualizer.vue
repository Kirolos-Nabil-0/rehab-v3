<template>
    <div ref="canvasContainer" class="visualizer-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { speak } from '@/utils/speechSynthesis.js'; // Adjust the path as needed
// Props (optional): If you want to pass in parameters
// defineProps({ ... })
import { useAppSettingsStore } from '@/stores/useAppSettingsStore';

const appSettingsStore = useAppSettingsStore();
const speakIfEnabled = (text) => {
    if (appSettingsStore.isSpeechEnabled) {
        speak(text);
    }
};
const canvasContainer = ref(null);

// Reactive variable to trigger animations
const currentSpeechText = ref('');

// Watch for changes in currentSpeechText to trigger animations
watch(currentSpeechText, (newText) => {
    if (newText) {
        triggerAnimation(newText);
    }
});

// Function to set the current speech text
// This function can be called from outside via emits or global event bus
const setSpeechText = (text) => {
    currentSpeechText.value = text;
};

// THREE.js variables
let scene, camera, renderer, controls, cube, animationId;

onMounted(() => {
    initThree();
    animate();
});

onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId);
    renderer.dispose();
    scene = null;
});

function initThree() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2c3e50); // Dark blue background

    // Camera
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    canvasContainer.value.appendChild(renderer.domElement);

    // OrbitControls (optional for user interaction)
    controls = new OrbitControls(camera, renderer.domElement);

    // Add a Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xC94F5D });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Handle Window Resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Example Animation Trigger
function triggerAnimation(text) {
    // Simple animation: Pulse the cube when speech is triggered
    // More complex animations can be implemented as needed

    const pulseDuration = 500; // milliseconds
    const originalScale = cube.scale.clone();
    const targetScale = new THREE.Vector3(1.5, 1.5, 1.5);

    // Tween-like animation
    const startTime = performance.now();

    function animatePulse(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / pulseDuration, 1);

        // Ease out
        const scaleFactor = 1 + 0.5 * (1 - Math.cos(progress * Math.PI)) / 2;
        cube.scale.set(
            originalScale.x * scaleFactor,
            originalScale.y * scaleFactor,
            originalScale.z * scaleFactor
        );

        if (progress < 1) {
            requestAnimationFrame(animatePulse);
        } else {
            // Reset scale after pulse
            cube.scale.copy(originalScale);
        }
    }

    requestAnimationFrame(animatePulse);
}

// Expose a method to allow external components to trigger animations
// Alternatively, use an event bus or a global state
// For simplicity, we'll use an event listener

// Listen for custom events
window.addEventListener('tts:trigger', (event) => {
    const { text } = event.detail;
    setSpeechText(text);
});
</script>

<style scoped>
.visualizer-container {
    width: 100%;
    height: 100%;
    /* Optional: Positioning and z-index */
}
</style>