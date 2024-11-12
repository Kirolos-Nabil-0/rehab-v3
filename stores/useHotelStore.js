import { defineStore } from "pinia";
import { ref } from "vue";

export const useHotelStore = defineStore("hotel", () => {
  const hotels = ref([]);
  const selectedHotel = ref(null);

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

  return {
    hotels,
    selectedHotel,
    fetchHotels,
    fetchHotel,
    addHotel,
  };
});
