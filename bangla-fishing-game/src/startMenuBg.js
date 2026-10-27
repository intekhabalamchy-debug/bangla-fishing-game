/**
 * startMenuBg.js - Living Panoramic River World for Bangla Fishing Game
 * 
 * Renders an animated, full-screen Bengali riverine background:
 * - Parallax misty village shoreline with coconut & palm silhouettes
 * - Flowing multi-layer river waves with sunlight refractions & foam
 * - Traditional wooden dinghy boat (ডিঙি নৌকা ও মাঝি) swaying with wave physics
 * - Floating water hyacinth (কচুরিপানা) & water lilies (শাপলা)
 * - Schools of silver fish swimming & leaping out with splash ripples
 * - Atmospheric morning river mist & gliding egret birds (মাঠের বক)
 */

export class StartMenuBg {
  constructor(canvasId = 'startMenuBgCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.animationFrameId = null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Simulation state
    this.time = 0;
    this.shorelineX = 0;

    // Animated entities
    this.boat = {
      x: this.width * 0.72,
      targetX: this.width * 0.72,
      baseY: 0,
      y: 0,
      angle: 0,
      oarAngle: 0,
      wakeTimer: 0
    };

    this.fishPool = [];
    this.leapingFish = null;
    this.splashRipples = [];
    this.hyacinths = [];
    this.birds = [];
    this.mistParticles = [];

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    this.setupCanvas();
    this.initEntities();
  }

