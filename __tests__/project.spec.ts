import sync from "../src/index";

test("checking", () => {
  expect(
    sync({ folder: "/Users/paulocardoso/Projects/HawkStars/i18n/locales" })
  ).toBe(true);
});
