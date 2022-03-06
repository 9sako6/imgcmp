import { fileSize } from "../image/file_size.ts";
import { ensureFile } from "../deps.ts";

type Stat = {
  [path: string]: {
    bytes: number[];
  };
};

export const exportStatJson = async (exportPath: string, paths: string[]) => {
  await ensureFile(exportPath);
  const stat: Stat = JSON.parse((await Deno.readTextFile(exportPath)) || "{}");

  for (const path of paths.sort()) {
    if (!stat[path]) {
      stat[path] = { bytes: [] };
    }
    const currentBytes = await fileSize(path);

    stat[path] = {
      bytes: [...stat[path].bytes, currentBytes],
    };
  }

  await Deno.writeTextFile(exportPath, JSON.stringify(stat));
};
