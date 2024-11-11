import { defineStore } from "pinia";

const useHotelStore = defineStore("hotel", () => {
  const hotels = ref([]);
  const selectedHotel = ref(null);

  const fetchHotels = async () => {
    const { data, refresh, error, status, clear } = await useRehabAPiData(
      "hotels",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (status.value === "success") {
      hotels.value = data;
    } else {
      hotels.value = [];
    }
    return { data, refresh, error, status, clear };
  };

  const fetchHotel = async (id) => {
    const { data, refresh, error, status, clear } = await useRehabAPiData(
      `hotels/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (status.value === "success") {
      selectedHotel.value = data;
    } else {
      selectedHotel.value = null;
    }
    return { data, refresh, error, status, clear };
  };

  return {
    hotels,
    selectedHotel,
    fetchHotels,
    fetchHotel,
  };
});
