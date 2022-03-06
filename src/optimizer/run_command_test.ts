import { assertEquals } from "../deps.ts";
import { runCommand } from "./run_command.ts";

Deno.test("runCommand() executes ls command", async () => {
  const { code } = await runCommand(["ls", "LICENSE.md", "README.md"]);

  assertEquals(code, 0);
});

Deno.test("runCommand() fails ls command", async () => {
  try {
    await runCommand(["ls", "not-exist-path"]);
  } catch (error) {
    assertEquals(error.code, 1);
  }
});
