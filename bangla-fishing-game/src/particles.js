// Particle Engine for Water Ripples, Splashes, Rain, Mud Clouds & Fireflies
export class ParticleSystem {
  constructor() {
    this.ripples = [];
    this.splashes = [];
    this.rainDrops = [];
    this.mudClouds = [];
    this.bubbles = [];
    this.fireflies = [];
    this.floatingTexts = [];
    this.initFireflies(25);
  }

  initFireflies(count = 25) {
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * 1200,
        y: 100 + Math.random() * 400,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 2
      });
    }
  }

  addRipple(x, y, maxRadius = 35, color = 'rgba(255, 255, 255, 0.4)') {
    this.ripples.push({
      x,
      y,
      radius: 2,
      maxRadius,
      alpha: 0.8,
      speed: 0.8 + Math.random() * 0.4,
      color
    });
  }

  addSplash(x, y, count = 12, color = '#bae6fd') {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      this.splashes.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle)) * speed - 1.2,
        gravity: 0.18,
        size: 2 + Math.random() * 2.5,
        alpha: 1.0,
        color
      });
    }
    this.addRipple(x, y, 40);
  }

  addMudCloud(x, y, radius = 22) {
    for (let i = 0; i < 4; i++) {
      this.mudClouds.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 10,
        radius: 8 + Math.random() * radius,
        maxRadius: radius * 1.5,
        alpha: 0.65,
        growth: 0.4 + Math.random() * 0.3,
        color: Math.random() > 0.5 ? 'rgba(74, 52, 33, ' : 'rgba(56, 41, 28, '
      });
    }
  }

  addBubble(x, y) {
    this.bubbles.push({
      x: x + (Math.random() - 0.5) * 12,
      y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.6 - Math.random() * 0.8,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.75,
      life: 0,
      maxLife: 40 + Math.random() * 30
    });
  }

  addFloatingText(text, x, y, color = '#fef08a') {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.0,
      alpha: 1.0,
      color
    });
  }

  update(width, height, isRaining = false, isNight = false) {
    // 1. Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);
      if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
        this.ripples.splice(i, 1);
      }
    }

    // 2. Splashes
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const s = this.splashes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += s.gravity;
      s.alpha -= 0.025;
      if (s.alpha <= 0) {
        this.splashes.splice(i, 1);
      }
    }

    // 3. Mud Clouds (Pollo wading)
    for (let i = this.mudClouds.length - 1; i >= 0; i--) {
      const m = this.mudClouds[i];
      m.radius += m.growth;
      m.alpha -= 0.008;
      if (m.alpha <= 0 || m.radius >= m.maxRadius) {
        this.mudClouds.splice(i, 1);
      }
    }

    // 4. Bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life++;
      if (b.life >= b.maxLife) {
        this.addRipple(b.x, b.y, 8, 'rgba(255,255,255,0.3)');
        this.bubbles.splice(i, 1);
      }
    }

    // 5. Rain Drops
    if (isRaining) {
      const spawnCount = 6;
      for (let i = 0; i < spawnCount; i++) {
        this.rainDrops.push({
          x: Math.random() * width,
          y: -10,
          vx: -1.2,
          vy: 11 + Math.random() * 4,
          len: 12 + Math.random() * 8,
          alpha: 0.6 + Math.random() * 0.3
        });
      }
    }
    for (let i = this.rainDrops.length - 1; i >= 0; i--) {
      const d = this.rainDrops[i];
      d.x += d.vx;
      d.y += d.vy;
      if (d.y > height * 0.65 + Math.random() * 60) {
        this.addRipple(d.x, d.y, 14, 'rgba(255, 255, 255, 0.25)');
        this.rainDrops.splice(i, 1);
      }
    }

    // 6. Fireflies (Evening & Night)
    if (isNight) {
      for (const f of this.fireflies) {
        f.phase += 0.04;
        f.x += f.vx + Math.sin(f.phase) * 0.3;
        f.y += f.vy + Math.cos(f.phase * 0.8) * 0.3;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < height * 0.3) f.y = height * 0.3;
        if (f.y > height * 0.85) f.y = height * 0.85;
      }
    }

    // 7. Floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.alpha -= 0.02;
      if (t.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  draw(ctx, width, height, isNight = false) {
    ctx.save();

    // Draw Mud Clouds (underwater bottom layer)
    for (const m of this.mudClouds) {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fillStyle = m.color + m.alpha + ')';
      ctx.fill();
    }

    // Draw Ripples
    for (const r of this.ripples) {
      ctx.beginPath();
      // Draw oval ripple for 2.5D perspective
      ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.42, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.5})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // Draw Bubbles
    for (const b of this.bubbles) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(224, 242, 254, ${b.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.4})`;
      ctx.fill();
    }

    // Draw Splashes
    for (const s of this.splashes) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Draw Rain Drops
    for (const d of this.rainDrops) {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.vx * 1.5, d.y + d.len);
      ctx.strokeStyle = `rgba(203, 213, 225, ${d.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Draw Fireflies
    if (isNight) {
      for (const f of this.fireflies) {
        const glow = 0.5 + 0.5 * Math.sin(f.phase);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * (1 + glow * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163, 230, 53, ${glow * 0.85})`;
        ctx.shadowColor = '#a3e635';
        ctx.shadowBlur = 8 * glow;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    // Draw Floating Text (Taka, Catch alerts)
    for (const t of this.floatingTexts) {
      ctx.save();
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillStyle = t.color;
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }

    ctx.restore();
  }
}
