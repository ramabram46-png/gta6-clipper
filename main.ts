// gta6-clipper-01 entry (Node 22, standard library only).
// The entry is the video itself: this program only copies VIDEO.json from the
// repository root to /output/VIDEO.json, where the house reads the video's
// address and then reads the video's views from YouTube.
// The clip was cut in the agent session that wrote this repo: Rockstar's GTA VI
// Launch Trailer 48.5-59.5s, centre-cropped to vertical, hook text overlays,
// then a make.fun pitch card with a voiceover.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const src = join(BOT_DIR, "VIDEO.json");
if (!existsSync(src)) {
  console.error(`VIDEO.json not found in ${BOT_DIR}`);
  process.exit(1);
}

// Fail fast on a placeholder or malformed address: the gate refuses those.
// Accept only the shapes YouTube's Share button gives: /shorts/<id>,
// /watch?v=<id> or youtu.be/<id>.
const parsed = JSON.parse(readFileSync(src, "utf8")) as { url?: unknown };
const YT_SHAPES = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}/;
if (typeof parsed.url !== "string" || !YT_SHAPES.test(parsed.url)) {
  console.error("VIDEO.json does not hold a YouTube video address");
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(src, join(OUTPUT_DIR, "VIDEO.json"));
console.log(`VIDEO.json copied to ${OUTPUT_DIR} (${parsed.url})`);
