// Master Game Orchestrator & State Manager for Bangla Fishing Game
import { LOCATIONS, BAITS, FISH_SPECIES, GEAR_UPGRADES, ACHIEVEMENTS } from './fishData.js';
import { sound } from './audio.js';
import { ParticleSystem } from './particles.js';
import { GameRenderer } from './renderer.js';
import { MinigameController } from './minigames.js';
import { getFishSpriteDataUrl } from './fishSprites.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.particles = new ParticleSystem();
    this.renderer = new GameRenderer(this.canvas);
    this.minigames = new MinigameController(this);

    // Saveable Game State
    this.state = {
      taka: 150, // Starting currency
      location: LOCATIONS.PUKUR,
      weather: 'clear', // 'clear', 'rain', 'monsoon'
      currentTool: 'borshi', // 'borshi', 'jhal', 'pollo'
      selectedBait: 'kecho',
      baitInventory: {
        kecho: 12,
        atta: 8,
        piprar_dim: 0,
        chingri: 0,
        pocha_top: 0
      },
      upgrades: {
        rod: 'rod_1',
        line: 'line_1',
        net: 'net_1',
        pollo: 'pollo_1',
        boatUnlocked: false
      },
      inventory: [], // Caught fish pending sale
      album: {}, // Species ID -> { count, maxWeight }
      activeFish: [],

      // Minigame States
      borshi: {
        state: 'idle', // idle, charging, in_flight, cast, nibble, fighting
        charge: 0,
        chargeDir: 1,
        bobberX: 300,
        bobberY: 360,
        tension: 0.5,
        sweetZone: 0.5,
        sweetZoneWidth: 0.28,
        fishStamina: 100,
        fishMaxStamina: 100,
        hookedFish: null
      },
      jhal: {
        state: 'idle', // idle, aiming, throwing
        targetX: 520,
        targetY: 340,
        radius: 10,
        maxRadius: 65,
        power: 0.2
      },
      pollo: {
        state: 'wading', // wading, trapped
        playerX: 420,
        playerY: 330,
        targetX: 420,
        targetY: 350,
        trappedFish: null
      },

      // Gangetic River Dolphin & River Secret Buffs (পদ্মার শুশুক)
      dolphin: {
        active: false,
        progress: 0,
        startX: 280,
        endX: 640,
        waterY: 275,
        jumpHeight: 65,
        cooldown: 25, // First dolphin sighting in 25s in Padma or Sundarbans
        splashedIn: false,
        splashedOut: false,
        isLeftToRight: true
      },
      dolphinBuffTimer: 0,

      // Achievements & Titles (মৎস্য শিকারী অর্জন)
      stats: {
        catchesTotal: 0,
        catchesByLocation: { pukur: 0, haor: 0, padma: 0, sundarbans: 0 },
        polloCatches: 0,
        dolphinBlessings: 0,
        junkCleared: 0
      },
      unlockedAchievements: [],
      equippedTitle: 'গ্রামের শিকারী (Village Angler)',

      // Sundarbans Encounters: Fishing Otter & Bengal Tiger Roar
      otter: {
        active: false,
        x: -50,
        y: 310,
        vx: 1.5,
        cooldown: 35, // First otter appears in 35s in Sundarbans
        hasFish: false
      },
      tigerEyes: {
        active: false,
        timer: 0,
        cooldown: 65 // First roar in 65s in Sundarbans
      }
    };

    this.isReeling = false;
    this.isPaused = false;
    this.keys = {};
    this.lastTime = performance.now();

    this.loadState();
    this.initFishPool();
    this.bindInputs();
    this.bindUi();
    this.setupWeatherCycle();
    this.updateHud();

    // Start Main Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  // ==========================================
  // Simulation & Spawning
  // ==========================================
  initFishPool() {
    this.state.activeFish = [];
    const pool = this.state.location.fishPool;
    const fishCount = 7 + Math.floor(Math.random() * 4);

    for (let i = 0; i < fishCount; i++) {
      this.spawnFish(pool);
    }
  }

  spawnFish(pool = this.state.location.fishPool) {
    const speciesId = pool[Math.floor(Math.random() * pool.length)];
    const species = FISH_SPECIES.find((f) => f.id === speciesId) || FISH_SPECIES[0];

    const isLeft = Math.random() > 0.5;
    this.state.activeFish.push({
      species,
      x: isLeft ? -50 : this.width + 50,
      y: this.height * (0.48 + Math.random() * 0.42),
      vx: (isLeft ? 1 : -1) * (0.5 + Math.random() * 0.8),
      size: 16 + (species.minWeight / species.maxWeight) * 14 + Math.random() * 8,
      depth: Math.random(),
      angle: isLeft ? 0 : Math.PI,
      phase: Math.random() * Math.PI * 2,
      active: true
    });
  }

  updateFish(dt) {
    const list = this.state.activeFish;
    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i];
      f.phase += 0.08 * dt;
      f.x += f.vx * dt;
      f.y += Math.sin(f.phase * 0.5) * 0.3 * dt;

      // Wrap or turn
      if (f.vx > 0 && f.x > this.width + 60) {
        f.vx *= -1;
        f.angle = Math.PI;
      } else if (f.vx < 0 && f.x < -60) {
        f.vx *= -1;
        f.angle = 0;
      }

      // Occasional bubble
      if (Math.random() < 0.003) {
        this.particles.addBubble(f.x, f.y);
      }
    }

    // Maintain pool size
    if (list.length < 6) {
      this.spawnFish();
    }
  }

  pickFishForHook() {
    const pool = this.state.location.fishPool;
    const bait = this.getSelectedBait();

    // Dolphin's Blessing (+50% bite speed and heightened chance for river secrets / rare giants)
    if (this.state.dolphinBuffTimer > 0 && Math.random() < 0.40) {
      const rareSecrets = pool.filter((id) => {
        const sp = FISH_SPECIES.find((f) => f.id === id);
        return sp && (sp.rarityClass === 'legendary' || sp.rarityClass === 'epic' || sp.rarityClass === 'rare');
      });
      if (rareSecrets.length > 0) {
        const picked = rareSecrets[Math.floor(Math.random() * rareSecrets.length)];
        return FISH_SPECIES.find((f) => f.id === picked) || FISH_SPECIES[0];
      }
    }

    // Bait bias
    let candidates = pool;
    if (bait && bait.preferredBy) {
      const preferred = pool.filter((id) => bait.preferredBy.includes(id));
      if (preferred.length > 0 && Math.random() < 0.65) {
        candidates = preferred;
      }
    }

    const speciesId = candidates[Math.floor(Math.random() * candidates.length)];
    return FISH_SPECIES.find((f) => f.id === speciesId) || FISH_SPECIES[0];
  }

  pickMudFish() {
    const mudPool = ['magur', 'shing', 'taki', 'shol', 'boal', 'kakra', 'tara_baim', 'gozar'];
    const available = mudPool.filter((id) => this.state.location.fishPool.includes(id));
    const speciesId = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : 'taki';
    return FISH_SPECIES.find((f) => f.id === speciesId);
  }

  // ==========================================
  // Gear Helpers
  // ==========================================
  getRodPower() {
    const rod = GEAR_UPGRADES.rods.find((r) => r.id === this.state.upgrades.rod);
    return rod ? rod.power : 1.0;
  }

  getRodSweetSpot() {
    const rod = GEAR_UPGRADES.rods.find((r) => r.id === this.state.upgrades.rod);
    return rod ? rod.sweetSpot : 0.28;
  }

  getNetRadius() {
    const net = GEAR_UPGRADES.nets.find((n) => n.id === this.state.upgrades.net);
    return net ? net.radius : 65;
  }

  getSelectedBait() {
    return BAITS[this.state.selectedBait] || BAITS.kecho;
  }

  consumeBait() {
    const baitId = this.state.selectedBait;
    if (this.state.baitInventory[baitId] > 0) {
      this.state.baitInventory[baitId]--;
      this.updateHud();
      this.saveState();
    }
  }

  // ==========================================
  // Catch & Economy Handlers
  // ==========================================
  onCatchFish(species) {
    this.consumeBait();
    const weight = +(
      species.minWeight +
      Math.random() * (species.maxWeight - species.minWeight)
    ).toFixed(2);

    // Dynamic price calculation
    let priceMultiplier = 1.0;
    if (this.state.weather === 'rain' && species.id === 'ilish') priceMultiplier = 1.45; // Ilish bonus in rain
    if (this.renderer.getTimeName().isNight && (species.id === 'boal' || species.id === 'magur')) priceMultiplier = 1.3;

    const baseVal = Math.round(species.basePriceKg * weight * priceMultiplier);
    const finalVal = species.basePriceKg === 0 ? 0 : Math.max(10, baseVal);

    const catchItem = {
      id: `${species.id}_${Date.now()}`,
      speciesId: species.id,
      name: species.name,
      nameBn: species.nameBn,
      scientific: species.scientific,
      rarity: species.rarity,
      rarityClass: species.rarityClass,
      weight,
      value: finalVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.inventory.push(catchItem);

    // Update Encyclopedia Album
    if (!this.state.album[species.id]) {
      this.state.album[species.id] = { count: 0, maxWeight: 0 };
    }
    this.state.album[species.id].count++;
    if (weight > this.state.album[species.id].maxWeight) {
      this.state.album[species.id].maxWeight = weight;
    }

    sound.playCatchFanfare(species.rarityClass);
    const floatColor = species.rarityClass === 'junk' ? '#94a3b8' : '#fef08a';
    this.particles.addFloatingText(`+${species.nameBn} (${weight} kg)`, this.width * 0.45, this.height * 0.45, floatColor);

    // Track statistics for achievements
    this.state.stats.catchesTotal = (this.state.stats.catchesTotal || 0) + 1;
    const locId = this.state.location.id;
    this.state.stats.catchesByLocation[locId] = (this.state.stats.catchesByLocation[locId] || 0) + 1;
    if (this.state.currentTool === 'pollo') {
      this.state.stats.polloCatches = (this.state.stats.polloCatches || 0) + 1;
    }
    if (species.rarityClass === 'junk') {
      this.state.stats.junkCleared = (this.state.stats.junkCleared || 0) + 1;
    }
    this.checkAchievements();

    this.showCatchModal(catchItem);
    this.updateHud();
    this.saveState();
  }

  onCatchMultipleFish(speciesList) {
    let summaryText = [];
    speciesList.forEach((species) => {
      const weight = +(
        species.minWeight +
        Math.random() * (species.maxWeight - species.minWeight) * 0.75
      ).toFixed(2);
      const val = species.basePriceKg === 0 ? 0 : Math.max(10, Math.round(species.basePriceKg * weight));

      const catchItem = {
        id: `${species.id}_${Date.now()}_${Math.random()}`,
        speciesId: species.id,
        name: species.name,
        nameBn: species.nameBn,
        scientific: species.scientific,
        rarity: species.rarity,
        rarityClass: species.rarityClass,
        weight,
        value: val,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.state.inventory.push(catchItem);

      if (!this.state.album[species.id]) {
        this.state.album[species.id] = { count: 0, maxWeight: 0 };
      }
      this.state.album[species.id].count++;
      if (weight > this.state.album[species.id].maxWeight) {
        this.state.album[species.id].maxWeight = weight;
      }
      summaryText.push(`${species.nameBn} (${weight}kg)`);
    });

    // Track multi-catch statistics
    this.state.stats.catchesTotal = (this.state.stats.catchesTotal || 0) + speciesList.length;
    const locId = this.state.location.id;
    this.state.stats.catchesByLocation[locId] = (this.state.stats.catchesByLocation[locId] || 0) + speciesList.length;
    speciesList.forEach((sp) => {
      if (sp.rarityClass === 'junk') this.state.stats.junkCleared = (this.state.stats.junkCleared || 0) + 1;
    });
    this.checkAchievements();

    sound.playCatchFanfare('rare');
    this.showToast(`জালে ধরা পড়ল: ${summaryText.join(', ')}!`, 'success');
    this.updateHud();
    this.saveState();
  }

  sellCatch(itemIndex) {
    const item = this.state.inventory[itemIndex];
    if (!item) return;

    this.state.taka += item.value;
    this.state.inventory.splice(itemIndex, 1);
    sound.playCoinSound();
    this.particles.addFloatingText(`+৳ ${item.value}`, this.width * 0.5, 80, '#22c55e');
    this.updateHud();
    this.renderMarketModal();
    this.saveState();
  }

  sellAllCatches() {
    if (this.state.inventory.length === 0) return;
    let total = 0;
    this.state.inventory.forEach((i) => (total += i.value));
    this.state.taka += total;
    this.state.inventory = [];
    sound.playCoinSound();
    this.showToast(`সব মাছ বিক্রি সম্পন্ন! মোট আয়: ৳ ${total}`, 'success');
    this.updateHud();
    this.renderMarketModal();
    this.saveState();
  }

  // ==========================================
  // Weather & Time Cycles
  // ==========================================
  setupWeatherCycle() {
    setInterval(() => {
      // Dynamic weather shifting
      const rand = Math.random();
      if (rand < 0.22) {
        this.state.weather = 'monsoon';
        sound.setWeatherAmbience('monsoon');
        this.showToast('মেঘ ডেকে উঠল! পদ্মা ও হাওড়ে বর্ষা নামল (Monsoon Thunderstorm!)');
      } else if (rand < 0.45) {
        this.state.weather = 'rain';
        sound.setWeatherAmbience('rain');
      } else {
        this.state.weather = 'clear';
        sound.setWeatherAmbience('clear');
      }
      this.updateHud();
    }, 45000);

    // Random lightning flash during monsoon
    setInterval(() => {
      if (this.state.weather === 'monsoon' && Math.random() < 0.3) {
        this.renderer.triggerLightning();
      }
    }, 6000);
  }

  // ==========================================
  // Game Loop
  // ==========================================
  loop(currentTime) {
    if (this.isPaused) {
      this.lastTime = currentTime;
      requestAnimationFrame((t) => this.loop(t));
      return;
    }

    const dt = Math.min((currentTime - this.lastTime) / 16.66, 2.5);
    this.lastTime = currentTime;

    // Time cycle progression
    this.renderer.updateTime(dt);

    // Update Particles
    const isNight = this.renderer.getTimeName().isNight;
    const isRaining = this.state.weather === 'rain' || this.state.weather === 'monsoon';
    this.particles.update(this.width, this.height, isRaining, isNight);

    // Update Swimming Fish
    this.updateFish(dt);

    // Update Gangetic River Dolphin Event
    this.updateDolphin(dt);

    // Update Sundarbans Encounters (Fishing Otter & Bengal Tiger Roar)
    this.updateSundarbansEncounters(dt);

    // Update Active Tool Minigame Physics
    if (this.state.currentTool === 'borshi') {
      const { borshi } = this.state;
      if (borshi.state === 'charging') {
        borshi.charge += 0.02 * borshi.chargeDir;
        if (borshi.charge >= 1.0) borshi.chargeDir = -1;
        if (borshi.charge <= 0.05) borshi.chargeDir = 1;
      } else if (borshi.state === 'fighting') {
        this.minigames.updateBorshiFight(dt, this.isReeling);
      }
    } else if (this.state.currentTool === 'jhal') {
      // Net aiming reticle controls
      if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.state.jhal.targetX = Math.max(160, this.state.jhal.targetX - 3.5 * dt);
      if (this.keys['ArrowRight'] || this.keys['KeyD']) this.state.jhal.targetX = Math.min(this.width - 100, this.state.jhal.targetX + 3.5 * dt);
      if (this.keys['ArrowUp'] || this.keys['KeyW']) this.state.jhal.targetY = Math.max(260, this.state.jhal.targetY - 2.5 * dt);
      if (this.keys['ArrowDown'] || this.keys['KeyS']) this.state.jhal.targetY = Math.min(this.height - 60, this.state.jhal.targetY + 2.5 * dt);
    } else if (this.state.currentTool === 'pollo') {
      // Mud wading movement controls
      if (this.state.pollo.state === 'wading') {
        let moved = false;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
          this.state.pollo.playerX = Math.max(120, this.state.pollo.playerX - 2.5 * dt);
          moved = true;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
          this.state.pollo.playerX = Math.min(this.width - 120, this.state.pollo.playerX + 2.5 * dt);
          moved = true;
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
          this.state.pollo.playerY = Math.max(260, this.state.pollo.playerY - 2.0 * dt);
          moved = true;
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
          this.state.pollo.playerY = Math.min(this.height - 80, this.state.pollo.playerY + 2.0 * dt);
          moved = true;
        }

        if (moved && Math.random() < 0.15) {
          this.particles.addMudCloud(this.state.pollo.playerX, this.state.pollo.playerY + 45, 12);
        }
      }
    }

    // Render Canvas Scene
    this.renderer.render(this.state, this.particles);

    // Update Minigame Real-Time Overlays (Tension bar, Power gauges)
    this.renderMinigameOverlays();

    requestAnimationFrame((t) => this.loop(t));
  }

  // ==========================================
  // Gangetic River Dolphin Event (পদ্মার শুশুক ও নদী রহস্য)
  // ==========================================
  updateDolphin(dt) {
    const locId = this.state.location.id;
    const isRiverOrCreek = locId === 'padma' || locId === 'sundarbans';

    // Dolphin only visits open Padma currents and Sundarbans mangrove channels
    if (!isRiverOrCreek) {
      if (this.state.dolphin.active) this.state.dolphin.active = false;
      return;
    }

    if (this.state.dolphin.active) {
      this.state.dolphin.progress += 0.007 * dt;

      // Water entry splash (start of arc)
      if (this.state.dolphin.progress >= 0.08 && this.state.dolphin.progress <= 0.14 && !this.state.dolphin.splashedIn) {
        this.state.dolphin.splashedIn = true;
        this.particles.addSplash(this.state.dolphin.startX, this.state.dolphin.waterY, 15);
        this.particles.addRipple(this.state.dolphin.startX, this.state.dolphin.waterY, 35);
        sound.playSplash(true);
      }

      // Water re-entry splash (end of arc)
      if (this.state.dolphin.progress >= 0.88 && this.state.dolphin.progress <= 0.95 && !this.state.dolphin.splashedOut) {
        this.state.dolphin.splashedOut = true;
        this.particles.addSplash(this.state.dolphin.endX, this.state.dolphin.waterY, 16);
        this.particles.addRipple(this.state.dolphin.endX, this.state.dolphin.waterY, 40);
        sound.playSplash(true);
      }

      // Blowhole water mist vapor at apex
      if (this.state.dolphin.progress >= 0.42 && this.state.dolphin.progress <= 0.58 && Math.random() < 0.35) {
        const curX = this.state.dolphin.startX + (this.state.dolphin.endX - this.state.dolphin.startX) * this.state.dolphin.progress;
        const curY = this.state.dolphin.waterY - Math.sin(this.state.dolphin.progress * Math.PI) * this.state.dolphin.jumpHeight - 12;
        this.particles.addBubble(curX, curY);
      }

      if (this.state.dolphin.progress >= 1.0) {
        this.state.dolphin.active = false;
        this.state.dolphin.cooldown = 50 + Math.random() * 45; // Next jump in 50-95s
      }
    } else {
      // Cooldown timer progression
      this.state.dolphin.cooldown -= (1 / 60) * dt;
      if (this.state.dolphin.cooldown <= 0) {
        this.triggerDolphinSurfacing();
      }
    }

    // Dolphin blessing buff countdown
    if (this.state.dolphinBuffTimer > 0) {
      this.state.dolphinBuffTimer = Math.max(0, this.state.dolphinBuffTimer - (1 / 60) * dt);
      const buffEl = document.getElementById('hudDolphinBuff');
      if (buffEl) {
        const mins = Math.floor(this.state.dolphinBuffTimer / 60);
        const secs = Math.floor(this.state.dolphinBuffTimer % 60).toString().padStart(2, '0');
        buffEl.textContent = `🐬 শুশুকের আশীর্বাদ: ${mins}:${secs} (+50% Bite)`;
        buffEl.classList.remove('hidden');
      }
    } else {
      const buffEl = document.getElementById('hudDolphinBuff');
      if (buffEl && !buffEl.classList.contains('hidden')) {
        buffEl.classList.add('hidden');
      }
    }
  }

  triggerDolphinSurfacing() {
    const isLeftToRight = Math.random() > 0.5;
    const startX = isLeftToRight ? 260 + Math.random() * 80 : 680 - Math.random() * 80;
    const endX = isLeftToRight ? startX + 220 + Math.random() * 70 : startX - (220 + Math.random() * 70);

    this.state.dolphin.active = true;
    this.state.dolphin.progress = 0;
    this.state.dolphin.startX = startX;
    this.state.dolphin.endX = endX;
    this.state.dolphin.waterY = 270 + Math.random() * 20;
    this.state.dolphin.jumpHeight = 55 + Math.random() * 25;
    this.state.dolphin.splashedIn = false;
    this.state.dolphin.splashedOut = false;
    this.state.dolphin.isLeftToRight = isLeftToRight;

    // Apply 2-minute dolphin blessing (+50% faster bite + higher rare fish chance)
    this.state.dolphinBuffTimer = 120;
    this.state.stats.dolphinBlessings = (this.state.stats.dolphinBlessings || 0) + 1;
    this.checkAchievements();
    sound.playCatchFanfare('legendary');
    this.showToast('🐬 পদ্মার শুশুক ভেসে উঠেছে! নদী আশীর্বাদ পেয়েছে (+50% Fast Bite for 2 mins)!', 'success');
  }

  // ==========================================
  // Sundarbans Encounters (পোষা ভোঁদড় ও বাঘের ডাক)
  // ==========================================
  updateSundarbansEncounters(dt) {
    const locId = this.state.location.id;
    if (locId !== 'sundarbans') {
      if (this.state.otter.active) this.state.otter.active = false;
      if (this.state.tigerEyes.active) this.state.tigerEyes.active = false;
      return;
    }

    // 1. Traditional Fishing Otter Encounter (নড়াইলের পোষা ভোঁদড়)
    const { otter } = this.state;
    if (otter.active) {
      otter.x += otter.vx * dt;
      // Splash ripples while swimming
      if (Math.random() < 0.05) {
        this.particles.addRipple(otter.x, otter.y, 16);
      }
      if ((otter.vx > 0 && otter.x > this.width + 80) || (otter.vx < 0 && otter.x < -80)) {
        otter.active = false;
        otter.cooldown = 45 + Math.random() * 45; // Next otter in 45-90s
      }
    } else {
      otter.cooldown -= (1 / 60) * dt;
      if (otter.cooldown <= 0) {
        this.triggerOtterEncounter();
      }
    }

    // 2. Royal Bengal Tiger Roar & Glowing Eyes
    const { tigerEyes } = this.state;
    if (tigerEyes.active) {
      tigerEyes.timer -= (1 / 60) * dt;
      if (tigerEyes.timer <= 0) {
        tigerEyes.active = false;
        tigerEyes.cooldown = 70 + Math.random() * 60; // Next roar in 70-130s
      }
    } else {
      tigerEyes.cooldown -= (1 / 60) * dt;
      if (tigerEyes.cooldown <= 0) {
        this.triggerTigerRoar();
      }
    }
  }

  triggerOtterEncounter() {
    const isLeftToRight = Math.random() > 0.5;
    const { otter } = this.state;
    otter.active = true;
    otter.x = isLeftToRight ? -50 : this.width + 50;
    otter.y = 285 + Math.random() * 60;
    otter.vx = (isLeftToRight ? 1 : -1) * (1.6 + Math.random() * 0.8);
    otter.hasFish = true;

    sound.playOtterChirp();
    this.particles.addSplash(Math.max(20, Math.min(this.width - 20, otter.x)), otter.y, 14);

    // Herding bonus: spawn 2 school fish swimming toward player
    this.spawnFish();
    this.spawnFish();

    this.showToast('🦦 পোষা ভোঁদড় জলে নেমে মাছ তাড়া করে আপনার দিকে নিয়ে আসছে!', 'info');
  }

  triggerTigerRoar() {
    this.state.tigerEyes.active = true;
    this.state.tigerEyes.timer = 5.0; // Eyes glow for 5s
    sound.playTigerRoar();

    // Trigger subtle rumble screen shake
    const bezel = document.querySelector('.game-canvas-bezel');
    if (bezel) {
      bezel.classList.remove('camera-shake');
      void bezel.offsetWidth; // reflow
      bezel.classList.add('camera-shake');
      setTimeout(() => bezel.classList.remove('camera-shake'), 650);
    }

    this.showToast('🐅 সুন্দরবনের গহীনে রয়েল বেঙ্গল টাইগারের গর্জন! বনের বাতাস স্তব্ধ...', 'warning');
  }

  // ==========================================
  // Achievements & Titles Manager (মৎস্য শিকারী অর্জন)
  // ==========================================
  checkAchievements() {
    let newUnlock = false;
    ACHIEVEMENTS.forEach((ach) => {
      if (this.state.unlockedAchievements.includes(ach.id)) return;

      let qualified = false;
      if (ach.id === 'first_catch') {
        qualified = Object.values(this.state.album).some((r) => r.count > 0);
      } else if (ach.id === 'pukur_master') {
        qualified = (this.state.stats.catchesByLocation.pukur || 0) >= 10;
      } else if (ach.id === 'haor_pollo_sardar') {
        qualified = (this.state.stats.polloCatches || 0) >= 5;
      } else if (ach.id === 'padma_ilish_raj') {
        qualified = this.state.album.ilish && this.state.album.ilish.maxWeight >= 1.5;
      } else if (ach.id === 'sundarbans_tiger_hunter') {
        qualified = (this.state.album.bhetki?.count > 0) && (this.state.album.bagda_chingri?.count > 0);
      } else if (ach.id === 'river_mystic') {
        qualified = (this.state.album.sworna_boal?.count > 0) || (this.state.album.kachhim?.count > 0);
      } else if (ach.id === 'dolphin_friend') {
        qualified = (this.state.stats.dolphinBlessings || 0) >= 1;
      } else if (ach.id === 'river_guardian') {
        qualified = (this.state.stats.junkCleared || 0) >= 3;
      } else if (ach.id === 'master_ichthyologist') {
        qualified = Object.values(this.state.album).filter((r) => r.count > 0).length >= 20;
      }

      if (qualified) {
        this.state.unlockedAchievements.push(ach.id);
        this.state.taka += ach.rewardTaka;
        newUnlock = true;
        sound.playAchievementFanfare();
        this.showToast(`🏆 নতুন অর্জন: ${ach.titleBn}! (+৳ ${ach.rewardTaka})`, 'success');
        this.saveState();
      }
    });

    if (newUnlock) {
      this.updateHud();
    }
  }

  renderAchievementsModal() {
    const container = document.getElementById('achievementsGridContainer');
    const statsEl = document.getElementById('achievementsCompletionStats');
    const titleDisplay = document.getElementById('modalEquippedTitleDisplay');
    if (!container) return;

    if (titleDisplay) {
      titleDisplay.textContent = this.state.equippedTitle || 'গ্রামের শিকারী (Village Angler)';
    }

    container.innerHTML = '';
    let unlockedCount = 0;

    ACHIEVEMENTS.forEach((ach) => {
      const isUnlocked = this.state.unlockedAchievements.includes(ach.id);
      if (isUnlocked) unlockedCount++;
      const isEquipped = this.state.equippedTitle === ach.titleReward;

      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="achievement-card-header">
          <div class="achievement-icon">${ach.icon}</div>
          <div class="achievement-title-area">
            <h4>${ach.titleBn}</h4>
            <div class="sub">${ach.titleEn}</div>
          </div>
        </div>
        <p class="achievement-desc">${ach.descBn}</p>
        <div style="font-size: 0.74rem; color: #f59e0b; margin-bottom: 8px;">
          খেতাব: <strong>${ach.titleReward}</strong>
        </div>
        <div class="achievement-footer">
          <span class="achievement-reward">পুরস্কার: +৳ ${ach.rewardTaka}</span>
          ${
            isUnlocked
              ? `<button class="btn-equip-title ${isEquipped ? 'equipped' : ''}" data-title="${ach.titleReward}">
                  ${isEquipped ? '✓ সজ্জিত (Active)' : 'খেতাব নিন (Equip)'}
                 </button>`
              : '<span style="font-size: 0.72rem; color: #94a3b8;">🔒 লক করা</span>'
          }
        </div>
      `;

      card.querySelector('.btn-equip-title')?.addEventListener('click', (e) => {
        const title = e.currentTarget.dataset.title;
        this.state.equippedTitle = title;
        sound.playCoinSound();
        this.showToast(`খেতাব সজ্জিত: ${title}`, 'success');
        this.updateHud();
        this.renderAchievementsModal();
        this.saveState();
      });

      container.appendChild(card);
    });

    if (statsEl) {
      statsEl.textContent = `সম্পন্ন: ${unlockedCount} / ${ACHIEVEMENTS.length} অর্জন আনলক (${Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%)`;
    }
  }

  switchRadioTrack() {
    sound.ensureContext();
    const track = sound.nextRadioTrack();
    const radioNameEl = document.getElementById('radioTrackName');
    if (radioNameEl) {
      radioNameEl.textContent = track.nameBn;
    }
    this.showToast(`📻 রেডিও চ্যানেল: ${track.nameBn} (${track.nameEn})`, 'info');
  }

  // ==========================================
  // Inputs & Control Handling (Adaptive Desktop & Mobile)
  // ==========================================
  bindInputs() {
    // Desktop Keyboard
    window.addEventListener('keydown', (e) => {
      sound.ensureContext();
      this.keys[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        this.handlePrimaryActionDown();
      } else if (e.code === 'Digit1') {
        this.switchTool('borshi');
      } else if (e.code === 'Digit2') {
        this.switchTool('jhal');
      } else if (e.code === 'Digit3') {
        this.switchTool('pollo');
      } else if (e.code === 'KeyM') {
        this.openModal('marketModal');
      } else if (e.code === 'KeyE') {
        this.openModal('albumModal');
      } else if (e.code === 'KeyG') {
        this.openModal('shopModal');
      } else if (e.code === 'KeyT') {
        this.openModal('achievementsModal');
      } else if (e.code === 'KeyR') {
        this.switchRadioTrack();
      } else if (e.code === 'KeyH' || e.key === '?') {
        this.openModal('helpModal');
      } else if (e.code === 'KeyP') {
        this.togglePause();
      } else if (e.code === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop:not(.hidden)');
        if (activeModal) {
          this.closeModal(activeModal);
        } else {
          this.togglePause();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') {
        e.preventDefault();
        this.handlePrimaryActionUp();
      }
    });

    // Desktop Mouse / Pointer Controls
    this.canvas.addEventListener('mousedown', (e) => {
      sound.ensureContext();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      if (this.state.currentTool === 'jhal') {
        this.state.jhal.targetX = clickX;
        this.state.jhal.targetY = clickY;
      } else if (this.state.currentTool === 'pollo' && this.state.pollo.state === 'wading') {
        this.state.pollo.playerX = clickX;
        this.state.pollo.playerY = Math.max(260, Math.min(this.height - 80, clickY));
      }

      this.handlePrimaryActionDown();
    });

    window.addEventListener('mouseup', () => {
      this.handlePrimaryActionUp();
    });

    // Touch / Mobile Controls Setup
    this.setupTouchControls();
  }

  setupTouchControls() {
    const actionBtn = document.getElementById('touchActionBtn');
    const dpadUp = document.getElementById('dpadUp');
    const dpadDown = document.getElementById('dpadDown');
    const dpadLeft = document.getElementById('dpadLeft');
    const dpadRight = document.getElementById('dpadRight');

    const bindTouch = (el, code) => {
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sound.ensureContext();
        this.keys[code] = true;
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.keys[code] = false;
      });
    };

    bindTouch(dpadUp, 'ArrowUp');
    bindTouch(dpadDown, 'ArrowDown');
    bindTouch(dpadLeft, 'ArrowLeft');
    bindTouch(dpadRight, 'ArrowRight');

    if (actionBtn) {
      actionBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sound.ensureContext();
        this.handlePrimaryActionDown();
      });
      actionBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.handlePrimaryActionUp();
      });
    }

    // Auto-detect mobile touch environment
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const touchContainer = document.getElementById('touchControlsContainer');
    if (touchContainer) {
      if (isTouchDevice || window.innerWidth < 840) {
        touchContainer.classList.remove('hidden');
      }
    }
  }

  handlePrimaryActionDown() {
    const { currentTool } = this.state;
    if (currentTool === 'borshi') {
      const bState = this.state.borshi.state;
      if (bState === 'idle') {
        this.minigames.startBorshiCast();
      } else if (bState === 'nibble') {
        this.minigames.hookBorshi();
      } else if (bState === 'fighting') {
        this.isReeling = true;
      }
    } else if (currentTool === 'jhal') {
      const jState = this.state.jhal.state;
      if (jState === 'idle') {
        this.minigames.startJhalAim();
      }
    } else if (currentTool === 'pollo') {
      const pState = this.state.pollo.state;
      if (pState === 'wading') {
        this.minigames.slamPollo();
      } else if (pState === 'trapped') {
        this.minigames.grabPolloFish();
      }
    }
    this.updateActionButtonLabel();
  }

  handlePrimaryActionUp() {
    const { currentTool } = this.state;
    if (currentTool === 'borshi') {
      const bState = this.state.borshi.state;
      if (bState === 'charging') {
        this.minigames.releaseBorshiCast();
      } else if (bState === 'fighting') {
        this.isReeling = false;
      }
    } else if (currentTool === 'jhal') {
      if (this.state.jhal.state === 'aiming') {
        this.minigames.releaseJhal();
      }
    }
    this.updateActionButtonLabel();
  }

  switchTool(toolId) {
    // Check if tool is allowed in current location
    if (!this.state.location.allowedTools.includes(toolId)) {
      this.showToast(`এই স্থানে ${toolId.toUpperCase()} ব্যবহার করা যায় না! (Not allowed here)`);
      return;
    }
    this.state.currentTool = toolId;
    sound.playUiClick();

    // Reset minigame states
    this.state.borshi.state = 'idle';
    this.state.jhal.state = 'idle';
    if (toolId === 'pollo') {
      this.state.pollo.state = 'wading';
      this.state.pollo.playerX = this.width * 0.45;
      this.state.pollo.playerY = this.height * 0.65;
    }

    document.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === toolId);
    });

    this.updateActionButtonLabel();
  }

  updateActionButtonLabel() {
    const actionBtn = document.getElementById('touchActionBtn');
    const labelEl = document.getElementById('actionButtonText');
    if (!actionBtn || !labelEl) return;

    const { currentTool } = this.state;
    if (currentTool === 'borshi') {
      const b = this.state.borshi.state;
      if (b === 'idle') labelEl.textContent = 'CAST (ছিপ ফেলুন)';
      else if (b === 'charging') labelEl.textContent = 'RELEASE (ছাড়ুন)';
      else if (b === 'cast') labelEl.textContent = 'WAITING... (অপেক্ষা)';
      else if (b === 'nibble') labelEl.textContent = 'HOOK! (টান দিন!)';
      else if (b === 'fighting') labelEl.textContent = 'REEL! (ঘোরান!)';
    } else if (currentTool === 'jhal') {
      const j = this.state.jhal.state;
      if (j === 'idle') labelEl.textContent = 'THROW NET (খেপ জাল)';
      else if (j === 'aiming') labelEl.textContent = 'RELEASE (জাল নিক্ষেপ)';
      else labelEl.textContent = 'HAULING (টানুন)';
    } else if (currentTool === 'pollo') {
      const p = this.state.pollo.state;
      if (p === 'wading') labelEl.textContent = 'SLAM POLLO (পলো ফেলুন)';
      else if (p === 'trapped') labelEl.textContent = 'GRAB FISH! (মাছ ধরুন!)';
    }
  }

  // ==========================================
  // HUD, Modals & UI Binding
  // ==========================================
  bindUi() {
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.switchTool(btn.dataset.tool);
      });
    });

    // Location selector
    const locSelect = document.getElementById('locationSelect');
    if (locSelect) {
      locSelect.addEventListener('change', (e) => {
        this.switchLocation(e.target.value);
      });
    }

    // Bait selector
    const baitSelect = document.getElementById('baitSelect');
    if (baitSelect) {
      baitSelect.addEventListener('change', (e) => {
        this.state.selectedBait = e.target.value;
        this.saveState();
      });
    }

    // Modal Triggers
    document.getElementById('openMarketBtn')?.addEventListener('click', () => this.openModal('marketModal'));
    document.getElementById('openAlbumBtn')?.addEventListener('click', () => this.openModal('albumModal'));
    document.getElementById('openShopBtn')?.addEventListener('click', () => this.openModal('shopModal'));
    document.getElementById('openAchievementsBtn')?.addEventListener('click', () => this.openModal('achievementsModal'));
    document.getElementById('folkRadioBtn')?.addEventListener('click', () => this.switchRadioTrack());
    document.getElementById('openHelpBtn')?.addEventListener('click', () => this.openModal('helpModal'));
    document.getElementById('toggleSoundBtn')?.addEventListener('click', () => {
      const muted = sound.toggleMute();
      document.getElementById('toggleSoundBtn').textContent = muted ? '🔇 Sound: Off' : '🔊 Sound: On';
    });
    document.getElementById('toggleTouchBtn')?.addEventListener('click', () => {
      const touchContainer = document.getElementById('touchControlsContainer');
      if (touchContainer) touchContainer.classList.toggle('hidden');
    });

    // Pause button and modal controls
    document.getElementById('pauseGameBtn')?.addEventListener('click', () => this.togglePause());
    document.getElementById('resumeGameBtn')?.addEventListener('click', () => this.togglePause(false));
    document.getElementById('resumePauseHeaderBtn')?.addEventListener('click', () => this.togglePause(false));
    document.getElementById('resetSaveBtn')?.addEventListener('click', () => {
      if (confirm('আপনি কি সমস্ত সেভ ডেটা মুছে নতুন করে শুরু করতে চান? (Reset all game progress?)')) {
        localStorage.removeItem('bangla_fishing_save_v1');
        location.reload();
      }
    });

    // Close buttons for all modals
    document.querySelectorAll('.close-modal-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeModal(btn.closest('.modal-backdrop'));
      });
    });

    // Close modal when clicking on the dark backdrop area
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeModal(backdrop);
        }
      });
    });

    // Market actions
    document.getElementById('sellAllBtn')?.addEventListener('click', () => this.sellAllCatches());

    // Catch Trophy modal close
    document.getElementById('closeTrophyBtn')?.addEventListener('click', () => {
      this.closeModal(document.getElementById('trophyModal'));
    });
  }

  togglePause(forceState) {
    this.isPaused = forceState !== undefined ? forceState : !this.isPaused;
    sound.ensureContext();
    sound.playUiClick();

    const pauseModal = document.getElementById('pauseModal');
    const pauseBtn = document.getElementById('pauseGameBtn');

    if (this.isPaused) {
      if (pauseModal) {
        const locEl = document.getElementById('pauseLocationName');
        const takaEl = document.getElementById('pauseTakaVal');
        const countEl = document.getElementById('pauseFishCount');
        const weatherEl = document.getElementById('pauseWeatherText');

        if (locEl) locEl.textContent = `${this.state.location.nameBn} • [${this.state.equippedTitle || 'গ্রামের শিকারী'}]`;
        if (takaEl) takaEl.textContent = `৳ ${this.state.taka.toLocaleString()}`;
        if (countEl) countEl.textContent = `${this.state.inventory.length} Fish`;
        if (weatherEl) weatherEl.textContent = `${this.renderer.getTimeName().en} / ${this.state.weather.toUpperCase()}`;

        pauseModal.classList.remove('hidden');
      }
      if (pauseBtn) pauseBtn.textContent = '▶️ চালিয়ে যান (Resume)';
    } else {
      if (pauseModal) pauseModal.classList.add('hidden');
      if (pauseBtn) pauseBtn.textContent = '⏸️ বিরতি (Pause)';
      this.lastTime = performance.now();
    }
  }

  switchLocation(locKey) {
    const loc = LOCATIONS[locKey.toUpperCase()];
    if (!loc) return;

    if (loc.id === 'padma' && !this.state.upgrades.boatUnlocked) {
      // Boat not strictly required to visit shore ghat, but boat unlocks deep river
    }

    this.state.location = loc;
    sound.playUiClick();
    this.initFishPool();

    // Verify current tool is permitted
    if (!loc.allowedTools.includes(this.state.currentTool)) {
      this.switchTool(loc.allowedTools[0]);
    }

    this.showToast(`অবস্থান পরিবর্তন: ${loc.nameBn} (${loc.name})`);
    this.updateHud();
    this.saveState();
  }

  updateHud() {
    const takaEl = document.getElementById('hudTaka');
    if (takaEl) takaEl.textContent = `৳ ${this.state.taka.toLocaleString()}`;

    const catchCountEl = document.getElementById('hudCatchCount');
    if (catchCountEl) catchCountEl.textContent = `${this.state.inventory.length} Fish`;

    const weatherEl = document.getElementById('hudWeather');
    if (weatherEl) {
      const wMap = {
        clear: '☀️ Clear (রৌদ্রোজ্জ্বল)',
        rain: '🌧️ Monsoon Rain (বৃষ্টি)',
        monsoon: '⛈️ Heavy Storm (বজ্রঝড়)'
      };
      weatherEl.textContent = wMap[this.state.weather] || '☀️ Clear';
    }

    const timeEl = document.getElementById('hudTime');
    if (timeEl) {
      const t = this.renderer.getTimeName();
      timeEl.textContent = t.en;
    }

    const titleBadgeEl = document.getElementById('playerEquippedTitleBadge');
    if (titleBadgeEl) titleBadgeEl.textContent = this.state.equippedTitle || 'গ্রামের শিকারী';

    const baitCountEl = document.getElementById('hudBaitCount');
    if (baitCountEl) {
      const currentBaitId = this.state.selectedBait;
      const count = this.state.baitInventory[currentBaitId] || 0;
      baitCountEl.textContent = `Bait: ${count} left`;
    }

    const dolphinBuffEl = document.getElementById('hudDolphinBuff');
    if (dolphinBuffEl) {
      if (this.state.dolphinBuffTimer > 0) {
        const mins = Math.floor(this.state.dolphinBuffTimer / 60);
        const secs = Math.floor(this.state.dolphinBuffTimer % 60).toString().padStart(2, '0');
        dolphinBuffEl.textContent = `🐬 শুশুকের আশীর্বাদ: ${mins}:${secs} (+50% Bite)`;
        dolphinBuffEl.classList.remove('hidden');
      } else {
        dolphinBuffEl.classList.add('hidden');
      }
    }
  }

  renderMinigameOverlays() {
    const { borshi, jhal } = this.state;
    const fightOverlay = document.getElementById('fightOverlay');
    const chargeOverlay = document.getElementById('chargeOverlay');

    // 1. Borshi Tension Bar & Stamina Bar
    const staminaContainer = document.getElementById('staminaContainer');
    if (borshi.state === 'fighting') {
      if (fightOverlay) {
        fightOverlay.classList.remove('hidden');
        const tensionFill = document.getElementById('tensionFill');
        const sweetZoneIndicator = document.getElementById('sweetZoneIndicator');
        const staminaFill = document.getElementById('fishStaminaFill');

        if (tensionFill) tensionFill.style.height = `${Math.min(100, borshi.tension * 100)}%`;
        if (sweetZoneIndicator) {
          const half = borshi.sweetZoneWidth / 2;
          const bottom = Math.max(0, (borshi.sweetZone - half) * 100);
          sweetZoneIndicator.style.bottom = `${bottom}%`;
          sweetZoneIndicator.style.height = `${borshi.sweetZoneWidth * 100}%`;
        }
        if (staminaFill) {
          const pct = Math.max(0, (borshi.fishStamina / borshi.fishMaxStamina) * 100);
          staminaFill.style.width = `${pct}%`;
        }
      }
      if (staminaContainer) staminaContainer.classList.remove('hidden');
    } else {
      if (fightOverlay) fightOverlay.classList.add('hidden');
      if (staminaContainer) staminaContainer.classList.add('hidden');
    }

    // 2. Cast Power Bar
    if (borshi.state === 'charging' || jhal.state === 'aiming') {
      if (chargeOverlay) {
        chargeOverlay.classList.remove('hidden');
        const chargeFill = document.getElementById('chargeFill');
        const val = borshi.state === 'charging' ? borshi.charge : jhal.power;
        if (chargeFill) chargeFill.style.width = `${val * 100}%`;
      }
    } else {
      if (chargeOverlay) chargeOverlay.classList.add('hidden');
    }
  }

  showCatchModal(item) {
    const modal = document.getElementById('trophyModal');
    if (!modal) return;

    // Pause game simulation while viewing catch trophy
    this.isPaused = true;

    document.getElementById('trophyFishName').textContent = `${item.nameBn} (${item.name})`;
    document.getElementById('trophyWeight').textContent = `${item.weight} kg`;
    document.getElementById('trophyValue').textContent = `৳ ${item.value}`;
    document.getElementById('trophyRarity').textContent = item.rarity;
    document.getElementById('trophyRarity').className = `badge badge-${item.rarityClass}`;

    const avatarEl = modal.querySelector('.trophy-fish-avatar');
    if (avatarEl) {
      avatarEl.innerHTML = `<img src="${getFishSpriteDataUrl(item.speciesId, false, 4)}" class="trophy-pixel-art" alt="${item.name}">`;
    }

    const species = FISH_SPECIES.find((f) => f.id === item.speciesId);
    if (species) {
      document.getElementById('trophyTrivia').textContent = `"${species.trivia}"`;
    }

    modal.classList.remove('hidden');
  }

  openModal(modalId) {
    sound.ensureContext();
    sound.playUiClick();
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Auto-pause game while browsing Market, Album, or Shop
    this.isPaused = true;

    if (modalId === 'marketModal') this.renderMarketModal();
    if (modalId === 'albumModal') this.renderAlbumModal();
    if (modalId === 'shopModal') this.renderShopModal();
    if (modalId === 'achievementsModal') this.renderAchievementsModal();

    modal.classList.remove('hidden');
  }

  closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    sound.playUiClick();

    // If no other modal is currently open, unpause the game smoothly
    const openModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
    if (openModals.length === 0) {
      this.isPaused = false;
      this.lastTime = performance.now();
      const pauseBtn = document.getElementById('pauseGameBtn');
      if (pauseBtn) pauseBtn.textContent = '⏸️ বিরতি (Pause)';
    }
  }

  renderMarketModal() {
    const container = document.getElementById('marketItemsContainer');
    const totalEl = document.getElementById('marketTotalValue');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (this.state.inventory.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>ঝাঁকা ফাঁকা! এখনো কোনো মাছ ধরা পড়েনি।</p>
          <p class="sub">No fresh catch in your basket yet. Cast your line in the water!</p>
        </div>`;
      if (totalEl) totalEl.textContent = '৳ 0';
      return;
    }

    this.state.inventory.forEach((item, index) => {
      total += item.value;
      const card = document.createElement('div');
      card.className = `market-card border-${item.rarityClass}`;
      card.innerHTML = `
        <div style="display: flex; align-items: center;">
          <img src="${getFishSpriteDataUrl(item.speciesId, false, 2)}" class="pixel-fish-thumbnail" alt="${item.name}">
          <div class="market-fish-info">
            <h4>${item.nameBn} <span class="en-name">${item.name}</span></h4>
            <span class="badge badge-${item.rarityClass}">${item.rarity}</span>
            <p class="specs">ওজন: <strong>${item.weight} kg</strong> | ধরা হয়েছে: ${item.time}</p>
          </div>
        </div>
        <div class="market-price-col">
          <div class="price-tag">৳ ${item.value}</div>
          <button class="btn btn-sell-single" data-index="${index}">বিক্রি (Sell)</button>
        </div>
      `;
      card.querySelector('.btn-sell-single').addEventListener('click', () => {
        this.sellCatch(index);
      });
      container.appendChild(card);
    });

    if (totalEl) totalEl.textContent = `৳ ${total.toLocaleString()}`;
  }

  renderAlbumModal() {
    const container = document.getElementById('albumGridContainer');
    const statsEl = document.getElementById('albumCompletionStats');
    if (!container) return;

    container.innerHTML = '';
    let caughtTotal = 0;

    FISH_SPECIES.forEach((species) => {
      const record = this.state.album[species.id];
      const isCaught = record && record.count > 0;
      if (isCaught) caughtTotal++;

      const spriteUrl = getFishSpriteDataUrl(species.id, !isCaught, 3);

      const card = document.createElement('div');
      card.className = `album-card ${isCaught ? 'unlocked' : 'locked'} border-${species.rarityClass}`;
      card.innerHTML = `
        <div class="album-badge badge-${species.rarityClass}">${species.rarity}</div>
        <div class="album-fish-img-container">
          <img src="${spriteUrl}" alt="${species.name}" class="pixel-fish-sprite">
          ${!isCaught ? '<div class="lock-question-overlay">?</div>' : ''}
        </div>
        <h4 class="album-title">${isCaught ? species.nameBn : 'অজানা মাছ (Undiscovered)'}</h4>
        <div class="album-sub">${species.name}</div>
        <div class="album-latin">${species.scientific}</div>
        ${
          isCaught
            ? `
          <div class="album-records">
            <p>ধরা হয়েছে: <strong>${record.count} বার</strong></p>
            <p>সর্বোচ্চ ওজন: <strong>${record.maxWeight} kg</strong></p>
            <p class="album-trivia"><em>"${species.trivia}"</em></p>
          </div>
        `
            : `
          <div class="album-locked-hint">
            <p>আবাসস্থল: ${species.habitats.map((h) => LOCATIONS[h.toUpperCase()]?.nameBn || h).join(', ')}</p>
            <p>পানিতে ছিপ বা জাল ফেলে আবিষ্কার করুন!</p>
          </div>
        `
        }
      `;
      container.appendChild(card);
    });

    if (statsEl) {
      statsEl.textContent = `মোট প্রজাতি সম্পন্ন: ${caughtTotal} / ${FISH_SPECIES.length} (${Math.round((caughtTotal / FISH_SPECIES.length) * 100)}%)`;
    }
  }

  renderShopModal() {
    const container = document.getElementById('shopItemsContainer');
    if (!container) return;
    container.innerHTML = '';

    // 1. Bait Purchases
    const baitHeader = document.createElement('h3');
    baitHeader.className = 'shop-section-header';
    baitHeader.textContent = 'মাছের পছন্দের টোপ (Fresh Natural Baits)';
    container.appendChild(baitHeader);

    const baitGrid = document.createElement('div');
    baitGrid.className = 'shop-grid';

    Object.values(BAITS).forEach((bait) => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      const count = this.state.baitInventory[bait.id] || 0;
      card.innerHTML = `
        <div class="shop-icon">${bait.icon}</div>
        <h4>${bait.name}</h4>
        <p class="desc">${bait.desc}</p>
        <div class="owned-tag">মজুদ আছে: ${count} টি</div>
        <div class="shop-footer">
          <span class="price-val">৳ ${bait.cost} / ৫টি</span>
          <button class="btn btn-buy" data-bait="${bait.id}">কিনুন (Buy 5)</button>
        </div>
      `;
      card.querySelector('.btn-buy').addEventListener('click', () => {
        if (this.state.taka >= bait.cost) {
          this.state.taka -= bait.cost;
          this.state.baitInventory[bait.id] = (this.state.baitInventory[bait.id] || 0) + 5;
          sound.playCoinSound();
          this.showToast(`${bait.nameBn} কেনা হয়েছে (+5)!`, 'success');
          this.updateHud();
          this.renderShopModal();
          this.saveState();
        } else {
          this.showToast('টাকা পর্যাপ্ত নয়! মাছ বিক্রি করে আয় করুন। (Not enough Taka)', 'warning');
        }
      });
      baitGrid.appendChild(card);
    });
    container.appendChild(baitGrid);

    // 2. Rod Upgrades
    const rodHeader = document.createElement('h3');
    rodHeader.className = 'shop-section-header';
    rodHeader.textContent = 'ছিপ ও আধুনিক রড (Fishing Rods & Chhip)';
    container.appendChild(rodHeader);

    const rodGrid = document.createElement('div');
    rodGrid.className = 'shop-grid';

    GEAR_UPGRADES.rods.forEach((rod) => {
      const isOwned = this.state.upgrades.rod === rod.id;
      const card = document.createElement('div');
      card.className = `shop-card ${isOwned ? 'equipped' : ''}`;
      card.innerHTML = `
        <div class="shop-icon">🎣</div>
        <h4>${rod.name}</h4>
        <p class="desc">${rod.desc}</p>
        <p class="stats">টান শক্তি: <strong>x${rod.power}</strong> | লক্ষ্য স্থিরতা: <strong>${Math.round(rod.sweetSpot * 100)}%</strong></p>
        <div class="shop-footer">
          <span class="price-val">${isOwned ? 'সজ্জিত (Equipped)' : rod.price === 0 ? 'ফ্রি' : `৳ ${rod.price}`}</span>
          ${
            !isOwned
              ? `<button class="btn btn-buy-rod" data-id="${rod.id}">আপগ্রেড (Upgrade)</button>`
              : '<span class="badge badge-common">Active</span>'
          }
        </div>
      `;
      card.querySelector('.btn-buy-rod')?.addEventListener('click', () => {
        if (this.state.taka >= rod.price) {
          this.state.taka -= rod.price;
          this.state.upgrades.rod = rod.id;
          sound.playCoinSound();
          this.showToast(`${rod.name} আপগ্রেড সম্পন্ন!`, 'success');
          this.updateHud();
          this.renderShopModal();
          this.saveState();
        } else {
          this.showToast('টাকা পর্যাপ্ত নয়! (Not enough Taka)', 'warning');
        }
      });
      rodGrid.appendChild(card);
    });
    container.appendChild(rodGrid);

    // 3. Cast Net Upgrades
    const netHeader = document.createElement('h3');
    netHeader.className = 'shop-section-header';
    netHeader.textContent = 'খেপ জাল ও মহাজাল (Cast Net Gear)';
    container.appendChild(netHeader);

    const netGrid = document.createElement('div');
    netGrid.className = 'shop-grid';

    GEAR_UPGRADES.nets.forEach((net) => {
      const isOwned = this.state.upgrades.net === net.id;
      const card = document.createElement('div');
      card.className = `shop-card ${isOwned ? 'equipped' : ''}`;
      card.innerHTML = `
        <div class="shop-icon">🕸️</div>
        <h4>${net.name}</h4>
        <p class="desc">${net.desc}</p>
        <p class="stats">নিক্ষেপ ব্যাসার্ধ: <strong>${net.radius}px</strong></p>
        <div class="shop-footer">
          <span class="price-val">${isOwned ? 'সজ্জিত (Equipped)' : `৳ ${net.price}`}</span>
          ${
            !isOwned
              ? `<button class="btn btn-buy-net" data-id="${net.id}">কিনুন (Upgrade)</button>`
              : '<span class="badge badge-common">Active</span>'
          }
        </div>
      `;
      card.querySelector('.btn-buy-net')?.addEventListener('click', () => {
        if (this.state.taka >= net.price) {
          this.state.taka -= net.price;
          this.state.upgrades.net = net.id;
          sound.playCoinSound();
          this.showToast(`${net.name} কেনা সম্পন্ন!`, 'success');
          this.updateHud();
          this.renderShopModal();
          this.saveState();
        } else {
          this.showToast('টাকা পর্যাপ্ত নয়!', 'warning');
        }
      });
      netGrid.appendChild(card);
    });
    container.appendChild(netGrid);

    // 4. Boat Unlock (Dinghi Nouka)
    const boatHeader = document.createElement('h3');
    boatHeader.className = 'shop-section-header';
    boatHeader.textContent = 'ডিঙি নৌকা ও জলযান (Boats & Transport)';
    container.appendChild(boatHeader);

    const boatGrid = document.createElement('div');
    boatGrid.className = 'shop-grid';
    const dinghi = GEAR_UPGRADES.boats[1];
    const boatOwned = this.state.upgrades.boatUnlocked;

    const boatCard = document.createElement('div');
    boatCard.className = `shop-card ${boatOwned ? 'equipped' : ''}`;
    boatCard.innerHTML = `
      <div class="shop-icon">⛵</div>
      <h4>${dinghi.name}</h4>
      <p class="desc">${dinghi.desc}</p>
      <div class="shop-footer">
        <span class="price-val">${boatOwned ? 'মালিকানা আছে (Owned)' : `৳ ${dinghi.price}`}</span>
        ${
          !boatOwned
            ? `<button class="btn btn-buy-boat">নৌকা কিনুন (Unlock Boat)</button>`
            : '<span class="badge badge-legendary">Unlocked</span>'
        }
      </div>
    `;
    boatCard.querySelector('.btn-buy-boat')?.addEventListener('click', () => {
      if (this.state.taka >= dinghi.price) {
        this.state.taka -= dinghi.price;
        this.state.upgrades.boatUnlocked = true;
        sound.playCatchFanfare('legendary');
        this.showToast('ডিঙি নৌকা আনলক হয়েছে! পদ্মার গভীর জলে ইলিশের সন্ধান করুন!', 'success');
        this.updateHud();
        this.renderShopModal();
        this.saveState();
      } else {
        this.showToast('টাকা পর্যাপ্ত নয়! বড় মাছ ধরে জমিয়ে তুলুন।', 'warning');
      }
    });
    boatGrid.appendChild(boatCard);
    container.appendChild(boatGrid);
  }

  showToast(msg, type = 'info') {
    const toast = document.getElementById('gameToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `game-toast show toast-${type}`;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.className = 'game-toast';
    }, 3200);
  }

  // ==========================================
  // Persistence
  // ==========================================
  saveState() {
    try {
      const data = {
        taka: this.state.taka,
        locationId: this.state.location.id,
        selectedBait: this.state.selectedBait,
        baitInventory: this.state.baitInventory,
        upgrades: this.state.upgrades,
        inventory: this.state.inventory,
        album: this.state.album,
        stats: this.state.stats,
        unlockedAchievements: this.state.unlockedAchievements,
        equippedTitle: this.state.equippedTitle
      };
      localStorage.setItem('bangla_fishing_save_v1', JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  loadState() {
    try {
      const raw = localStorage.getItem('bangla_fishing_save_v1');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.taka !== undefined) this.state.taka = data.taka;
        if (data.locationId && LOCATIONS[data.locationId.toUpperCase()]) {
          this.state.location = LOCATIONS[data.locationId.toUpperCase()];
        }
        if (data.selectedBait) this.state.selectedBait = data.selectedBait;
        if (data.baitInventory) this.state.baitInventory = data.baitInventory;
        if (data.upgrades) this.state.upgrades = Object.assign(this.state.upgrades, data.upgrades);
        if (data.inventory) this.state.inventory = data.inventory;
        if (data.album) this.state.album = data.album;
        if (data.stats) this.state.stats = Object.assign(this.state.stats, data.stats);
        if (data.unlockedAchievements) this.state.unlockedAchievements = data.unlockedAchievements;
        if (data.equippedTitle) this.state.equippedTitle = data.equippedTitle;
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }
}

// Instantiate game on load
window.addEventListener('DOMContentLoaded', () => {
  window.banglaGame = new Game();
});
