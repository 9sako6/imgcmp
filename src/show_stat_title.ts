import { statMessage } from "./stat/message.ts";

async function show_stat_title() {
  const [exportPath] = Deno.args;
  const message = await statMessage(exportPath);
  console.log(message.split("\n")[0]);
}

(async () => {
  await show_stat_title();
})();
