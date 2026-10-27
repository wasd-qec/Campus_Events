# Summary: Part C & EventList / App Implementation

## 1. Running Targeted Tests (Vitest)
- **Single file**: `npm test -- tests/EventList.test.ts`
- **Specific test name**: `npm test -- -t "filters by category"`
- **In-code isolation**: Use `it.only(...)` or `describe.only(...)`.

---

## 2. EventList.vue Fixes

### TODO 3 (Filter Logic)
- **Problem**: Operator precedence (`&&` evaluated before `||`) and missing explicit `return` inside arrow function block `{}`.
- **Solution**:
  ```typescript
  const visible = computed(() => {
    const q = search.value.trim().toLowerCase();
    return props.events.filter(e => {
      const matchesCategory = category.value === "all" || e.category === category.value;
      const matchesQuery = e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  });
  ```

### TODO 5 (Counter text)
- Matches test expectation `"2 of 6 events"`:
  ```html
  <p class="count">{{ visible.length }} of {{ props.events.length }} events</p>
  ```

### TODO 6 (Template & Emits)
- Loop over `visible`, not `events`.
- Forward the `@book` event from `EventCard` up to parent:
  ```html
  <div v-if="visible.length" class="grid">
    <EventCard
      v-for="e in visible"
      :key="e.id"
      :event="e"
      @book="emits('book', $event)"
    />
  </div>
  <p v-else class="empty">
    No events match your search.
  </p>
  ```
- Keep `div.grid` outside `<p>` tags to avoid HTML hydration/parser errors.

---

## 3. Key Concepts Explained

### Component Emits & Data Passing
1. **`defineEmits`**: Declares what events the component can emit and the payload type (`book: [id: number]`).
2. **Re-emitting**: `<EventCard @book="emits('book', $event)" />` catches the card's emit and raises it to the parent.
3. **Parent Listener**: In `App.vue`, `<EventList @book="onBook" />` receives the emitted ID.

### Why `:key="e.id"` is Needed
- `:event="e"` passes the event data down to the component.
- `:key="e.id"` provides a stable identity to Vue's Virtual DOM algorithm so it can properly track, move, and destroy DOM elements without state/transition glitches.

### Separation of Responsibilities
- `EventCard.vue` handles presentation of a single event.
- `EventList.vue` owns the event list state, filtering, and `v-for` instantiation.

---

## 4. App.vue Booking State & Watchers

### Ref Initialization (`TODO 1` & `TODO 2`)
- **Syntax**: `const myBookings = ref<number[]>([]);`
  - `<number[]>` is the TypeScript type (array of numbers).
  - `([])` is the initial runtime value (empty array).
- **Access in script**: Requires `.value` (e.g. `myBookings.value.length`).

### Watching & LocalStorage (`TODO 4`)
```typescript
watch(myBookings, (newVal) => {
  localStorage.setItem("myBookings", JSON.stringify(newVal));
}, { deep: true });
```
- **`newVal`**: Vue automatically supplies the entire updated array of `myBookings.value`.
- **`localStorage.setItem(key, val)`**: Overwrites the stored string for `"myBookings"`.
- **`{ deep: true }`**: Ensures mutations inside the array (like `.push()`) trigger the watcher.
