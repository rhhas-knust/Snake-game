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
- **5 snake skins**, including an animated rainbow skin.
- **13 achievements** and lifetime stats.
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
