/** The size of the file, in bytes. */
export const fileSize = async (path: string) => {
  return (await Deno.stat(path)).size;
};

export const bytesToUnit = (bytes: number): string => {
  if (bytes < 0) return "";

  if (bytes >= 1024 ** 4) {
    return `${(bytes / (1024 ** 4)).toFixed(2)} TiB`;
  } else if (bytes >= 1024 ** 3) {
    return `${(bytes / (1024 ** 3)).toFixed(2)} GiB`;
  } else if (bytes >= 1024 ** 2) {
    return `${(bytes / (1024 ** 2)).toFixed(2)} MiB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KiB`;
  } else {
    return `${bytes} B`;
  }
};
