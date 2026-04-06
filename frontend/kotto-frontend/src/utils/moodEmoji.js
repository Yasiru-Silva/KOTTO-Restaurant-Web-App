const MOOD_EMOJI = {
  relaxed: "😌",
  hungry: "😋",
  "in a hurry": "⏱️",
  "inahurry": "⏱️",
  budget: "💰",
  celebratory: "🎉",
  comfort: "🤗",
  spicy: "🌶️",
  sweet: "🍯",
};

function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** Emoji for a mood label; unknown moods get a friendly default */
export function moodEmoji(name) {
  const raw = String(name || "").trim().toLowerCase();
  if (MOOD_EMOJI[raw]) return MOOD_EMOJI[raw];
  const key = normalizeKey(name);
  if (MOOD_EMOJI[key]) return MOOD_EMOJI[key];
  for (const [k, emoji] of Object.entries(MOOD_EMOJI)) {
    if (normalizeKey(k) === key) return emoji;
  }
  return "✨";
}
