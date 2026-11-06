1. In EventList, what goes wrong if you use the array index as :key and the list gets filtered while a
   card has local state (for example an open details panel)?
   Vue's virtual DOM diffing algorithm reuses component instances based on their key. If you use the index, Vue assumes the item at index 0 before filtering is the same item at index 0 after filtering, so local state (like an open details panel) stays tied to the position rather than the actual event data.

2. Why is visible a computed and not a function called from the template? What is the difference
   when you type in the search box?
   `computed` properties are cached based on their reactive dependencies, whereas functions called from the template re-run on every component re-render. When typing in the search box, the computed only re-evaluates when reactive inputs change, avoiding unnecessary recalculations on unrelated re-renders.

3. EventCard emits book instead of changing event.booked. Give two reasons.
   1. It respects Vue's one-way data flow (props down, events up): child components should not mutate props directly.
   2. `App` is the single source of truth that owns the event data and booking validation logic (e.g., checking seat availability and tracking `myBookings`).

4. You write const { booked } = reactive(event); booked++. The page does not change.
   Why?
   Destructuring a reactive object extracts the primitive value (`number`), which breaks reactivity. Incrementing `booked` only modifies the local variable, leaving the original reactive property on `event` untouched.

5. Where does myBookings live, and why not in EventCard or EventList?
   `myBookings` lives in `App` (the root component). It cannot live in `EventCard` or `EventList` because it is shared state required at the application level—for calculating the global `bookingCount`, persisting to `localStorage`, and coordinating across child components.
