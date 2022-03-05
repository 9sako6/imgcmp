import { exportStatJson } from "./file_stat_json.ts";
import { assertEquals, assertRejects } from "../deps.ts";

Deno.test("exportStatJson()", async (t) => {
  const exportPath = "./test/stat.json";
  const paths = ["test/text/sample.txt"];

  await t.step("Create a sample file", async () => {
    await Deno.writeTextFile("test/text/sample.txt", "hello");
  });

  await t.step("exportStatJson() first time", async () => {
    // A stat file is not exist.
    await assertRejects(async () => {
      await Deno.readTextFile(exportPath);
    });
    await exportStatJson(exportPath, paths);
  });

  await t.step("exportStatJson() second time", async () => {
    assertEquals(
      await Deno.readTextFile(exportPath),
      '{"test/text/sample.txt":{"bytes":[5]}}',
    );

    // Modify the sample file.
    await Deno.writeTextFile("test/text/sample.txt", "hello, world");
    await exportStatJson(exportPath, paths);

    assertEquals(
      await Deno.readTextFile(exportPath),
      '{"test/text/sample.txt":{"bytes":[5,12]}}',
    );
  });

  await t.step("Delete files", async () => {
    await Deno.remove(exportPath);
    for (const path of paths) {
      await Deno.remove(path);
    }
  });
});
