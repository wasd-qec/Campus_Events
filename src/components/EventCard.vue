<script setup lang="ts">
import { computed } from "vue";
import type { CampusEvent } from "../types";
import { formatDate, seatsLeft } from "../format";

// TODO 1: declare a prop `event` of type CampusEvent (defineProps)
const props = defineProps<{
  event: CampusEvent;
}>();
// TODO 2: declare an event `book` that sends the event id (defineEmits)
const emit = defineEmits<{
  book: [id: number];
}>();

// TODO 3: computed values
//   left       -> seats left (use seatsLeft)
//   isFull     -> no seat left
//   almostFull -> 1 to 5 seats left
const left = computed(() => seatsLeft(props.event));
const isFull = computed(() => seatsLeft(props.event)==0);
const almostFull = computed(() => props.event.capacity-props.event.booked<=5 && props.event.capacity-props.event.booked>=1);
</script>

<template>
  <!-- TODO 4: replace the hard-coded text with the event's data (use formatDate) -->
  <!-- TODO 5: add the class "full" on <article> when the event is full -->
  <article class="card" :class="{ full: isFull }">
    <p class="category">{{ event.category }}</p>
    <h2>{{ event.title }}</h2>
    <p class="meta">{{ formatDate(event.startsAt) }} · {{ event.location }}</p>
    <!-- TODO 6: when full, show only <p class="badge">Full</p>.
         Otherwise show "N seats left" ("1 seat left" for one seat),
         with the class "warn" when almost full. Use v-if / v-else. -->
    <p v-if="isFull" class="badge">Full</p>
    <p v-else-if="left==1">1 seat left</p>
    <p v-else-if="almostFull" class="warn">{{ event.capacity - event.booked }} seats left</p>
    <p v-else>{{ event.capacity - event.booked }} seats left</p>
    <!-- TODO 7: disable the button when full; on click, emit "book" with the event id -->
     <button :disabled="isFull" @click="emit('book',event.id)">
      Book a seat
    </button>
  </article>
</template>

<style scoped>
.card { background: white; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.card.full { opacity: 0.7; }
h2 { font-size: 1.1rem; margin: 0; }
.category { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: #3178c6; margin: 0; }
.meta { color: #6b7280; margin: 0; }
.seats, .badge { margin: 0; font-weight: 600; }
.warn { color: #d73a49; }
.badge { color: white; background: #d73a49; align-self: flex-start; padding: 2px 10px; border-radius: 999px; }
button { margin-top: auto; align-self: flex-start; }
</style>
