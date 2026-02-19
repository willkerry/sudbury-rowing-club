import { fakerEN_GB as faker } from "@faker-js/faker";
import type { BREvent } from "@sudburyrc/api";
import { expect, test } from "vitest";
import IcalBuilder from "../src/index";

const NUMBER_OF_EVENTS = 10;
const FIRST_DATE = "2024-05-01";

const addNWeeksToDate = (n: number): Date => {
  const d = new Date(FIRST_DATE);
  d.setTime(d.getTime() + n * 7 * 24 * 60 * 60 * 1000);

  return d;
};

faker.seed(0);

const events: BREvent[] = new Array(NUMBER_OF_EVENTS).fill(null).map((_, i) => {
  const date = addNWeeksToDate(i);

  return {
    cancelled: faker.datatype.boolean(),
    competition: `${faker.location.city()} Regatta`,
    endDate: date,
    id: faker.commerce.isbn(),
    notes: faker.lorem.sentence(),
    region: faker.location.county(),
    startDate: date,
    status: faker.datatype.boolean() ? 0 : 1,
    url: faker.internet.url(),
  };
});

test("IcalBuilder", () => {
  const builder = new IcalBuilder("SudburyRC", "Europe/London", "SudburyRC");

  builder.set(events);

  const ical = builder.stringify();

  expect(ical).toMatchSnapshot();
});
