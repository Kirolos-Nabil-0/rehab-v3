// stores/useHotelStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useHotelStore = defineStore("hotel", () => {
  const hotels = ref([]);
  const selectedHotel = ref(null);
  const error = ref(null);
  const loading = ref(false);

  // Fetch hotels data
  const fetchHotels = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        "https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/hotels"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      hotels.value = data;
      console.log("Fetched hotels:", hotels.value); // Debug log
    } catch (err) {
      console.error("Error fetching hotels:", err);
      error.value = err.message;
      hotels.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Fetch a specific hotel by ID
  const fetchHotel = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        `https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/hotels/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      selectedHotel.value = data;
      console.log("Fetched hotel:", selectedHotel.value); // Debug log
    } catch (err) {
      console.error("Error fetching hotel:", err);
      error.value = err.message;
      selectedHotel.value = null;
    } finally {
      loading.value = false;
    }
  };

  // Add a new hotel to the list
  const addHotel = async (hotel) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        "https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/hotels",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hotel),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newHotel = await response.json();
      hotels.value.push(newHotel);
      console.log("Added new hotel:", newHotel); // Debug log
      return newHotel;
    } catch (err) {
      console.error("Error adding hotel:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties for summary statistics

  // Total count of hotels
  const totalHotels = computed(() => hotels.value.length);

  // Count of hotels by category
  const hotelsByCategory = computed(() => {
    return hotels.value.reduce((acc, hotel) => {
      const category = hotel.hotel_category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  });

  // Count of hotels by location
  const hotelsByLocation = computed(() => {
    return hotels.value.reduce((acc, hotel) => {
      const location = hotel.hotel_location || "Unknown Location";
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
  });

  // Count of hotels by star rating (e.g., "5 stars", "3 stars")
  const hotelsByStarRating = computed(() => {
    return hotels.value.reduce((acc, hotel) => {
      const rating = hotel.hotel_category || "No Rating";
      if (rating.includes("stars")) {
        acc[rating] = (acc[rating] || 0) + 1;
      } else {
        acc["No Rating"] = (acc["No Rating"] || 0) + 1;
      }
      return acc;
    }, {});
  });

  return {
    hotels,
    selectedHotel,
    error,
    loading,
    fetchHotels,
    fetchHotel,
    addHotel,
    totalHotels,
    hotelsByCategory,
    hotelsByLocation,
    hotelsByStarRating,
  };
});
