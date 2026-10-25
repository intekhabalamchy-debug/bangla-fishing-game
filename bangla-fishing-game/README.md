# 🐟 মৎস্য শিকারী (Bangla Pond & River Fisher)

> **Authentic Bangladeshi retro 16-bit pond, haor, and river fishing browser game.**  
> Cast your rod (*Borshi*), throw the traditional net (*Khep Jhal*), and wade through the mud with a bamboo basket (*Pollo*) across Bengal's iconic waters—accompanied by live procedural Bhatiyali folk music and Ektara tunes.

---

## 📖 Short Description (For GitHub Repository About Section)

**Option 1 (Recommended — Balanced & Punchy):**
> Authentic Bangladeshi retro 16-bit fishing browser game featuring traditional tools (Borshi, Khep Jhal, Pollo), 32+ native fish species, Padma Ilish, Sundarbans mangroves, and Web Audio Bhatiyali folk music. Built with Vanilla JS & Canvas.

**Option 2 (Short & Catchy):**
> Retro 16-bit Bengali pond & river fishing simulator with native fish, traditional gear, and procedural Bhatiyali folk tunes. Zero dependencies.

**Option 3 (Detailed with Lore):**
> মৎস্য শিকারী: An authentic Bengali fishing adventure across Village Pukur, Haor wetlands, Padma River, and Sundarbans. Cast rods, throw nets, trade catches in village markets, and unlock legendary river trophies.

### 🏷️ Suggested GitHub Topics / Tags
`javascript` • `html5-canvas` • `browser-game` • `retro-game` • `pixel-art` • `web-audio-api` • `bangladesh` • `fishing-game` • `procedural-generation` • `game-development`

---

## 🌟 Key Features

- **🎣 3 Traditional Bengali Fishing Tools:**
  - **ছিপ (Borshi Rod):** Interactive cast power charging, dynamic line tension gauge, and fish stamina battle mini-game.
  - **খেপ জাল (Khep Jhal Cast Net):** Aim anywhere with keyboard/mouse and fling a weighted circular net to harvest multiple fish in one throw.
  - **পলো (Bamboo Pollo Basket):** Wade right into the murky shallows of the Haor and slam the bamboo trap over mud bubbles to grab fish by hand.

- **🗺️ 4 Authentic Bengali Aquatic Ecosystems:**
  - **গ্রামের পুকুর (Village Pukur):** Tranquil pond lined with coconut palms and blooming Shapla (water lilies).
  - **হাওড় ও বিল (Haor & Beel Wetlands):** Muddy marshlands teeming with bottom-dwelling predators (Shol, Gozar, Magur, Shing).
  - **পদ্মা নদীর ঘাট (Padma River Ghat):** Mighty deep-water currents, wooden dinghi boats, and the prized silver **Ilish (Hilsa)**.
  - **সুন্দরবনের খাঁড়ি (Sundarbans Mangrove Creek):** Brackish tidal creeks among breathing roots with Bhetki/Koral, Rupchanda, and Bagda shrimp.

- **📻 Web Audio Bhatiyali Folk Radio & Ektara:**
  - 100% procedurally synthesized traditional Bengali melodies without heavy MP3 files.
  - Songs include *মন মাঝি তোর বৈঠা*, *মাঝি বাইয়া যাও*, *সোহাগ চাঁদ বদনী*, and *নদীয়া একতারা*.

- **🐬 Dynamic River Lore & Encounters:**
  - **পদ্মার শুশুক (Gangetic River Dolphin):** Leaps gracefully across the river, granting a 2-minute **+50% bite blessing** and heightened chances of catching mythical giants like the *Sworna Boal* (Golden Sheatfish) and *Prachin Kachhim* (Ancient Softshell Turtle).
  - **সুন্দরবনের বাঘের গর্জন (Royal Bengal Tiger):** Deep roars echo through the night, shaking the screen and revealing glowing eyes in the dense jungle.
  - **পোষা ভোঁদড় (Trained Fishing Otter):** Glides through the water driving fish schools toward your nets.

