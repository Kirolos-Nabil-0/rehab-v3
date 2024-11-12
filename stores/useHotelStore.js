import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useHotelStore = defineStore("hotel", () => {
  const hotels = ref([]);
  const selectedHotel = ref(null);

  // Fetch hotels data
  const fetchHotels = async () => {
    try {
      const data = await $fetch(
        "https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/hotels"
      );
      hotels.value = data;
    } catch (error) {
      hotels.value = [];
    }
  };

  // Fetch a specific hotel by ID
  const fetchHotel = async (id) => {
    try {
      const data = await $fetch(
        `https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/hotels/${id}`
      );
      selectedHotel.value = data;
    } catch (error) {
      selectedHotel.value = null;
    }
  };

  // Add a new hotel to the list
  const addHotel = async (hotel) => {
    try {
      const response = await $fetch(
        "https://my-json-server.typicode.com/Kirolos-Nabil-0/rehab-v3/hotels",
        {
          method: "POST",
          body: JSON.stringify(hotel),
        }
      );
      hotels.value.push(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  // Computed properties for summary statistics

  // Total count of hotels
  const totalHotels = computed(() => hotels.value.length);

  // Count of hotels by category
  const hotelsByCategory = computed(() => {
    return hotels.value.reduce((acc, hotel) => {
      const category = hotel.hotel_category;
      if (acc[category]) {
        acc[category]++;
      } else {
        acc[category] = 1;
      }
      return acc;
    }, {});
  });

  // Count of hotels by location
  const hotelsByLocation = computed(() => {
    return hotels.value.reduce((acc, hotel) => {
      const location = hotel.hotel_location;
      if (acc[location]) {
        acc[location]++;
      } else {
        acc[location] = 1;
      }
      return acc;
    }, {});
  });

  // Count of hotels by star rating (e.g., "5 stars", "3 stars")
  const hotelsByStarRating = computed(() => {
    return hotels.value.reduce((acc, hotel) => {
      const rating = hotel.hotel_category;
      if (rating.includes("stars")) {
        if (acc[rating]) {
          acc[rating]++;
        } else {
          acc[rating] = 1;
        }
      }
      return acc;
    }, {});
  });

  return {
    hotels,
    selectedHotel,
    fetchHotels,
    fetchHotel,
    addHotel,
    totalHotels,
    hotelsByCategory,
    hotelsByLocation,
    hotelsByStarRating,
  };
});
