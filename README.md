# 🐍 Snake Pro

A single-file snake game for the browser. It has no dependencies and no build step: open `index.html` and play.

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
- **Secret level** 🌌: see the spoiler below.
- **5 snake skins**, including an animated rainbow skin.
- **15 achievements** (2 hidden) and lifetime stats.
- Smooth, interpolated movement at the display's refresh rate, with particles, screen shake, and sound effects synthesized with WebAudio.
- Keyboard, swipe, and on-screen D-pad controls, plus a 3-move input buffer so quick turns aren't dropped.
- Crisp rendering on HiDPI screens, a layout that works on phones, and auto-pause when you switch tabs.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Arrow keys / WASD | Swipe on the board or use the D-pad |
| Pause / resume | P, Space, Esc | ⏸ button |
| Start / replay | Enter | Buttons |
| Mute | M | 🔊 button |

<details>
<summary>⚠️ Spoiler: the secret level</summary>

- From level 4 onward, each level-up has a 40% chance to open a swirling 🌀 portal, and it's guaranteed at level 6. The portal appears at most once per game and closes after 10 seconds.
- Enter the portal to warp to a **starfield candy stage** for 20 seconds. The board is full of 🍬 🍭 🍩 🧁 and a rare 👑 crown worth 200 points. There's no poison and no energy drain, the edges wrap, and candy doesn't make you longer. Combos still count.
- When time runs out you return to your game with your rocks restored and 2 seconds of invulnerability.
- **Cheat code:** type ↑ ↑ ↓ ↓ ← → ← → B A on the main menu and the portal will open at level 2 in your next game.
- Two hidden achievements are tied to it.

</details>
