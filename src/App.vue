<script setup lang="ts">
import { computed, ref, watch } from "vue";
import EventList from "./components/EventList.vue";
import { initialEvents } from "./data/events";
import type { CampusEvent } from "./types";

// A reactive copy of the hard-coded events
const events = ref<CampusEvent[]>(initialEvents.map(e => ({ ...e })));

// TODO 1: a ref `myBookings` holding the ids of the events I booked (one entry per seat)
const myBookings = ref<number[]>([]);

// TODO 2: a computed `bookingCount`
const bookingCount = computed(() => {
  return myBookings.value.length;
});
// or simply:
// const bookingCount = computed(() => myBookings.value.length);


// TODO 3: onBook(id): find the event; if it still has a seat,
//         increase its `booked` and add the id to myBookings
function onBook(id: number) {
  const found = events.value.find(e => e.id === id);
  if (found == undefined){return;}
  if (found.booked<found.capacity){
    found.booked++;
    myBookings.value.push(id);
  }
  console.log("book", id);
}


// TODO 4 (bonus): keep my bookings after a page reload
//   - watch myBookings and save it to localStorage (JSON.stringify)
watch(myBookings, (newVal) => {
  localStorage.setItem("myBookings", JSON.stringify(newVal));
}, {deep: true});
//   - read it back when the app starts, and add those seats to `booked`
const saved = localStorage.getItem('myBookings');
if(saved){
  const ids: number[] = JSON.parse(saved);
  ids.forEach(id => onBook(id));
}
</script>

<template>
  <main>
    <header>
      <h1>Campus Events</h1>
      <!-- TODO 5: show the real count ("1 seat" / "N seats") -->
      <p v-if="bookingCount==1">You have booked 1 seat.</p>
      <p v-else>You have booked {{ bookingCount }} seats</p>
    </header>
    <EventList :events="events" @book="onBook" />
  </main>
</template>

<style scoped>
header { margin-bottom: 16px; }
.mine { color: #6b7280; margin: 0; }
</style>
