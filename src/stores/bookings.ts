import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { bookingsApi } from "../api/bookings";
import { eventsApi } from "../api/events";
import { ApiError } from "../api/http";
import { seatsLeft } from "../format";
import type { Booking, BookingInput, CampusEvent } from "../types";
import { useEventsStore } from "./events";

export const useBookingsStore = defineStore("bookings", () => {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const totalSeats = computed(() => bookings.value.reduce((n, b) => n + b.seats, 0));

  async function fetchAll() {
    loading.value = true;
    try {
      bookings.value = await bookingsApi.list();
    } finally {
      loading.value = false;
    }
  }

  async function book(event: CampusEvent, input: BookingInput): Promise<Booking> {
    if (input.seats > seatsLeft(event)) {
      throw new ApiError(409, "Not enough seats left.");
    }

    const booking = await bookingsApi.create({
      eventId: event.id,
      name: input.name,
      email: input.email,
      seats: input.seats,
      createdAt: new Date().toISOString(),
    });
    const updatedEvent = await eventsApi.setBooked(event.id, event.booked + input.seats);
    useEventsStore().replace(updatedEvent);
    bookings.value.unshift(booking);
    return booking;
  }

  async function cancel(booking: Booking) {
    const events = useEventsStore();
    const event = await events.fetchOne(booking.eventId);
    await bookingsApi.remove(booking.id);
    events.replace(await eventsApi.setBooked(event.id, Math.max(0, event.booked - booking.seats)));
    bookings.value = bookings.value.filter(b => b.id !== booking.id);
  }

  return { bookings, loading, totalSeats, fetchAll, book, cancel };
});
