import type { CampusEvent } from "../types";

// Hard-coded data for week 4. In week 5 it comes from an API.
export const initialEvents: CampusEvent[] = [
  { id: 1, title: "Intro to Hackathons", category: "talk", startsAt: "2026-11-02T09:00:00Z", location: "Amphi A", capacity: 120, booked: 87 },
  { id: 2, title: "Git Workshop", category: "workshop", startsAt: "2026-11-04T13:30:00Z", location: "Lab 3", capacity: 30, booked: 27 },
  { id: 3, title: "Football Friday", category: "sport", startsAt: "2026-11-06T16:00:00Z", location: "Main field", capacity: 22, booked: 22 },
  { id: 4, title: "Welcome Party", category: "social", startsAt: "2026-11-07T18:00:00Z", location: "Student Hall", capacity: 200, booked: 140 },
  { id: 5, title: "Vue in Practice", category: "workshop", startsAt: "2026-11-10T08:00:00Z", location: "Lab 1", capacity: 25, booked: 10 },
  { id: 6, title: "Careers in Software", category: "talk", startsAt: "2026-11-12T10:00:00Z", location: "Amphi B", capacity: 80, booked: 79 },
];
