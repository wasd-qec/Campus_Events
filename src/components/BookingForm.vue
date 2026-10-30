<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { BookingInput } from "../types";
import { hasErrors, validateBooking } from "../validation";

const props = defineProps<{ seatsLeft: number; pending?: boolean }>();
const emit = defineEmits<{ submit: [input: BookingInput] }>();

const form = reactive<BookingInput>({ name: "", email: "", seats: 1 });
const submitted = ref(false);
const errors = computed(() => validateBooking(form, props.seatsLeft));

function onSubmit() {
  submitted.value = true;
  if (hasErrors(errors.value)) return;
  emit("submit", {
    name: form.name.trim(),
    email: form.email.trim(),
    seats: form.seats,
  });
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <label>
      Name
      <input v-model="form.name" name="name" autocomplete="name" />
    </label>
    <p v-if="submitted && errors.name" class="error">{{ errors.name }}</p>

    <label>
      Email
      <input v-model="form.email" name="email" type="email" autocomplete="email" />
    </label>
    <p v-if="submitted && errors.email" class="error">{{ errors.email }}</p>

    <label>
      Seats
      <input v-model.number="form.seats" name="seats" type="number" min="1" max="4" />
    </label>
    <p v-if="submitted && errors.seats" class="error">{{ errors.seats }}</p>

    <button type="submit" :disabled="pending">{{ pending ? "Booking..." : "Book" }}</button>
  </form>
</template>

<style scoped>
form { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
label { display: flex; flex-direction: column; gap: 4px; font-weight: 600; }
.error { color: #d73a49; margin: 0; font-size: 0.9rem; }
button { align-self: flex-start; margin-top: 8px; }
</style>
