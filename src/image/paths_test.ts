import { assertEquals } from "../deps.ts";
import { imagePaths } from "./paths.ts";

Deno.test("imagePaths() lists image paths", async () => {
  const actual = (await imagePaths(".")).sort();
  const expected = [
    "figs/actions_time.png",
    "figs/logo.png",
    "figs/required_repo_permissions.png",
    "figs/required_user_permissions.png",
    "figs/sample_pull_request.png",
    "fixtures/images/code.gif",
    "fixtures/images/code.jpg",
    "fixtures/images/code.png",
    "fixtures/images/code.svg",
    "fixtures/images/code.webp",
    "fixtures/images/code_copy.webp",
  ];
  assertEquals(actual, expected);
});

Deno.test("imagePaths() lists image paths under the fixtures directory", async () => {
  const actual = (await imagePaths("fixtures")).sort();
  const expected = [
    "fixtures/images/code.gif",
    "fixtures/images/code.jpg",
    "fixtures/images/code.png",
    "fixtures/images/code.svg",
    "fixtures/images/code.webp",
    "fixtures/images/code_copy.webp",
  ];
  assertEquals(actual, expected);
});

Deno.test("imagePaths() lists image paths without pathsIgnoreGlob patterns", async () => {
  const actual = (await imagePaths(".", { pathsIgnoreRegExp: /figs\/.+png/ }))
    .sort();
  const expected = [
    "fixtures/images/code.gif",
    "fixtures/images/code.jpg",
    "fixtures/images/code.png",
    "fixtures/images/code.svg",
    "fixtures/images/code.webp",
    "fixtures/images/code_copy.webp",
  ];
  assertEquals(actual, expected);
});