  setupCanvas() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Dynamic water horizon line (roughly 48% to 52% of screen height)
    this.waterY = Math.floor(this.height * 0.52);
    this.boat.baseY = this.waterY + 18;
    this.boat.x = Math.max(280, this.width * 0.72);
  }

  handleResize() {
    this.setupCanvas();
  }

  initEntities() {
    // 1. Drifting Water Hyacinth (কচুরিপানা)
    this.hyacinths = [];
    for (let i = 0; i < 7; i++) {
      this.hyacinths.push({
        x: Math.random() * this.width,
        y: this.waterY + 25 + Math.random() * (this.height - this.waterY - 50),
        vx: -(0.3 + Math.random() * 0.4),
        scale: 0.7 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        hasFlower: Math.random() > 0.4
      });
    }

    // 2. Gliding Egrets / River Birds (বক ও মাছরাঙা)
    this.birds = [];
    for (let i = 0; i < 4; i++) {
      this.birds.push({
        x: -50 - Math.random() * 300,
        y: 60 + Math.random() * (this.waterY * 0.55),
        vx: 1.2 + Math.random() * 0.8,
        scale: 0.6 + Math.random() * 0.5,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 0.12 + Math.random() * 0.05
      });
    }

    // 3. Swimming Underwater Fish
    this.fishPool = [];
    for (let i = 0; i < 8; i++) {
      this.fishPool.push({
        x: Math.random() * this.width,
        y: this.waterY + 40 + Math.random() * (this.height - this.waterY - 60),
        vx: (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.8),
        size: 14 + Math.random() * 16,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '#99f6e4' : '#fef08a'
      });
    }

    // 4. River Mist Particles
    this.mistParticles = [];
    for (let i = 0; i < 18; i++) {
      this.mistParticles.push({
        x: Math.random() * this.width,
        y: this.waterY - 20 + Math.random() * 80,
        vx: -(0.2 + Math.random() * 0.3),
        size: 24 + Math.random() * 38,
        alpha: 0.08 + Math.random() * 0.14
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  tick() {
    if (!this.isRunning) return;
    const now = performance.now();
    const dt = Math.min((now - (this.lastTime || now)) / 16.66, 2.0);
    this.lastTime = now;

    this.update(dt);
    this.draw();

    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }

  update(dt) {
    this.time += 0.03 * dt;
    this.shorelineX = (this.shorelineX - 0.22 * dt) % 960;

    // Boat wave rocking physics
    const waveY = Math.sin(this.time * 1.4) * 6;
    const waveTilt = Math.cos(this.time * 1.4) * 0.045;
    this.boat.y = this.boat.baseY + waveY;
    this.boat.angle = waveTilt;
    this.boat.oarAngle = Math.sin(this.time * 0.8) * 0.25;

    // Spawn leaping fish occasionally
    if (!this.leapingFish && Math.random() < 0.008) {
      const isLeft = Math.random() > 0.5;
      const startX = this.width * (0.35 + Math.random() * 0.5);
      this.leapingFish = {
        x: startX,
        y: this.waterY + 10,
        vx: (isLeft ? 1 : -1) * (1.8 + Math.random() * 1.2),
        vy: -(5.5 + Math.random() * 1.8),
        gravity: 0.22,
        size: 22,
        rot: isLeft ? -0.5 : 0.5,
        waterLine: this.waterY + 10
      };
      // Initial jump ripple
      this.createRipple(startX, this.waterY + 10, 1.2);
    }

    // Update leaping fish
    if (this.leapingFish) {
      const f = this.leapingFish;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.vy += f.gravity * dt;
      f.rot = Math.atan2(f.vy, f.vx * 1.5);

      if (f.vy > 0 && f.y >= f.waterLine) {
        // Splashed back down into the river!
        this.createRipple(f.x, f.waterLine, 1.6);
        this.leapingFish = null;
      }
    }

    // Update splash ripples
    for (let i = this.splashRipples.length - 1; i >= 0; i--) {
      const r = this.splashRipples[i];
      r.radius += 0.9 * dt;
      r.alpha -= 0.014 * dt;
      if (r.alpha <= 0) {
        this.splashRipples.splice(i, 1);
      }
    }

    // Update floating hyacinths
    for (const h of this.hyacinths) {
      h.x += h.vx * dt;
      h.phase += 0.04 * dt;
      if (h.x < -60) {
        h.x = this.width + 50;
        h.y = this.waterY + 25 + Math.random() * (this.height - this.waterY - 50);
      }
    }

    // Update gliding birds
    for (const b of this.birds) {
      b.x += b.vx * dt;
      b.wingPhase += b.wingSpeed * dt;
      if (b.x > this.width + 100) {
        b.x = -80;
        b.y = 50 + Math.random() * (this.waterY * 0.5);
      }
    }

    // Update underwater fish
    for (const fish of this.fishPool) {
      fish.x += fish.vx * dt;
      fish.phase += 0.08 * dt;
      if (fish.vx > 0 && fish.x > this.width + 60) fish.x = -60;
      if (fish.vx < 0 && fish.x < -60) fish.x = this.width + 60;
    }

    // Update mist
    for (const m of this.mistParticles) {
      m.x += m.vx * dt;
      if (m.x < -80) m.x = this.width + 60;
    }
  }

  createRipple(x, y, scale = 1.0) {
    this.splashRipples.push({
      x,
      y,
      radius: 4,
      scale,
      alpha: 0.85
    });
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.width;
    const h = this.height;
    const wy = this.waterY;

    ctx.clearRect(0, 0, w, h);

    // 1. SKY GRADIENT (Misty Golden River Dawn / Twilight)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, wy);
    skyGrad.addColorStop(0, '#06202a');    // Deep river indigo-cyan
    skyGrad.addColorStop(0.5, '#0b3b44');  // Atmospheric teal
    skyGrad.addColorStop(0.82, '#b45309'); // Warm dawn terracotta
    skyGrad.addColorStop(1, '#f59e0b');    // Golden river horizon glow
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, wy);

    // 2. SUN & HORIZON GLOW
    const sunX = w * 0.68;
    const sunY = wy - 18;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 140);
    sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    sunGlow.addColorStop(0.25, 'rgba(245, 158, 11, 0.6)');
    sunGlow.addColorStop(0.6, 'rgba(217, 119, 6, 0.2)');
    sunGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 140, 0, Math.PI * 2);
    ctx.fill();

    // 3. PARALLAX RIVERBANKS (নদীর ওপার - গ্রাম ও কাশবনের আবছা রূপরেখা)
    this.drawParallaxShoreline(ctx, wy, this.shorelineX);

    // 4. FLYING BIRDS IN THE DAWN SKY (মাঠের বক)
    this.drawBirds(ctx);

    // 5. RIVER WATER BASE & DEPTH GRADIENT
    const waterGrad = ctx.createLinearGradient(0, wy, 0, h);
    waterGrad.addColorStop(0, '#0d5d56');   // Golden reflective teal surface
    waterGrad.addColorStop(0.18, '#064e3b'); // Emerald current
    waterGrad.addColorStop(0.55, '#022c22'); // Deep aquatic depths
    waterGrad.addColorStop(1, '#021814');    // Riverbed shadow
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, wy, w, h - wy);

    // 6. SUNLIGHT WATER REFLECTION COLUMN (নদীর জলে সূর্যের ঝিলমিল)
    this.drawWaterReflections(ctx, sunX, wy, h);

    // 7. UNDERWATER SWIMMING FISH SHADOWS
    this.drawUnderwaterFish(ctx);

    // 8. DYNAMIC FLOWING RIVER WAVES (৪ স্তরের চলমান ঢেউ)
    this.drawRiverWaves(ctx, wy, w, h);

    // 9. ANIMATED WOODEN DINGHY BOAT & OARSMAN (ডিঙি নৌকা ও মাঝি)
    this.drawDinghyBoat(ctx, this.boat);

    // 10. LEAPING SILVER FISH & SPLASH RIPPLES
    this.drawLeapingFish(ctx);
    this.drawRipples(ctx);

    // 11. DRIFTING WATER HYACINTH CLUMPS (কচুরিপানা ও শাপলা)
    this.drawWaterHyacinths(ctx);

    // 12. FLOATING RIVER MIST (ভোরের নদীর কুয়াশা)
    this.drawMist(ctx);

    // 13. FOREGROUND RIVER JETTY POSTS (নদীর ঘাটের খুঁটি ও দড়ি)
    this.drawGhatPosts(ctx, w, h);
  }

  // Draw Parallax Village Silhouette on distant riverbank
  drawParallaxShoreline(ctx, wy, shiftX) {
    const tileW = 960;
    const startX = (shiftX % tileW) - tileW;
    ctx.save();
    ctx.fillStyle = '#062822'; // Deep silhouette
    ctx.globalAlpha = 0.88;

    for (let offset = startX; offset < this.width + tileW; offset += tileW) {
      ctx.beginPath();
      ctx.moveTo(offset, wy);

      // Low village riverbank contour with palm trees
      ctx.quadraticCurveTo(offset + 120, wy - 18, offset + 260, wy - 8);
      ctx.quadraticCurveTo(offset + 380, wy - 26, offset + 520, wy - 12);
      ctx.quadraticCurveTo(offset + 680, wy - 22, offset + 820, wy - 10);
      ctx.lineTo(offset + tileW, wy);
      ctx.lineTo(offset, wy);
      ctx.fill();

      // Silhouettes of Coconut / Palm Trees & Reeds (তাল গাছ ও বাঁশবন)
      this.drawPalmTree(ctx, offset + 180, wy - 14, 0.65);
      this.drawPalmTree(ctx, offset + 215, wy - 12, 0.5);
      this.drawPalmTree(ctx, offset + 480, wy - 18, 0.7);
      this.drawPalmTree(ctx, offset + 750, wy - 15, 0.58);
      this.drawBambooCluster(ctx, offset + 340, wy - 16);
      this.drawBambooCluster(ctx, offset + 620, wy - 14);
    }
    ctx.restore();
  }

  drawPalmTree(ctx, x, y, scale = 0.6) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#041d18';

    // Trunk
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.quadraticCurveTo(6, -30, 2, -60);
    ctx.lineTo(-2, -60);
    ctx.quadraticCurveTo(2, -30, -5, 0);
    ctx.fill();

    // Palm fronds radiating out
    for (let a = -1.1; a <= 1.1; a += 0.35) {
      ctx.save();
      ctx.translate(0, -60);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(22, -10, 36, 12);
      ctx.quadraticCurveTo(18, 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  drawBambooCluster(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#05221c';
    for (let i = -12; i <= 12; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.quadraticCurveTo(i * 1.5, -24, i * 2, -38);
      ctx.lineTo(i * 2 + 1.5, -38);
      ctx.quadraticCurveTo(i * 1.5 + 1.5, -24, i + 2, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw Flying Egrets / Birds (মাঠের বক)
  drawBirds(ctx) {
    ctx.save();
    ctx.fillStyle = '#f8fafc';
    for (const b of this.birds) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.scale, b.scale);
      ctx.globalAlpha = 0.85;

      const wingY = Math.sin(b.wingPhase) * 6;
      ctx.beginPath();
      // Body
      ctx.ellipse(0, 0, 8, 2.5, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Wing flaps
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.quadraticCurveTo(2, -10 + wingY, 12, -4 + wingY * 0.7);
      ctx.quadraticCurveTo(5, -2, -2, 0);
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  // Sunlight reflection column shimmering across the water
  drawWaterReflections(ctx, sunX, wy, h) {
    ctx.save();
    const rows = 14;
    for (let i = 0; i < rows; i++) {
      const y = wy + (i / rows) * (h - wy) * 0.75;
      const spread = 20 + i * 16;
      const waveShift = Math.sin(this.time * 2 + i * 0.7) * (6 + i * 1.5);
      const alpha = Math.max(0, 0.35 - (i / rows) * 0.3);

      ctx.fillStyle = `rgba(254, 240, 138, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(sunX + waveShift, y, spread, 2.5 + i * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 4-layer animated flowing river waves
  drawRiverWaves(ctx, wy, w, h) {
    ctx.save();
    const waveLayers = [
      { y: wy + 16, color: 'rgba(20, 184, 166, 0.28)', speed: 1.2, freq: 0.012, amp: 5 },
      { y: wy + 42, color: 'rgba(13, 148, 136, 0.35)', speed: 1.8, freq: 0.009, amp: 7 },
      { y: wy + 85, color: 'rgba(15, 118, 110, 0.45)', speed: 2.4, freq: 0.007, amp: 9 },
      { y: wy + 145, color: 'rgba(4, 47, 46, 0.55)', speed: 3.1, freq: 0.005, amp: 12 }
    ];

    for (const wave of waveLayers) {
      ctx.fillStyle = wave.color;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, wave.y);

      for (let x = 0; x <= w; x += 25) {
        const yOffset = Math.sin(x * wave.freq + this.time * wave.speed) * wave.amp +
                        Math.cos(x * wave.freq * 0.5 - this.time * 0.8) * (wave.amp * 0.35);
        ctx.lineTo(x, wave.y + yOffset);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }

    // Shimmering foam lines on wave peaks
    ctx.strokeStyle = 'rgba(204, 251, 241, 0.35)';
    ctx.lineWidth = 1.2;
    for (let j = 0; j < 3; j++) {
      const foamY = wy + 30 + j * 45;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 30) {
        const yOffset = Math.sin(x * 0.01 + this.time * 2.2 + j) * 6;
        if (x === 0) ctx.moveTo(x, foamY + yOffset);
        else ctx.lineTo(x, foamY + yOffset);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Wooden country dinghy boat (ডিঙি নৌকা ও মাঝি)
  drawDinghyBoat(ctx, boat) {
    ctx.save();
    ctx.translate(boat.x, boat.y);
    ctx.rotate(boat.angle);

    // Boat shadow on the water
    ctx.fillStyle = 'rgba(2, 44, 34, 0.65)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 75, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Curved Teak Hull of Dinghy Boat
    ctx.fillStyle = '#291809'; // Rich dark wood
    ctx.beginPath();
    ctx.moveTo(-75, -4);
    ctx.quadraticCurveTo(-35, 22, 0, 22);
    ctx.quadraticCurveTo(35, 22, 82, -8); // Raised curved prow (মাথার গলুই)
    ctx.quadraticCurveTo(30, 10, 0, 10);
    ctx.quadraticCurveTo(-35, 10, -75, -4);
    ctx.closePath();
    ctx.fill();

    // Golden Brass / Oiled Wood Accent line along the gunwale
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Inner Hull Plank Shadow
    ctx.fillStyle = '#1c1006';
    ctx.beginPath();
    ctx.moveTo(-70, -2);
    ctx.quadraticCurveTo(0, 12, 75, -5);
    ctx.quadraticCurveTo(0, 8, -70, -2);
    ctx.fill();

    // Bamboo Canopy (নৌকার ছই - Woven Chhoi)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(-10, -1, 26, Math.PI, 0, false);
    ctx.fill();

    // Bamboo Weave Lines on Chhoi
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.2;
    for (let r = 12; r <= 24; r += 6) {
      ctx.beginPath();
      ctx.arc(-10, -1, r, Math.PI, 0, false);
      ctx.stroke();
    }

    // Fisherman Silhouette (বসা মাঝি ও বইঠা)
    ctx.fillStyle = '#111827';
    // Body & Gamchha turban (মাঝির মাথা ও গামছা)
    ctx.beginPath();
    ctx.arc(38, -18, 7, 0, Math.PI * 2); // Head
    ctx.fill();
    // Gamchha tied ribbon tail
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(34, -16);
    ctx.lineTo(26, -13);
    ctx.stroke();

    // Torso
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.moveTo(33, -11);
    ctx.lineTo(43, -11);
    ctx.lineTo(46, 6);
    ctx.lineTo(31, 6);
    ctx.closePath();
    ctx.fill();

    // Bamboo Oar (বাঁশের বৈঠা) in motion
    ctx.save();
    ctx.translate(40, -4);
    ctx.rotate(boat.oarAngle);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.lineTo(16, 32);
    ctx.stroke();

    // Oar blade dipping in water
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(16, 30, 4, 10, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Lantern on the Boat Prow (নৌকার গলুইয়ের হারিকেন বাতি)
    const lanternX = 76;
    const lanternY = -12;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const lanternGlow = ctx.createRadialGradient(lanternX, lanternY, 1, lanternX, lanternY, 24);
    lanternGlow.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
    lanternGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = lanternGlow;
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Leaping silver fish in parabolic arc
  drawLeapingFish(ctx) {
    if (!this.leapingFish) return;
    const f = this.leapingFish;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);

    // Glistening Silver Fish Body (রূপালি ইলিশ)
    const fishGrad = ctx.createLinearGradient(-f.size * 0.5, 0, f.size * 0.5, 0);
    fishGrad.addColorStop(0, '#f8fafc');
    fishGrad.addColorStop(0.4, '#38bdf8');
    fishGrad.addColorStop(0.8, '#fef08a');
    fishGrad.addColorStop(1, '#94a3b8');

    ctx.fillStyle = fishGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, f.size * 0.5, f.size * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail Fin
    ctx.beginPath();
    ctx.moveTo(-f.size * 0.45, 0);
    ctx.lineTo(-f.size * 0.75, -f.size * 0.25);
    ctx.lineTo(-f.size * 0.65, 0);
    ctx.lineTo(-f.size * 0.75, f.size * 0.25);
    ctx.closePath();
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    // Eye glint
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(f.size * 0.32, -2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawRipples(ctx) {
    ctx.save();
    for (const r of this.splashRipples) {
      ctx.strokeStyle = `rgba(204, 251, 241, ${r.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radius * r.scale * 1.8, r.radius * r.scale * 0.65, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Floating Water Hyacinth & Water Lilies (কচুরিপানা ও শাপলা)
  drawWaterHyacinths(ctx) {
    ctx.save();
    for (const h of this.hyacinths) {
      const bobY = h.y + Math.sin(h.phase) * 3;
      ctx.save();
      ctx.translate(h.x, bobY);
      ctx.scale(h.scale, h.scale);

      // Clump of rounded green leaves
      ctx.fillStyle = '#15803d';
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * 9, Math.sin(ang) * 5, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lighter leaf center
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      // Violet-lavender Hyacinth Flower (কচুরিপানার ফুল)
      if (h.hasFlower) {
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(0, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047'; // Yellow honey spot
        ctx.beginPath();
        ctx.arc(0, -6, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // Underwater swimming fish shadows
  drawUnderwaterFish(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (const f of this.fishPool) {
      const bobY = f.y + Math.sin(f.phase) * 5;
      ctx.save();
      ctx.translate(f.x, bobY);
      if (f.vx < 0) ctx.scale(-1, 1);

      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size * 0.5, f.size * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-f.size * 0.45, 0);
      ctx.lineTo(-f.size * 0.7, -f.size * 0.2);
      ctx.lineTo(-f.size * 0.7, f.size * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  // Gentle river mist particles
  drawMist(ctx) {
    ctx.save();
    for (const m of this.mistParticles) {
      const mistGrad = ctx.createRadialGradient(m.x, m.y, 2, m.x, m.y, m.size);
      mistGrad.addColorStop(0, `rgba(204, 251, 241, ${m.alpha})`);
      mistGrad.addColorStop(1, 'rgba(204, 251, 241, 0)');
      ctx.fillStyle = mistGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Foreground Ghat posts (নদীর ঘাটের খুঁটি) on the bottom right
  drawGhatPosts(ctx, w, h) {
    ctx.save();
    const postX = w - 85;
    const postY = h - 160;

    // Wooden post 1
    ctx.fillStyle = '#1e1108';
    ctx.fillRect(postX, postY, 18, 160);
    // Rope tied around post
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(postX - 2, postY + 30);
    ctx.lineTo(postX + 20, postY + 30);
    ctx.moveTo(postX - 2, postY + 40);
    ctx.lineTo(postX + 20, postY + 40);
    ctx.stroke();

    // Wooden post 2 (shorter)
    ctx.fillStyle = '#291809';
    ctx.fillRect(postX + 32, postY + 35, 16, 125);
    ctx.restore();
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
  }
}
