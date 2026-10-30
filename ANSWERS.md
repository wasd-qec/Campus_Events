# Practice answers

1. In development, the Vite dev server serves the SPA shell and the client-side router loads `/events/2`. In production, the server must serve `index.html` as a fallback for unknown application routes so the router can handle the path after a refresh.

2. Yes. A student could call the JSON-server endpoint directly or send a crafted HTTP request, bypassing the client guard. The server/API must enforce the organiser authorization and validate the event data itself.

3. `onMounted` runs only when the component is mounted. If Vue reuses the component while only the `id` route parameter changes, the new event would not load; watching the id handles both the initial load and subsequent changes.

4. `storeToRefs` preserves reactivity when store state and getters are destructured. A plain destructuring assignment would copy the current value and would not update when the store changes.

5. If the POST succeeds but the PATCH fails, the booking exists while the event's booked count is stale, so the data becomes inconsistent. The server can avoid this with a transaction that updates both records atomically, or with a single booking operation that performs the consistency check and update together.
