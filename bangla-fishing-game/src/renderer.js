// 16-Bit Retro Pixel-Art Canvas Renderer for Bangla Fishing Environments
export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.timeOfDay = 0.35; // 0: Dawn, 0.35: Afternoon, 0.75: Sunset, 0.95: Night
    this.timeSpeed = 0.00008; // smooth day/night cycle
    this.monsoonFlash = 0;
    this.waterTimer = 0;
    this.lilyPads = this.generateLilyPads();
  }

  generateLilyPads() {
    const pads = [];
    for (let i = 0; i < 9; i++) {
      pads.push({
        x: 180 + Math.random() * 700,
        y: 360 + Math.random() * 200,
        radius: 14 + Math.random() * 12,
        hasFlower: Math.random() > 0.45,
        offset: Math.random() * Math.PI * 2
      });
    }
    return pads;
  }

  getTimeName() {
    if (this.timeOfDay < 0.2) return { en: 'Dawn (ভোর)', bn: 'ভোরবেলা', isNight: false };
    if (this.timeOfDay < 0.7) return { en: 'Day (দুপুর)', bn: 'রোদঝরা দুপুর', isNight: false };
    if (this.timeOfDay < 0.85) return { en: 'Dusk (গোধূলি)', bn: 'মনোরম গোধূলি', isNight: false };
    return { en: 'Night (রাত)', bn: 'জোনাক জ্বলা রাত', isNight: true };
  }

  updateTime(delta = 1) {
    this.timeOfDay = (this.timeOfDay + this.timeSpeed * delta) % 1.0;
    this.waterTimer += 0.03 * delta;
    if (this.monsoonFlash > 0) this.monsoonFlash -= 0.05 * delta;
  }

  triggerLightning() {
    this.monsoonFlash = 0.8;
  }

  render(state, particles) {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Sky & Horizon
    this.drawSky(w, h, state.weather);

    // 2. Draw Distant Scenery based on Location
    if (state.location.id === 'pukur') {
      this.drawPukurBackground(w, h);
    } else if (state.location.id === 'haor') {
      this.drawHaorBackground(w, h);
    } else if (state.location.id === 'sundarbans') {
      this.drawSundarbansBackground(w, h, state);
    } else {
      this.drawPadmaBackground(w, h, state.boatUnlocked);
    }

    // 3. Draw Water Surface
    this.drawWaterSurface(w, h, state.location);

    // 4. Draw Swimming Fish Shadows (Underwater)
    this.drawFishShadows(state.activeFish);

    // 5. Draw Lily Pads and Kochuripana (Water Hyacinths)
    this.drawVegetation(state.location.id);

    // 5.5 Draw Surfacing Gangetic River Dolphin (পদ্মার শুশুক)
    if (state.dolphin && state.dolphin.active) {
      this.drawDolphinSurfacing(w, h, state.dolphin);
    }

    // 5.6 Draw Swimming Fishing Otter (সুন্দরবনের ভোঁদড়)
    if (state.otter && state.otter.active) {
      this.drawFishingOtter(w, h, state.otter);
    }

    // 6. Draw Mud Clouds & Under-water Particles
    particles.draw(ctx, w, h, this.getTimeName().isNight);

    // 7. Draw Minigame Specific Elements (Cast Net, Pollo, Bobber & Line)
    this.drawActiveTool(state);

    // 8. Draw Player Fisherman on Bank or in Water
    this.drawFisherman(state);

    // 9. Day/Night & Weather Lighting Filter
    this.drawLightingOverlay(w, h, state.weather);
  }

  drawSky(w, h, weather) {
    const { ctx } = this;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55);

    if (weather === 'rain' || weather === 'monsoon') {
      // Overcast Monsoon Grey-Indigo Sky
      skyGrad.addColorStop(0, '#2d3748');
      skyGrad.addColorStop(0.7, '#4a5568');
      skyGrad.addColorStop(1, '#718096');
    } else if (this.timeOfDay < 0.2) {
      // Dawn (Soft rose-gold)
      skyGrad.addColorStop(0, '#312e81');
      skyGrad.addColorStop(0.5, '#c084fc');
      skyGrad.addColorStop(1, '#fde047');
    } else if (this.timeOfDay < 0.7) {
      // Crisp Bengali Day Sky
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.7, '#7dd3fc');
      skyGrad.addColorStop(1, '#e0f2fe');
    } else if (this.timeOfDay < 0.85) {
      // Golden Sunset (Abir / Godhuli)
      skyGrad.addColorStop(0, '#4c1d95');
      skyGrad.addColorStop(0.4, '#e11d48');
      skyGrad.addColorStop(0.8, '#f97316');
      skyGrad.addColorStop(1, '#fef08a');
    } else {
      // Starlit Night
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.7, '#0f172a');
      skyGrad.addColorStop(1, '#1e293b');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.55);

    // Celestial body (Sun or Moon)
    if (weather !== 'rain' && weather !== 'monsoon') {
      if (this.timeOfDay >= 0.85 || this.timeOfDay < 0.15) {
        // Crescent Moon & Stars
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(w * 0.82, 70, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(w * 0.84, 66, 20, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Glowing Golden Sun
        const sunY = 50 + Math.sin(this.timeOfDay * Math.PI) * 40;
        ctx.beginPath();
        ctx.arc(w * 0.78, sunY, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 25;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  drawPukurBackground(w, h) {
    const { ctx } = this;
    const horizonY = h * 0.42;

    // Distant Bengali Village Treeline (Coconut, Betel Nut, Banyan)
    ctx.fillStyle = '#1e3a29';
    for (let x = 0; x < w; x += 45) {
      const treeH = 50 + Math.sin(x * 0.05) * 20;
      ctx.beginPath();
      ctx.arc(x + 20, horizonY - treeH * 0.6, 26, 0, Math.PI * 2);
      ctx.fill();
      // Coconut trunks
      if (x % 90 === 0) {
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + 20, horizonY);
        ctx.quadraticCurveTo(x + 25, horizonY - 40, x + 20, horizonY - treeH - 10);
        ctx.stroke();
      }
    }

    // Village Ghat Brick Steps & Bank
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(0, horizonY - 8, w * 0.28, 45);

    // Terracotta Pitcher (Kolshi) on Ghat steps
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(w * 0.22, horizonY + 12, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.22 - 4, horizonY - 1, 8, 4);

    // Lush green pond rim
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(w * 0.32, horizonY + 25);
    ctx.lineTo(w, horizonY + 10);
    ctx.lineTo(w, horizonY + 35);
    ctx.lineTo(0, horizonY + 35);
    ctx.fill();
  }

  drawHaorBackground(w, h) {
    const { ctx } = this;
    const horizonY = h * 0.40;

    // Distant misty Haor waterline & Flooded Hijal trees
    ctx.fillStyle = '#143834';
    ctx.fillRect(0, horizonY - 10, w, 18);

    // Flooded wetland trees with sprawling branches
    for (let i = 0; i < 7; i++) {
      const treeX = 80 + i * 140;
      ctx.fillStyle = '#0f2924';
      ctx.fillRect(treeX, horizonY - 45, 6, 45);
      ctx.beginPath();
      ctx.ellipse(treeX + 3, horizonY - 48, 28, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tall wetland Reeds (Kashful / Hogla) swaying along edges
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2.5;
    for (let r = 0; r < w; r += 16) {
      if (r < w * 0.35 || r > w * 0.75) {
        const sway = Math.sin(this.waterTimer + r) * 6;
        ctx.beginPath();
        ctx.moveTo(r, horizonY + 35);
        ctx.quadraticCurveTo(r + sway, horizonY - 15, r + sway * 1.5, horizonY - 45);
        ctx.stroke();
        // Reed fluffy white flower top
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.arc(r + sway * 1.5, horizonY - 48, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawPadmaBackground(w, h, boatUnlocked) {
    const { ctx } = this;
    const horizonY = h * 0.38;

    // Distant sandy Char (sandbar)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(w * 0.65, horizonY - 2, w * 0.35, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wooden Landing Jetty (Bamboo poles & planks)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, horizonY + 15, w * 0.25, 18);
    for (let p = 20; p < w * 0.24; p += 30) {
      ctx.fillRect(p, horizonY + 28, 8, 40);
    }

    // Moored Traditional Dinghi Nouka (Wooden Boat)
    const boatX = w * 0.34;
    const boatY = horizonY + 32 + Math.sin(this.waterTimer * 1.2) * 3;
    this.drawDinghiBoat(boatX, boatY, 1.0);
  }

  drawDinghiBoat(x, y, scale = 1.0) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Curved Wooden Hull
    ctx.fillStyle = '#291e13';
    ctx.beginPath();
    ctx.moveTo(-55, -8);
    ctx.quadraticCurveTo(0, 18, 55, -8);
    ctx.quadraticCurveTo(62, -14, 68, -18);
    ctx.lineTo(60, -8);
    ctx.quadraticCurveTo(0, 24, -65, -14);
    ctx.closePath();
    ctx.fill();

    // Bamboo Canopy (Chhoi)
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, -8, 22, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Oar (Boitha)
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(35, -5);
    ctx.lineTo(65, 20);
    ctx.stroke();

    ctx.restore();
  }

  drawSundarbansBackground(w, h, state) {
    const { ctx } = this;
    const horizonY = h * 0.40;

    // 1. Distant dense mangrove silhouette with mist
    ctx.fillStyle = '#062c20';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    for (let x = 0; x <= w; x += 40) {
      const treeH = 35 + Math.sin(x * 0.05) * 12 + Math.cos(x * 0.12) * 8;
      ctx.lineTo(x, horizonY - treeH);
    }
    ctx.lineTo(w, horizonY + 20);
    ctx.lineTo(0, horizonY + 20);
    ctx.closePath();
    ctx.fill();

    // 2. Dense Shundari (Heritiera fomes) & Keora canopy
    for (let i = 0; i < 9; i++) {
      const tx = 40 + i * 110 + Math.sin(i * 1.5) * 20;
      const ty = horizonY - 18;
      // Twisted gnarled mangrove trunk
      ctx.fillStyle = '#1c2826';
      ctx.beginPath();
      ctx.moveTo(tx - 6, ty + 25);
      ctx.quadraticCurveTo(tx + 4, ty - 15, tx - 2, ty - 50);
      ctx.quadraticCurveTo(tx - 8, ty - 15, tx - 12, ty + 25);
      ctx.fill();

      // Mangrove foliage domes
      ctx.fillStyle = i % 2 === 0 ? '#065f46' : '#047857';
      ctx.beginPath();
      ctx.arc(tx - 2, ty - 55, 30, 0, Math.PI * 2);
      ctx.arc(tx + 18, ty - 45, 24, 0, Math.PI * 2);
      ctx.arc(tx - 20, ty - 45, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2.5 Royal Bengal Tiger Eyes peering through the dark mangrove canopy
    if (state?.tigerEyes?.active) {
      const eyeX = w * 0.49;
      const eyeY = horizonY - 48;
      ctx.save();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fef08a';
      // Left eye
      ctx.beginPath();
      ctx.ellipse(eyeX - 10, eyeY, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Right eye
      ctx.beginPath();
      ctx.ellipse(eyeX + 10, eyeY, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Slit pupils
      ctx.fillStyle = '#000000';
      ctx.fillRect(eyeX - 10.5, eyeY - 2.5, 1.2, 5);
      ctx.fillRect(eyeX + 9.5, eyeY - 2.5, 1.2, 5);
      ctx.restore();
    }

    // 3. Golpata Palm clusters (Nypa fruticans) along the mud bank
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2.5;
    for (let g = 0; g < w; g += 90) {
      const gy = horizonY + 6;
      for (let f = -3; f <= 3; f++) {
        const angle = -Math.PI / 2 + f * 0.28;
        const len = 35 + Math.abs(f) * 4;
        ctx.beginPath();
        ctx.moveTo(g, gy);
        ctx.quadraticCurveTo(
          g + Math.cos(angle) * (len * 0.6) + f * 4,
          gy + Math.sin(angle) * (len * 0.6),
          g + Math.cos(angle) * len,
          gy + Math.sin(angle) * len + 5
        );
        ctx.stroke();
      }
    }

    // 4. Muddy silt tidal bank
    ctx.fillStyle = '#1e2922';
    ctx.beginPath();
    ctx.moveTo(0, horizonY + 5);
    ctx.quadraticCurveTo(w * 0.35, horizonY + 28, w * 0.7, horizonY + 12);
    ctx.lineTo(w, horizonY + 22);
    ctx.lineTo(w, horizonY + 42);
    ctx.lineTo(0, horizonY + 42);
    ctx.closePath();
    ctx.fill();

    // 5. Breathing roots (Pneumatophores / শ্বাসমূল) poking up from mud
    ctx.strokeStyle = '#3f4a3c';
    ctx.lineWidth = 2.0;
    for (let rx = 10; rx < w; rx += 14) {
      const rootBaseY = horizonY + 14 + Math.sin(rx * 0.08) * 6;
      const rootH = 12 + (rx % 7) * 2;
      ctx.beginPath();
      ctx.moveTo(rx, rootBaseY);
      ctx.lineTo(rx, rootBaseY - rootH);
      ctx.stroke();
      // Rounded tip
      ctx.fillStyle = '#6b7280';
      ctx.beginPath();
      ctx.arc(rx, rootBaseY - rootH, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Traditional Bawali woodcutter/fisherman canoe moored in the creek
    const canoeX = w * 0.82;
    const canoeY = horizonY + 36 + Math.sin(this.waterTimer * 0.9) * 2;
    this.drawDinghiBoat(canoeX, canoeY, 0.75);
  }

  drawFishingOtter(w, h, otter) {
    const { ctx } = this;
    const ox = otter.x;
    const oy = otter.y;
    const dir = otter.vx > 0 ? 1 : -1;

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(dir, 1);

    // Water V-wake ripples behind swimming otter
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-14, 2);
    ctx.lineTo(-34, -7);
    ctx.moveTo(-14, 2);
    ctx.lineTo(-34, 11);
    ctx.stroke();

    // Sleek Brown Otter Body (Lutrogale perspicillata)
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cream throat & belly
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(6, 2, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tapered muscular otter tail
    ctx.fillStyle = '#291e13';
    ctx.beginPath();
    ctx.moveTo(-14, -3);
    ctx.quadraticCurveTo(-24, -1, -32, 4);
    ctx.quadraticCurveTo(-22, 6, -14, 4);
    ctx.closePath();
    ctx.fill();

    // Rounded otter head
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(16, -2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Rounded ear
    ctx.fillStyle = '#291e13';
    ctx.beginPath();
    ctx.arc(13, -7, 2, 0, Math.PI * 2);
    ctx.fill();

    // Whiskered muzzle & nose
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(20, -1, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(22, -2, 1.5, 0, Math.PI * 2); // Black nose
    ctx.fill();
    ctx.beginPath();
    ctx.arc(17, -4, 1.2, 0, Math.PI * 2); // Dark alert eye
    ctx.fill();

    // Webbed front paw paddling
    const pawPaddle = Math.sin(this.waterTimer * 4) * 4;
    ctx.fillStyle = '#291e13';
    ctx.beginPath();
    ctx.ellipse(8, 6 + pawPaddle, 4, 3, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Glittering fish in mouth if herding
    if (otter.hasFish) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(24, 2, 6, 2.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(28, 1, 2, 2);
    }

    ctx.restore();

    // Playful indicator banner
    ctx.save();
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#fed7aa';
    ctx.fillText('🦦 পোষা ভোঁদড় (Fishing Otter)', ox, oy - 16);
    ctx.restore();
  }

  drawDolphinSurfacing(w, h, dolphin) {
    const { ctx } = this;
    const p = Math.max(0, Math.min(1, dolphin.progress));

    // Calculate arc motion
    const curX = dolphin.startX + (dolphin.endX - dolphin.startX) * p;
    const archH = Math.sin(p * Math.PI) * dolphin.jumpHeight;
    const curY = dolphin.waterY - archH;

    // Tangent angle along jump trajectory
    const dx = dolphin.endX - dolphin.startX;
    const dy = -Math.cos(p * Math.PI) * dolphin.jumpHeight * Math.PI;
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(angle);

    // Sacred golden aura glow around river dolphin
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sleek Ganges Dolphin Body (Platanista gangetica)
    // Characteristic dark slate-grey body
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lighter grey belly
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(2, 4, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Long slender rostrum (শুশুকের লম্বা চঞ্চু / beak)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(22, -2);
    ctx.lineTo(44, 1);
    ctx.lineTo(22, 4);
    ctx.closePath();
    ctx.fill();

    // Tiny dolphin eye
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(16, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Triangular dorsal hump (ridge characteristic of Ganges dolphin)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-6, -9);
    ctx.lineTo(2, -16);
    ctx.lineTo(8, -8);
    ctx.closePath();
    ctx.fill();

    // Paddle-like triangular pectoral flipper
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(6, 4);
    ctx.lineTo(14, 16);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();

    // Horizontal tail flukes (Caudal fin)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(-34, -12);
    ctx.lineTo(-30, 0);
    ctx.lineTo(-34, 12);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Water vapor puff / blowhole mist when near peak
    if (p >= 0.35 && p <= 0.65) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let s = 0; s < 5; s++) {
        const sprayX = curX + (Math.random() - 0.5) * 12;
        const sprayY = curY - 14 - Math.random() * 16;
        ctx.beginPath();
        ctx.arc(sprayX, sprayY, 2 + Math.random() * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Sacred floating blessing banner
    ctx.save();
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#fef08a';
    ctx.fillText('🐬 পদ্মার শুশুক (River Dolphin)', curX, curY - 32);
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('✨ নদী আশীর্বাদ (+50% Fast Bite)', curX, curY - 18);
    ctx.restore();
  }

  drawWaterSurface(w, h, location) {
    const { ctx } = this;
    const waterTop = h * 0.44;
    const waterH = h - waterTop;

    const grad = ctx.createLinearGradient(0, waterTop, 0, h);
    grad.addColorStop(0, location.waterColor);
    grad.addColorStop(1, '#052e16');

    ctx.fillStyle = grad;
    ctx.fillRect(0, waterTop, w, waterH);

    // Horizontal retro water wave shimmer lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    for (let y = waterTop + 20; y < h; y += 22) {
      const offset = Math.sin(this.waterTimer + y * 0.1) * 15;
      ctx.beginPath();
      ctx.moveTo(offset, y);
      ctx.lineTo(w + offset, y);
      ctx.stroke();
    }
  }

  drawFishShadows(fishList) {
    const { ctx } = this;
    for (const fish of fishList) {
      if (!fish.active) continue;
      ctx.save();
      ctx.translate(fish.x, fish.y);

      // Tail wag angle
      const wag = Math.sin(fish.phase) * 0.25;
      ctx.rotate(fish.angle + wag);

      // Shadow silhouette
      ctx.fillStyle = `rgba(15, 23, 42, ${0.45 + (fish.depth || 0) * 0.3})`;
      ctx.beginPath();
      // Fish body
      const len = fish.size;
      const wid = fish.size * 0.45;
      ctx.ellipse(0, 0, len, wid, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tail fin
      ctx.beginPath();
      ctx.moveTo(-len * 0.9, 0);
      ctx.lineTo(-len * 1.5, -wid * 0.9);
      ctx.lineTo(-len * 1.3, 0);
      ctx.lineTo(-len * 1.5, wid * 0.9);
      ctx.closePath();
      ctx.fill();

      // Dorsal/pectoral fin hints
      ctx.beginPath();
      ctx.ellipse(len * 0.1, -wid * 0.9, len * 0.25, wid * 0.4, 0.3, 0, Math.PI * 2);
      ctx.ellipse(len * 0.1, wid * 0.9, len * 0.25, wid * 0.4, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  drawVegetation(locId) {
    const { ctx } = this;

    // Sundarbans: floating mangrove propagules and brackish tidal foam
    if (locId === 'sundarbans') {
      for (const pad of this.lilyPads) {
        const drift = Math.sin(this.waterTimer * 0.8 + pad.offset) * 8;
        ctx.save();
        ctx.translate(pad.x + drift, pad.y);

        // Long torpedo mangrove seedling (propagule)
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 4, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(12, 4, 3, 0, Math.PI * 2); // sprouting bud
        ctx.fill();

        // Tidal brackish foam bubble cluster
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(-8, -4, 4, 0, Math.PI * 2);
        ctx.arc(-14, -2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      return;
    }

    for (const pad of this.lilyPads) {
      const bob = Math.sin(this.waterTimer + pad.offset) * 2;
      ctx.save();
      ctx.translate(pad.x, pad.y + bob);

      // Green Lily Pad with slit
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(0, 0, pad.radius, 0.25, Math.PI * 2 - 0.25);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Vein lines
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Shapla Flower (National White/Pink Water Lily)
      if (pad.hasFlower) {
        ctx.fillStyle = '#fdf4ff';
        for (let p = 0; p < 6; p++) {
          const angle = (p * Math.PI) / 3;
          ctx.beginPath();
          ctx.ellipse(Math.cos(angle) * 7, Math.sin(angle) * 7, 5, 2.5, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        // Golden pollen center
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  drawFisherman(state) {
    const { ctx } = this;
    const isWading = state.currentTool === 'pollo';
    // Position on dock/shore or wading in shallows
    const posX = isWading ? state.pollo.playerX : 90;
    const posY = isWading ? state.pollo.playerY : 260;

    ctx.save();
    ctx.translate(posX, posY);

    // Player Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 52, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Bengali Fisherman ("Shikari"):
    // Lungi (checkered wrapped cloth)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-10, 20, 20, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-8, 22, 16, 2);
    ctx.fillRect(-8, 34, 16, 2);

    // Bare skin torso (warm brown)
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(-9, -2, 18, 22);

    // Gamcha (red/white checkered towel draped over shoulder)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-10, -3, 6, 24);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-10, 4, 6, 2);

    // Head
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.arc(0, -12, 10, 0, Math.PI * 2);
    ctx.fill();

    // Gamcha headwrap / Tupi
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-9, -21, 18, 7);

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, -14, 3, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(3, -13, 2, 2);

    // Arm holding tool
    if (state.currentTool === 'borshi') {
      this.drawBorshiRod(ctx, state);
    } else if (state.currentTool === 'jhal') {
      this.drawJhalInHand(ctx, state);
    } else if (state.currentTool === 'pollo') {
      this.drawPolloInHand(ctx, state);
    }

    ctx.restore();
  }

  drawBorshiRod(ctx, state) {
    const isReeling = state.borshi.state === 'fighting';
    const isBending = isReeling && state.borshi.tension > 0.4;

    // Curved bamboo rod
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(5, 6);
    const tipX = 85;
    const tipY = isBending ? -25 : -65;
    ctx.quadraticCurveTo(45, isBending ? -55 : -75, tipX, tipY);
    ctx.stroke();

    // Fishing line from rod tip
    if (state.borshi.state === 'cast' || state.borshi.state === 'nibble' || state.borshi.state === 'fighting') {
      const bobberX = state.borshi.bobberX - 90;
      const bobberY = state.borshi.bobberY - 260;

      ctx.strokeStyle = state.borshi.tension > 0.85 ? '#ef4444' : 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(bobberX, bobberY);
      ctx.stroke();
    }
  }

  drawJhalInHand(ctx, state) {
    // Net bundled on shoulder / arm
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(10, 8, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawPolloInHand(ctx, state) {
    // Woven bamboo cage held down
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(6, 12);
    ctx.lineTo(24, 45);
    ctx.lineTo(-8, 45);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  drawActiveTool(state) {
    const { ctx } = this;

    // 1. Borshi Bobber
    if (state.currentTool === 'borshi' && (state.borshi.state === 'cast' || state.borshi.state === 'nibble' || state.borshi.state === 'fighting')) {
      const bx = state.borshi.bobberX;
      const by = state.borshi.bobberY + Math.sin(this.waterTimer * 2) * 2;
      const isNibble = state.borshi.state === 'nibble';
      const dip = isNibble ? 7 : 0;

      // Bobber red/white float
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(bx, by + dip, 5, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bx, by + dip, 5, 0, Math.PI);
      ctx.fill();

      // Center antenna quill
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx, by - 6 + dip);
      ctx.lineTo(bx, by + 4 + dip);
      ctx.stroke();

      if (isNibble) {
        // Exclamation / Bite prompt
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 18px monospace';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText('টান! (BITE!)', bx - 38, by - 24);
        ctx.shadowBlur = 0;
      }
    }

    // 2. Khep Jhal Aiming Reticle or in flight/water
    if (state.currentTool === 'jhal') {
      const netRadius = state.upgrades?.net === 'net_3' ? 85 : (state.upgrades?.net === 'net_2' ? 75 : 65);

      if (state.jhal.state === 'idle' || state.jhal.state === 'aiming') {
        const jx = state.jhal.targetX;
        const jy = state.jhal.targetY;
        const pulse = 1 + Math.sin(this.waterTimer * 4) * 0.05;
        const curR = netRadius * pulse;

        ctx.save();
        // Dashed net boundary
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = state.jhal.state === 'aiming' ? '#f59e0b' : 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(jx, jy, curR, curR * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target crosshair
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(jx - 8, jy);
        ctx.lineTo(jx + 8, jy);
        ctx.moveTo(jx, jy - 4);
        ctx.lineTo(jx, jy + 4);
        ctx.stroke();

        // Aiming guideline badge
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(state.jhal.state === 'aiming' ? 'নিক্ষেপ করুন (Release)' : '🎯 নিশানা (WASD / Click to Aim)', jx, jy - curR * 0.45 - 6);
        ctx.restore();
      } else if (state.jhal.state === 'throwing') {
        const jx = state.jhal.x;
        const jy = state.jhal.y;
        const r = state.jhal.radius;

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(jx, jy, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Net grid mesh pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          ctx.beginPath();
          ctx.moveTo(jx, jy);
          ctx.lineTo(jx + Math.cos(a) * r, jy + Math.sin(a) * (r * 0.45));
          ctx.stroke();
        }

        // Lead perimeter weights
        ctx.fillStyle = '#334155';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          ctx.beginPath();
          ctx.arc(jx + Math.cos(a) * r, jy + Math.sin(a) * (r * 0.45), 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 3. Pollo Plunge Basket Slammed
    if (state.currentTool === 'pollo' && state.pollo.state === 'trapped') {
      const px = state.pollo.targetX;
      const py = state.pollo.targetY;

      ctx.save();
      // Draw bamboo conical cage sticking out of water
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(px - 14, py - 40);
      ctx.lineTo(px + 14, py - 40);
      ctx.lineTo(px + 38, py + 15);
      ctx.lineTo(px - 38, py + 15);
      ctx.closePath();
      ctx.fill();

      // Bamboo lattice stripes
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      for (let ly = -30; ly <= 10; ly += 10) {
        ctx.beginPath();
        ctx.moveTo(px - 18 - ly * 0.5, py + ly);
        ctx.lineTo(px + 18 + ly * 0.5, py + ly);
        ctx.stroke();
      }

      // Hands grabbing indicator
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('ধরে ফেলুন! (GRAB!)', px - 45, py - 52);
      ctx.restore();
    }
  }

  drawLightingOverlay(w, h, weather) {
    const { ctx } = this;
    ctx.save();

    // Lightning Flash
    if (this.monsoonFlash > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.monsoonFlash})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Night tint
    if (this.timeOfDay > 0.85 || this.timeOfDay < 0.15) {
      const nightIntensity = this.timeOfDay > 0.85 
        ? ((this.timeOfDay - 0.85) / 0.15) * 0.55
        : (1 - this.timeOfDay / 0.15) * 0.55;

      ctx.fillStyle = `rgba(10, 15, 35, ${nightIntensity})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Sunset Warm Amber Tint
    if (this.timeOfDay >= 0.7 && this.timeOfDay <= 0.85) {
      const sunsetIntensity = Math.sin(((this.timeOfDay - 0.7) / 0.15) * Math.PI) * 0.28;
      ctx.fillStyle = `rgba(249, 115, 22, ${sunsetIntensity})`;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }
}
