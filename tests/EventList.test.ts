import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import EventList from "../src/components/EventList.vue";
import EventCard from "../src/components/EventCard.vue";
import { initialEvents } from "../src/data/events";

const mountList = () => mount(EventList, { props: { events: initialEvents } });

describe("EventList", () => {
  it("renders one EventCard per event", () => {
    expect(mountList().findAllComponents(EventCard)).toHaveLength(6);
  });

  it("filters by title or location, ignoring case", async () => {
    const w = mountList();
    await w.find("input").setValue("lab");
    const titles = w.findAll("h2").map(h => h.text());
    expect(titles).toEqual(["Git Workshop", "Vue in Practice"]);
    expect(w.text()).toContain("2 of 6 events");
  });

  it("filters by category", async () => {
    const w = mountList();
    await w.find("select").setValue("talk");
    expect(w.findAll("h2").map(h => h.text())).toEqual(["Intro to Hackathons", "Careers in Software"]);
  });

  it("shows an empty state when nothing matches", async () => {
    const w = mountList();
    await w.find("input").setValue("zzz");
    expect(w.findAllComponents(EventCard)).toHaveLength(0);
    expect(w.text()).toContain("No events match");
  });

  it("passes the book event up to its parent", async () => {
    const w = mountList();
    await w.findAll("button")[1]!.trigger("click");
    expect(w.emitted("book")).toEqual([[2]]);
  });
});
