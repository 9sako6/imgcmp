import { assertEquals } from "../deps.ts";
import { imagePaths } from "./paths.ts";

Deno.test("imagePaths() lists image paths", async () => {
  const actual = await imagePaths(".");
  const expected = [
    "test/images/code.png",
    "test/images/code.jpg",
    "test/images/code.svg",
    "test/images/code_copy.webp",
    "test/images/code.gif",
    "test/images/code.webp",
    "figs/sample_pull_request.png",
    "figs/logo.png",
    "figs/needed_repo_permissions.png",
    "figs/actions_time.png",
  ];
  assertEquals(actual, expected);
});

Deno.test("imagePaths() lists image paths under the test directory", async () => {
  const actual = await imagePaths("test");
  const expected = [
    "test/images/code.png",
    "test/images/code.jpg",
    "test/images/code.svg",
    "test/images/code_copy.webp",
    "test/images/code.gif",
    "test/images/code.webp",
  ];
  assertEquals(actual, expected);
});

Deno.test("imagePaths() lists image paths without pathsIgnoreGlob patterns", async () => {
  const actual = await imagePaths(".", { pathsIgnoreRegExp: /figs\/.+png/ });
  const expected = [
    "test/images/code.png",
    "test/images/code.jpg",
    "test/images/code.svg",
    "test/images/code_copy.webp",
    "test/images/code.gif",
    "test/images/code.webp",
  ];
  assertEquals(actual, expected);
});
