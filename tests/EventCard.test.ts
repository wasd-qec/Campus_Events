import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import EventCard from "../src/components/EventCard.vue";
import type { CampusEvent } from "../src/types";

const event: CampusEvent = {
  id: 7, title: "Git Workshop", category: "workshop",
  startsAt: "2026-11-04T13:30:00Z", location: "Lab 3", capacity: 30, booked: 27,
};

describe("EventCard", () => {
  it("shows the title, date, location and seats left", () => {
    const w = mount(EventCard, { props: { event } });
    expect(w.find("h2").text()).toBe("Git Workshop");
    expect(w.text()).toContain("Wed 4 Nov, 13:30");
    expect(w.text()).toContain("Lab 3");
    expect(w.text()).toContain("3 seats left");
  });

  it("uses the singular for one seat", () => {
    const w = mount(EventCard, { props: { event: { ...event, booked: 29 } } });
    expect(w.text()).toContain("1 seat left");
  });

  it("emits book with the event id when the button is clicked", async () => {
    const w = mount(EventCard, { props: { event } });
    await w.find("button").trigger("click");
    expect(w.emitted("book")).toEqual([[7]]);
  });

  it("shows Full and disables the button when no seats are left", async () => {
    const w = mount(EventCard, { props: { event: { ...event, booked: 30 } } });
    expect(w.text()).toContain("Full");
    expect(w.text()).not.toContain("seats left");
    expect(w.find("button").attributes("disabled")).toBeDefined();
  });

  it("updates when the prop changes", async () => {
    const w = mount(EventCard, { props: { event } });
    await w.setProps({ event: { ...event, booked: 20 } });
    expect(w.text()).toContain("10 seats left");
  });
});
