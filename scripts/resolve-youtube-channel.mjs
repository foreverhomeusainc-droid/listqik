const handle = process.argv[2] ?? "ListQuick";
const res = await fetch(`https://www.youtube.com/@${handle}`, {
  headers: { "User-Agent": "Mozilla/5.0" },
});
const html = await res.text();
const patterns = [
  /"channelId":"(UC[\w-]{22})"/,
  /"externalId":"(UC[\w-]{22})"/,
  /"browseId":"(UC[\w-]{22})"/,
  /channel_id=(UC[\w-]{22})/,
];
for (const p of patterns) {
  const m = html.match(p);
  if (m) {
    console.log(m[1]);
    process.exit(0);
  }
}
console.error("channel id not found");
process.exit(1);