- **🏪 Economic Loop & Gear Shop:**
  - Trade fresh catches at the **Village Fish Market (মাছের আড়ৎ)** for Bangladeshi Taka (৳).
  - Upgrade bamboo rods to high-tensile carbon fiber, expand cast nets, and buy a wooden **Dinghi Boat (ডিঙি নৌকা)**.
  - Buy specialized baits: Earthworms (কেঁচো), Flour dough (আটা), Ant eggs (পিঁপড়ার ডিম), River shrimp (চিংড়ি), and Fermented paste (পচা টোপ).

- **🏆 Fish Encyclopedia & Achievements:**
  - Full compendium of 30+ native species with scientific and Bengali trivia.
  - 9 unlockable honorary titles (e.g. *পদ্মার ইলিশ রাজ*, *হাওড়ের পলো সর্দার*, *নদী রক্ষক*).

- **📱 Fully Responsive & Cross-Platform:**
  - Smooth 60 FPS Canvas rendering on both desktop and mobile.
  - Optional virtual on-screen D-Pad and Action button for touchscreens.
  - Automatic progress saving via `localStorage`.

---

## ⌨️ Controls

| Action | Desktop Controls | Mobile / Touch Controls |
| :--- | :--- | :--- |
| **Cast / Hook / Reel / Throw Net / Grab** | `Spacebar` or `Left Click` | Dynamic Action Button (`🔘`) |
| **Aim Net / Wade in Mud** | `W`, `A`, `S`, `D` or `Arrow Keys` | Virtual D-Pad (`▲` `▼` `◀` `▶`) |
| **Switch to Rod (Borshi)** | `1` | Tap Tool Dock 🎣 |
| **Switch to Net (Khep Jhal)** | `2` | Tap Tool Dock 🕸️ |
| **Switch to Basket (Pollo)** | `3` | Tap Tool Dock 🧺 |
| **Village Fish Market** | `M` | Tap `মাছের আড়ৎ` Header Button |
| **Fish Encyclopedia** | `E` | Tap `এনসাইক্লোপিডিয়া` Header Button |
| **Gear & Upgrades Shop** | `G` | Tap `সরঞ্জাম` Header Button |
| **Achievements & Titles** | `T` | Tap `অর্জন` Header Button |
| **Change Folk Radio Song** | `R` | Tap Radio Station Button |
| **Pause Game** | `P` or `Esc` | Tap `বিরতি` Header Button |
| **Help Guide** | `H` or `?` | Tap `নির্দেশিকা` Header Button |

---

## 🚀 Quick Start / Local Setup

This project uses **zero build tools or dependencies**—pure HTML5, CSS3, and modern ES6 JavaScript modules.

### Option 1: Using the built-in Node.js server
```bash
# Clone the repository
git clone https://github.com/intekhab/bangla-fishing-game.git

# Enter project directory
cd bangla-fishing-game

# Start lightweight local server
node server.js
```
Open **`http://localhost:3000`** in any web browser.

### Option 2: Using Python
```bash
python -m http.server 3000
```

### Option 3: Direct VS Code Live Server
Right-click `index.html` and click **"Open with Live Server"**.

---

## 🛠️ Tech Stack & Architecture

- **Engine:** Vanilla JavaScript (ES Modules, RequestAnimationFrame gameloop)
- **Graphics Pipeline:** HTML5 2D Canvas with procedural pixel/sprite rendering
- **Audio:** Web Audio API (real-time synthesized folk instruments, flute, and Ektara)
- **Styling:** Vanilla CSS with glassmorphism, responsive flex/grid layouts
- **State Management:** Custom event orchestrator with persistent `localStorage`

---

## 👨‍💻 Author

**Intekhab Alam Chowdhury**  
*Full-Stack Software Engineer • Chittagong, Bangladesh*

- 🌐 **Portfolio:** [Intekhab.dev](https://intekhab.dev)
- 💻 **GitHub:** [@intekhab](https://github.com/intekhab)
- ✉️ **Contact:** intekhab@gmail.com

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
