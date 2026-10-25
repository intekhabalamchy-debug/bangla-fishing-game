// Minigame Logic for Borshi (Rod), Khep Jhal (Cast Net), and Pollo (Plunge Basket)
import { sound } from './audio.js';

export class MinigameController {
  constructor(game) {
    this.game = game;
  }

  // ==========================================
  // 1. BORSHI (Rod & Hook) Mechanics
  // ==========================================
  startBorshiCast() {
    const { borshi } = this.game.state;
    if (borshi.state !== 'idle') return;
    borshi.state = 'charging';
    borshi.charge = 0;
    borshi.chargeDir = 1;
  }

  releaseBorshiCast() {
    const { borshi, location } = this.game.state;
    if (borshi.state !== 'charging') return;

    sound.playCast();
    borshi.state = 'in_flight';
    const dist = 0.35 + borshi.charge * 0.55;
    borshi.targetBobberX = this.game.width * (0.28 + dist * 0.55);
    borshi.targetBobberY = this.game.height * (0.50 + Math.random() * 0.32);

    // Animate line throwing
    setTimeout(() => {
      borshi.bobberX = borshi.targetBobberX;
      borshi.bobberY = borshi.targetBobberY;
      borshi.state = 'cast';
      sound.playSplash(false);
      this.game.particles.addSplash(borshi.bobberX, borshi.bobberY, 8);

      // Determine bite timer based on bait and location
      const baitData = this.game.getSelectedBait();
      const baseWait = 2500 + Math.random() * 4500;
      const dolphinMult = (this.game.state.dolphinBuffTimer > 0) ? 1.5 : 1.0;
      const waitTime = baseWait / ((baitData ? baitData.catchMultiplier : 1.0) * dolphinMult);

      borshi.biteTimer = setTimeout(() => {
        if (borshi.state === 'cast') {
          this.triggerBorshiNibble();
        }
      }, waitTime);
    }, 380);
  }

  triggerBorshiNibble() {
    const { borshi } = this.game.state;
    borshi.state = 'nibble';
    sound.playBite();
    this.game.particles.addRipple(borshi.bobberX, borshi.bobberY, 28);

    // Pick target fish from current location pool influenced by bait
    borshi.hookedFish = this.game.pickFishForHook();

    // Player has window to hook
    borshi.hookWindow = setTimeout(() => {
      if (borshi.state === 'nibble') {
        // Missed bite
        this.game.showToast('মাছ টোপ খেয়ে পালিয়ে গেছে! (Fish ate bait & escaped)');
        borshi.state = 'idle';
      }
    }, 1800);
  }

  hookBorshi() {
    const { borshi } = this.game.state;
    if (borshi.state === 'nibble') {
      clearTimeout(borshi.hookWindow);
      sound.playSplash(true);
      this.game.particles.addSplash(borshi.bobberX, borshi.bobberY, 16);

      borshi.state = 'fighting';
      const fish = borshi.hookedFish;
      borshi.fishStamina = fish.stamina;
      borshi.fishMaxStamina = fish.stamina;
      borshi.tension = 0.5;
      borshi.sweetZone = 0.5; // Center target
      borshi.sweetZoneWidth = this.game.getRodSweetSpot();
      borshi.fishFightDir = Math.random() > 0.5 ? 1 : -1;
      this.game.showToast(`টান লেগেছে! ${fish.nameBn} লড়াই করছে! Reel carefully!`);
    } else if (borshi.state === 'idle') {
      this.startBorshiCast();
    }
  }

  updateBorshiFight(dt, isReeling) {
    const { borshi } = this.game.state;
    if (borshi.state !== 'fighting') return;

    const fish = borshi.hookedFish;
    const fightSpeed = fish.fightSpeed || 1.5;

    // Fish shifts sweet zone dynamically
    borshi.sweetZone += borshi.fishFightDir * 0.012 * fightSpeed;
    if (borshi.sweetZone > 0.85) {
      borshi.sweetZone = 0.85;
      borshi.fishFightDir = -1;
      this.game.particles.addSplash(borshi.bobberX, borshi.bobberY, 4);
    } else if (borshi.sweetZone < 0.15) {
      borshi.sweetZone = 0.15;
      borshi.fishFightDir = 1;
      this.game.particles.addSplash(borshi.bobberX, borshi.bobberY, 4);
    }

    // Tension physics: Reeling pulls tension up, releasing drops tension
    const rodPower = this.game.getRodPower();
    if (isReeling) {
      borshi.tension += 0.024;
      sound.playReelClick();
    } else {
      borshi.tension -= 0.016;
    }

    // In sweet zone?
    const halfWidth = borshi.sweetZoneWidth / 2;
    const inSweetZone = Math.abs(borshi.tension - borshi.sweetZone) < halfWidth;

    if (inSweetZone) {
      // Drain fish stamina!
      borshi.fishStamina -= 0.45 * rodPower;
      if (Math.random() < 0.3) {
        this.game.particles.addBubble(borshi.bobberX, borshi.bobberY);
      }
    } else {
      // Fish recovers a tiny bit if player is off
      borshi.fishStamina = Math.min(borshi.fishMaxStamina, borshi.fishStamina + 0.08);
    }

    // Tension bounds & dangers
    if (borshi.tension >= 1.0) {
      // Line snapped!
      sound.playLineSnapWarning();
      this.game.showToast('সুতা ছিঁড়ে গেছে! (Line snapped under heavy tension!)', 'danger');
      borshi.state = 'idle';
      return;
    } else if (borshi.tension <= 0.02) {
      // Slack line, fish shook hook off
      this.game.showToast('মাছ হুক ছেড়ে চলে গেল! (Slack line, fish escaped!)', 'warning');
      borshi.state = 'idle';
      return;
    }

    // Fish caught victory!
    if (borshi.fishStamina <= 0) {
      this.game.onCatchFish(borshi.hookedFish);
      borshi.state = 'idle';
    }
  }

