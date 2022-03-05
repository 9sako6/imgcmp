import { assertEquals } from "../deps.ts";
import { bytesToUnit, fileSize } from "./file_size.ts";

Deno.test("fileSize() returns the file size in bytes", async () => {
  assertEquals(await fileSize("test/text/greet.txt"), 6);
});

Deno.test("bytesToUnit()", () => {
  assertEquals(bytesToUnit(1024 ** 4 * 8), "8.00 TiB");
  assertEquals(bytesToUnit(1024 ** 3 * 8), "8.00 GiB");
  assertEquals(bytesToUnit(1024 ** 2 * 8), "8.00 MiB");
  assertEquals(bytesToUnit(1024 * 8), "8.00 KiB");
  assertEquals(bytesToUnit(3), "3 B");
  assertEquals(bytesToUnit(0), "0 B");
  assertEquals(bytesToUnit(-1), "");
});
