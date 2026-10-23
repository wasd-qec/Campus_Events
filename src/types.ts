export type Category = "talk" | "workshop" | "social" | "sport";

export interface CampusEvent {
  id: number;
  title: string;
  category: Category;
  startsAt: string; // ISO date, e.g. "2026-11-02T09:00:00Z"
  location: string;
  capacity: number;
  booked: number;   // seats already taken
}
