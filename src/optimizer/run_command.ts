const decode = (array: Uint8Array) => new TextDecoder().decode(array);

export const runCommand = async (
  cmd: string[],
): Promise<{ message: string; code: number }> => {
  const process = Deno.run({ cmd, stdout: "piped" });
  const { success, code } = await process.status();

  process.close();

  if (!success) {
    throw { message: decode(await process.output()), code };
  }

  return {
    message: decode(await process.output()),
    code,
  };
};
