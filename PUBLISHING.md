# Publishing Snake Pro

Snake Pro is a **Progressive Web App (PWA)**: one set of HTML/JS files that runs in any browser, installs on phones and computers, works offline, and can be packaged for app stores. Everything below works from the live site at **https://rhhas-knust.github.io/Snake-game/**.

> Store rules and fees change. Check each store's sign-up page before you start.

---

## 1. Install on your phone (free, works now)

- **Android (Chrome / Edge / Samsung Internet):** open the site and tap **📲 Install app** on the menu, or use the browser menu → *Install app* / *Add to Home screen*.
- **iPhone / iPad (Safari):** tap **Share ⬆️ → Add to Home Screen**. The 📲 button shows the same hint.
- **Windows / Mac (Chrome or Edge):** click the install icon in the address bar.

Once installed, the game opens full screen with its own icon and **plays offline**.

---

## 2. Microsoft Store (Windows)

Microsoft lets **individual developers register for free** (they removed the old fee in 2025). You'll need to verify your identity.

1. **Create a developer account:** go to <https://storedeveloper.microsoft.com> and sign up as an *Individual*.
2. **Reserve the app name:** in [Partner Center](https://partner.microsoft.com/dashboard), go to *Apps and games → New product → MSIX or PWA app* and reserve **Snake Pro** (or a variant if it's taken).
3. Open the app's **Product identity** page and copy three values: **Package ID**, **Publisher ID** and **Publisher display name**.
4. **Package the game:**
   - Go to <https://www.pwabuilder.com> and enter `https://rhhas-knust.github.io/Snake-game/`.
   - Fix anything it flags, then choose **Package for stores → Windows**.
   - Paste in the three values from Partner Center and download the package (a `.zip` containing `.msixbundle` files).
5. **Submit in Partner Center:**
   - **Packages:** upload the `.msixbundle`.
   - **Store listing:** add a description and the screenshots from [`screenshots/`](screenshots/). Use `desktop-1.png` for Windows.
   - **Privacy policy URL:** `https://rhhas-knust.github.io/Snake-game/privacy.html`
   - **Age ratings:** answer the questionnaire. Snake Pro has no violence, chat, ads or purchases, so it should rate *Everyone / 3+*.
   - **Pricing:** Free.
6. **Submit.** Certification usually takes a few business days.

Store description you can paste:

> Snake Pro is a modern take on the classic snake game. Choose from 4 modes (Classic, Portal, Maze and Zen) and 4 difficulties. Chain fruit for combos up to x8, grab power-ups like Shield, Slow-mo, Magnet and Double Points, and take on the Daily Challenge, where everyone plays the same board each day. Share your score card with friends, unlock 15 achievements, and see if you can find the secret level… No ads, no accounts, no data collected. Works offline.

---

## 3. Free web game portals (no app packaging needed)

These host the game directly. Upload a `.zip` of the game files with `index.html` at the top level of the zip. The files to include are `index.html`, `game.js`, `sw.js`, `manifest.webmanifest`, `privacy.html` and the `icons/` folder.

| Site | Cost | Notes |
| --- | --- | --- |
| [itch.io](https://itch.io/game/new) | Free | Set *Kind of project* to **HTML** and tick *Mobile friendly*. Set the viewport to around 520×900. This is the biggest indie game community. |
| [Newgrounds](https://www.newgrounds.com/projects/games) | Free | Long-running community with an active audience for HTML5 games. |
| [Game Jolt](https://gamejolt.com) | Free | Indie game community with HTML game support. |
| [CrazyGames](https://developer.crazygames.com) | Free to submit | Large audience. They review games and may ask you to add their SDK. |

---

## 4. Android app stores (later)

PWABuilder can also package the game as an Android app: choose *Package for stores → Android*. It creates a "Trusted Web Activity" app.

- **Samsung Galaxy Store:** seller registration is free.
- **Google Play:** costs a one-time **$25** registration fee.
- To get rid of the browser address bar inside the Android app, the site needs a `/.well-known/assetlinks.json` file at the **domain root**. On GitHub Pages that means hosting the game at `rhhas-knust.github.io` itself (a repo named `rhhas-knust.github.io`) or on a custom domain. PWABuilder generates the file for you.

## 5. Apple App Store (later)

Apple charges **$99/year** and requires a Mac to build. In the meantime, iPhone players can use *Add to Home Screen*, which works well.

---

## Before every store update

- Bump `CACHE` in `sw.js` (for example `snakepro-v1` → `snakepro-v2`) so installed copies pick up new files promptly.
- If gameplay changed, retake the screenshots in `screenshots/`.