  // ==========================================
  // 2. KHEP JHAL (Cast Net) Mechanics
  // ==========================================
  startJhalAim() {
    const { jhal } = this.game.state;
    if (jhal.state !== 'idle') return;
    jhal.state = 'aiming';
    jhal.power = 0.2;
    jhal.powerDir = 1;
  }

  releaseJhal() {
    const { jhal } = this.game.state;
    if (jhal.state !== 'aiming') return;

    sound.playCast();
    jhal.state = 'throwing';
    jhal.x = jhal.targetX;
    jhal.y = jhal.targetY;
    const netTier = this.game.getNetRadius();
    jhal.radius = 10;
    jhal.maxRadius = netTier;

    // Expand net radius animation
    const expandInterval = setInterval(() => {
      jhal.radius += 5;
      if (jhal.radius >= jhal.maxRadius) {
        clearInterval(expandInterval);
        sound.playSplash(true);
        this.game.particles.addSplash(jhal.x, jhal.y, 22);

        // Check captured fish within circular radius
        const caughtList = [];
        const fishList = this.game.state.activeFish;

        for (let i = fishList.length - 1; i >= 0; i--) {
          const f = fishList[i];
          const dist = Math.hypot(f.x - jhal.x, (f.y - jhal.y) / 0.45);
          const netChance = this.game.state.dolphinBuffTimer > 0 ? 0.95 : 0.75;
          if (dist < jhal.maxRadius && Math.random() < netChance) {
            caughtList.push(f.species);
            fishList.splice(i, 1);
          }
        }

        setTimeout(() => {
          if (caughtList.length > 0) {
            this.game.onCatchMultipleFish(caughtList);
          } else {
            this.game.showToast('জালে কোনো মাছ পড়েনি! আবার চেষ্টা করুন (No fish in net! Try again)');
          }
          jhal.state = 'idle';
        }, 1200);
      }
    }, 30);
  }

  // ==========================================
  // 3. POLLO (Plunge Basket) Mechanics
  // ==========================================
  slamPollo() {
    const { pollo } = this.game.state;
    if (pollo.state !== 'wading') return;

    sound.playPolloSlam();
    pollo.state = 'trapped';
    pollo.targetX = pollo.playerX;
    pollo.targetY = pollo.playerY + 25;

    this.game.particles.addMudCloud(pollo.targetX, pollo.targetY, 35);
    this.game.particles.addSplash(pollo.targetX, pollo.targetY, 18, '#854d0e');

    // Check if any mud shadow / fish was under the Pollo!
    let caughtFish = null;
    const fishList = this.game.state.activeFish;
    for (let i = 0; i < fishList.length; i++) {
      const f = fishList[i];
      const dist = Math.hypot(f.x - pollo.targetX, f.y - pollo.targetY);
      if (dist < 45) {
        caughtFish = f.species;
        fishList.splice(i, 1);
        break;
      }
    }

    // High chance of mud lurking fish in Haor if timed well
    if (!caughtFish && Math.random() < 0.45) {
      caughtFish = this.game.pickMudFish();
    }

    if (caughtFish) {
      pollo.trappedFish = caughtFish;
      this.game.showToast(`পলোতে ঝাপট মারছে! ${caughtFish.nameBn} ভেতরে! দ্রুত হাত দিন!`, 'success');
      // Window to grab
      pollo.grabWindow = setTimeout(() => {
        if (pollo.state === 'trapped') {
          this.game.showToast('মাছ পলোর তলা দিয়ে পিছলে কাদার ভেতর পালাল! (Fish slipped under mud!)', 'warning');
          pollo.state = 'wading';
        }
      }, 3500);
    } else {
      this.game.showToast('পলো ফাঁকা! কাদায় মাছ ছিল না (Empty basket! Only mud)');
      setTimeout(() => {
        pollo.state = 'wading';
      }, 1000);
    }
  }

  grabPolloFish() {
    const { pollo } = this.game.state;
    if (pollo.state === 'trapped' && pollo.trappedFish) {
      clearTimeout(pollo.grabWindow);
      sound.playSplash(true);
      this.game.particles.addSplash(pollo.targetX, pollo.targetY, 14, '#ca8a04');
      this.game.onCatchFish(pollo.trappedFish);
      pollo.trappedFish = null;
      pollo.state = 'wading';
    }
  }
}
