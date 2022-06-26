import { fileSize } from "../image/file_size.ts";
import { ensureFile } from "../deps.ts";

export type Stat = {
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

export const readStatJson = async (statJsonPath: string): Promise<Stat> => {
  return await JSON.parse(
    (await Deno.readTextFile(statJsonPath)) || "{}",
  ) as Stat;
};

export const fileStatistics = (json: Stat) => {
  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;

  for (const path of Object.keys(json)) {
    const [beforeBytes, afterBytes] = json[path].bytes.slice(-2);
    totalBeforeBytes += beforeBytes;
    totalAfterBytes += afterBytes;
  }

  const totalDiffRate =
    ((totalBeforeBytes - totalAfterBytes) / totalBeforeBytes * 100);

  return {
    totalAfterBytes,
    totalBeforeBytes,
    totalDiffRate,
  };
};
