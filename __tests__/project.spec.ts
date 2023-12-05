import sync from "../src/index";

test("checking", () => {
  return expect(
    sync({ folder: "./locales", outputDirectory: "../localesOutput" })
  ).toBe(true);
});
