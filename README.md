# 🐍 Snake Pro

A modern snake game for the browser that installs as an app and works offline. It has no dependencies and no build step.

**▶ Play:** <https://rhhas-knust.github.io/Snake-game/> · **Publishing to stores:** [PUBLISHING.md](PUBLISHING.md) · **Challenge submission kit:** [SUBMISSION.md](SUBMISSION.md)

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
- **Daily Challenge** 📅: every player in the world gets the same sequence of fruit, poison, power-ups and spawn times each day (UTC). Each item has its own seeded random stream, so the sequence stays identical however differently people play (an item only moves if its square is under your snake). The mode rotates between Classic, Portal and Maze on Medium difficulty, and your best score and attempts for the day are tracked.
- **Share score** 📤: the game-over screen builds a 1080×1920 score card (a snapshot of the board, your score and stats, and the game link) that fits TikTok, Instagram Stories and WhatsApp Status. On phones it opens the share sheet. On desktop it downloads the image and copies a caption. The TikTok handle printed on every card is set by `CREATOR_HANDLE` in `game.js`.
- **Secret level** 🌌: see the spoiler below.
- **5 snake skins**, including an animated rainbow skin.
- **15 achievements** (2 hidden) and lifetime stats.
- Smooth, interpolated movement at the display's refresh rate, with particles, screen shake, and sound effects synthesized with WebAudio.
- **Controls (🎮 button):** 👆 swipe (default), 🎮 on-screen arrow buttons, or 📱 **tilt steering** using the phone's motion sensor. Swipe always works alongside the other two, and the keyboard always works on a computer. A 3-move input buffer means quick turns aren't dropped.
- **Steady tilt steering:** readings are smoothed and there's a dead zone, so hand wobble never turns the snake. A turn needs one direction to clearly win (no flicker on diagonals) and you have to ease back before the same turn fires again. Centre is set from how you hold the phone during the 3-2-1, there are three sensitivity levels and a 🎯 Recenter button, and the screen stays awake while you tilt.
- **Clean home page:** help (❓, with Basics / Items / Modes tabs) and controls (🎮) open as pop-up panels from the top bar instead of filling the page.
- **Phone-friendly layout**: the board is sized to fill the screen, menus scale to fit the board, the phone can be held sideways (board on the left, HUD on the right), there's a ⛶ fullscreen button (in the 🎮 panel) where the browser supports it, and the page doesn't scroll while you swipe.
- Crisp rendering on HiDPI screens and auto-pause when you switch tabs.
- **Accessible**: screen-reader announcements for game start, level-ups, the secret level and game over; menus are proper dialogs that move keyboard focus to their main button; the system *reduce motion* setting turns off screen shake, flashing and blinking.
- **Installable app (PWA)**: 📲 Install button (Android and desktop) or *Add to Home Screen* (iPhone). It gets its own icon, opens full screen and plays offline.

## Privacy & security

- No accounts, analytics, ads or tracking. Progress is saved only in the player's own browser. See [privacy.html](privacy.html).
- A Content Security Policy only allows the game's own files to run or be fetched.
- Saved data is validated on load. Every GitHub Pages project on the same account shares browser storage, so the game never trusts what it reads back.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Arrow keys / WASD | Swipe on the board, or pick 🎮 Arrow buttons / 📱 Tilt |
| How to play | | ❓ button |
| Fullscreen | | 🎮 panel → ⛶ (Android / desktop) |
| Pause / resume | P, Space, Esc | ⏸ button |
| Start / replay | Enter | Buttons |
| Share score (game-over screen) | S | 📤 Share button |
| Mute | M | 🔊 button |

<details>
<summary>⚠️ Spoiler: the secret level</summary>

- From level 4 onward, each level-up has a 40% chance to open a swirling 🌀 portal, and it's guaranteed at level 6. The portal appears at most once per game and closes after 10 seconds.
- Enter the portal to warp to a **starfield candy stage** for 20 seconds. The board is full of 🍬 🍭 🍩 🧁 and a rare 👑 crown worth 100 points. Candy is worth a flat 10–20 points (no combo or x2 multipliers), so the stage is a bonus rather than a jackpot. There's no poison and no energy drain, the edges wrap, and candy doesn't make you longer.
- When time runs out you return to your game with your rocks restored and 2 seconds of invulnerability.
- **Cheat code:** type ↑ ↑ ↓ ↓ ← → ← → B A on the main menu and the portal will open at level 2 in your next game.
- Two hidden achievements are tied to it.

</details>
