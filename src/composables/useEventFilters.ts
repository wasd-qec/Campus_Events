import { computed, ref, type Ref } from "vue";
import type { CampusEvent, Category } from "../types";

export function useEventFilters(events: Ref<CampusEvent[]>) {
  const search = ref("");
  const category = ref<Category | "all">("all");
  const visible = computed(() => {
    const query = search.value.trim().toLowerCase();
    return events.value.filter(event => {
      const matchesSearch =
        query === "" ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);
      const matchesCategory = category.value === "all" || event.category === category.value;
      return matchesSearch && matchesCategory;
    });
  });
  return { search, category, visible };
}
