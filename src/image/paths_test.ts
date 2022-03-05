import { assertEquals } from "../deps.ts";
import { imagePaths } from "./paths.ts";

Deno.test("imagePaths() lists image paths", async () => {
  const actual = (await imagePaths(".")).sort();
  const expected = [
    "figs/actions_time.png",
    "figs/logo.png",
    "figs/needed_repo_permissions.png",
    "figs/sample_pull_request.png",
    "test/images/code.gif",
    "test/images/code.jpg",
    "test/images/code.png",
    "test/images/code.svg",
    "test/images/code.webp",
    "test/images/code_copy.webp",
  ];
  assertEquals(actual, expected);
});

Deno.test("imagePaths() lists image paths under the test directory", async () => {
  const actual = (await imagePaths("test")).sort();
  const expected = [
    "test/images/code.gif",
    "test/images/code.jpg",
    "test/images/code.png",
    "test/images/code.svg",
    "test/images/code.webp",
    "test/images/code_copy.webp",
  ];
  assertEquals(actual, expected);
});

Deno.test("imagePaths() lists image paths without pathsIgnoreGlob patterns", async () => {
  const actual = (await imagePaths(".", { pathsIgnoreRegExp: /figs\/.+png/ }))
    .sort();
  const expected = [
    "test/images/code.gif",
    "test/images/code.jpg",
    "test/images/code.png",
    "test/images/code.svg",
    "test/images/code.webp",
    "test/images/code_copy.webp",
  ];
  assertEquals(actual, expected);
});
