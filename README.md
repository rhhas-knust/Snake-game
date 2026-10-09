# 🐍 Snake Pro

A modern snake game for the browser that installs as an app and works offline. It has no dependencies and no build step.

**▶ Play:** <https://rhhas-knust.github.io/Snake-game/> · **Publishing to stores:** see [PUBLISHING.md](PUBLISHING.md)

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page layout and styles |
| `game.js` | All game code |
| `manifest.webmanifest`, `sw.js`, `icons/` | Make it installable (PWA) and playable offline |
| `privacy.html` | Privacy policy (required by app stores) |
| `og-image.png` | Preview image shown when the link is shared |
| `screenshots/` | Store listing screenshots |

To run it locally, serve the folder over HTTP (for example `python3 -m http.server`) and open <http://localhost:8000>. Opening `index.html` directly from disk also works, but offline mode needs HTTP.

## Features

- **4 game modes**
  - **Classic**: hitting a wall ends the game.
  - **Portal**: the snake wraps around the edges.
  - **Maze**: rock formations, with new rocks added every level.
  - **Zen**: edges wrap, and there's no energy drain and no poison.
- **4 difficulties**, each with its own saved best score per mode.
- **Levels**: every 5 fruits you level up and the snake speeds up.
- **Combo system**: eat fruit quickly one after another for up to x8 points.
- **Energy**: fruit restores energy, which drains over time.
- **Poison** (🥥 🥚): deadly, but each one disappears after a few seconds.
- **Golden star** 🌟: a rare, short-lived bonus worth 75 points.
- **Power-ups**: 🛡️ Shield, ⏳ Slow-mo, 💎 Double points, 🧲 Magnet, ✂️ Shrink.
- **Daily Challenge** 📅: every player in the world gets the same board, fruit order and spawn timing each day (UTC). The mode rotates between Classic, Portal and Maze on Medium difficulty, and your best score and attempts for the day are tracked.
- **Share score** 📤: the game-over screen builds a 1080×1920 score card (a snapshot of the board, your score and stats, and the game link) that fits TikTok, Instagram Stories and WhatsApp Status. On phones it opens the share sheet. On desktop it downloads the image and copies a caption. The TikTok handle printed on every card is set by `CREATOR_HANDLE` in `game.js`.
- **Secret level** 🌌: see the spoiler below.
- **5 snake skins**, including an animated rainbow skin.
- **15 achievements** (2 hidden) and lifetime stats.
- Smooth, interpolated movement at the display's refresh rate, with particles, screen shake, and sound effects synthesized with WebAudio.
- Keyboard and swipe controls, plus an optional on-screen arrow pad (🎮 button, off by default) and a 3-move input buffer so quick turns aren't dropped.
- **Phone-friendly layout**: the board is sized to fill the screen, menus scale to fit the board, the phone can be held sideways (board on the left, HUD on the right), there's a ⛶ fullscreen button where the browser supports it, and the page doesn't scroll while you swipe.
- Crisp rendering on HiDPI screens and auto-pause when you switch tabs.
- **Installable app (PWA)**: 📲 Install button (Android and desktop) or *Add to Home Screen* (iPhone). It gets its own icon, opens full screen and plays offline.

## Privacy & security

- No accounts, analytics, ads or tracking. Progress is saved only in the player's own browser. See [privacy.html](privacy.html).
- A Content Security Policy only allows the game's own files to run or be fetched.
- Saved data is validated on load. Every GitHub Pages project on the same account shares browser storage, so the game never trusts what it reads back.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Arrow keys / WASD | Swipe on the board (or turn on the 🎮 arrow pad) |
| Fullscreen | | ⛶ button (Android / desktop) |
| Pause / resume | P, Space, Esc | ⏸ button |
| Start / replay | Enter | Buttons |
| Share score (game-over screen) | S | 📤 Share button |
| Mute | M | 🔊 button |

<details>
<summary>⚠️ Spoiler: the secret level</summary>

- From level 4 onward, each level-up has a 40% chance to open a swirling 🌀 portal, and it's guaranteed at level 6. The portal appears at most once per game and closes after 10 seconds.
- Enter the portal to warp to a **starfield candy stage** for 20 seconds. The board is full of 🍬 🍭 🍩 🧁 and a rare 👑 crown worth 200 points. There's no poison and no energy drain, the edges wrap, and candy doesn't make you longer. Combos still count.
- When time runs out you return to your game with your rocks restored and 2 seconds of invulnerability.
- **Cheat code:** type ↑ ↑ ↓ ↓ ← → ← → B A on the main menu and the portal will open at level 2 in your next game.
- Two hidden achievements are tied to it.

</details>
