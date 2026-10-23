<script setup lang="ts">
import { computed, ref } from "vue";
import type { CampusEvent, Category } from "../types";
import EventCard from "./EventCard.vue";

const props = defineProps<{ events: CampusEvent[] }>();
// TODO 1: declare a "book" event (same as EventCard) so the list can pass it up

// TODO 2: two refs for the filters
//   search   -> the text typed in the search box
//   category -> Category | "all", starts at "all"

// TODO 3: a computed `visible` list:
//   - keep events of the selected category (or all)
//   - keep events whose title OR location contains the search text, ignoring case
</script>

<template>
  <section>
    <div class="filters">
      <!-- TODO 4: bind the input and the select to your refs with v-model -->
      <input type="search" placeholder="Search title or location" aria-label="Search" />
      <select aria-label="Category">
        <option value="all">All categories</option>
        <option value="talk">Talks</option>
        <option value="workshop">Workshops</option>
        <option value="social">Social</option>
        <option value="sport">Sport</option>
      </select>
    </div>

    <!-- TODO 5: show "<visible count> of <total> events" -->
    <p class="count">6 of 6 events</p>

    <!-- TODO 6: render one EventCard per visible event (v-for with a :key),
         pass the event as a prop and pass its "book" event up.
         When nothing is visible, show the empty message instead (v-if / v-else). -->
    <div class="grid"></div>
    <p class="empty">No events match your search.</p>
  </section>
</template>

<style scoped>
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filters input { flex: 1; min-width: 200px; }
.count { color: #6b7280; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.empty { padding: 32px; text-align: center; background: white; border-radius: 10px; }
</style>
