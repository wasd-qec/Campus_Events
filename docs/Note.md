# Router Notes

## 1. What is the "anything else" route (`/:pathMatch(.*)*`)?
The path `/:pathMatch(.*)*` serves as a catch-all route for any URL path that does not match any previously defined routes. The `(.*)*` pattern captures all remaining segments of the path, directing unmatched URLs to `NotFoundPage`.

## 2. Why must `/events/new` come before `/events/:id` if `:id` had no `(\\d+)`?
Without the `(\\d+)` digit-only constraint, the dynamic parameter `:id` matches any string, including `"new"`. If `/events/:id` were registered first, visiting `/events/new` would match the detail route with `id = "new"` instead of routing to the create-event page.

## 3. What is the Vue Router `history` concept?
`history` in Vue Router refers to the navigation mode and history driver used to track and manage navigation in an application.
* **Built-in driver:** Provided directly by `vue-router` via functions like `createWebHistory()` (uses browser HTML5 history) or `createMemoryHistory()` (in-memory history for tests/SSR).
* **What it stores/manages:** It is an object implementing `RouterHistory`. It stores current location state and provides methods (`push`, `replace`, `go`, `listen`) to sync route changes with the browser address bar without full page reloads.

## 4. What does `makeRouter` do, who calls it, and when?
`makeRouter` is a factory function that instantiates and configures a Vue Router instance with routes and guards.
* **Who calls it:**
  * `src/main.ts`: Called on app startup (`createApp(App).use(makeRouter()).mount("#app")`) with default browser web history.
  * Unit tests (`tests/router.test.ts`, `tests/EventsPage.test.ts`): Called inside test suites (often passing an in-memory history driver) to create clean, isolated router instances per test so tests do not leak state into each other.

## 5. Exports: Returning Nothing vs. Returning a Router Instance
* **`export const routes = [...]`**: Exports a static data structure directly. Variables and arrays hold data, so there is no function execution or `return` keyword involved.
* **`export function makeRouter() { ... return router; }`**: Exports a factory function. It executes setup logic (creating the router, adding navigation guards) and explicitly returns the resulting `Router` object so the caller can mount or test it. If a function does not have a `return` statement (or returns `void`), the caller receives `undefined`.


