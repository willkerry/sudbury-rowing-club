import { fakerEN_GB as faker } from "@faker-js/faker";
import type { SRCEvent } from "@sudburyrc/api";
import { expect, test } from "vitest";
import IcalBuilder from "../src/index";

const NUMBER_OF_EVENTS = 10;
const FIRST_DATE = "2024-05-01";

const addNWeeksToDate = (n: number): string => {
  const d = new Date(FIRST_DATE);
  d.setTime(d.getTime() + n * 7 * 24 * 60 * 60 * 1000);

  return d.toISOString();
};

faker.seed(0);

const events: SRCEvent[] = new Array(NUMBER_OF_EVENTS)
  .fill(null)
  .map((_, i) => {
    const date = addNWeeksToDate(i);

    return {
      id: faker.commerce.isbn(),
      startDate: date,
      endDate: date,
      competition: `${faker.location.city()} Regatta`,
      region: faker.location.county(),
      notes: faker.lorem.sentence(),
      url: faker.internet.url(),
      status: faker.datatype.boolean() ? 0 : 1,
    };
  });

test("IcalBuilder", () => {
  const builder = new IcalBuilder("SudburyRC", "Europe/London", "SudburyRC");

  builder.set(events);

  const ical = builder.stringify();

  expect(ical).toMatchSnapshot();
});
