import { assertMatch, assertNotMatch } from "../deps.ts";
import { imageRegExp } from "./regexp.ts";

Deno.test("matches images", () => {
  assertMatch("hello world.jpg", imageRegExp);
  assertMatch("fig/sample.gif", imageRegExp);
  assertMatch("fig/sample.jpeg", imageRegExp);
  assertMatch("fig/sample.png", imageRegExp);
  assertMatch("fig/sample.svg", imageRegExp);
  assertMatch("fig/sample.webp", imageRegExp);
  assertNotMatch("src/mod.ts", imageRegExp);
  assertNotMatch(".", imageRegExp);
});
