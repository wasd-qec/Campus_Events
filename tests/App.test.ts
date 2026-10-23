import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../src/App.vue";

beforeEach(() => localStorage.clear());

describe("App", () => {
  it("booking a seat updates the card and the booking count", async () => {
    const w = mount(App);
    expect(w.text()).toContain("You have booked 0 seats");
    const card = w.findAll("article")[1]!; // Git Workshop, 3 left
    await card.find("button").trigger("click");
    expect(card.text()).toContain("2 seats left");
    expect(w.text()).toContain("You have booked 1 seat.");
  });

  it("cannot book a full event", async () => {
    const w = mount(App);
    const full = w.findAll("article")[2]!; // Football Friday
    await full.find("button").trigger("click");
    expect(w.text()).toContain("You have booked 0 seats");
  });

  it("keeps my bookings after a reload", async () => {
    const first = mount(App);
    await first.findAll("article")[1]!.find("button").trigger("click");
    first.unmount();
    const second = mount(App);
    expect(second.text()).toContain("You have booked 1 seat.");
    expect(second.findAll("article")[1]!.text()).toContain("2 seats left");
  });
});
