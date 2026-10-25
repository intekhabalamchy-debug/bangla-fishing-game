// 16-Bit Retro Pixel-Art Sprite Generator for Bangladeshi Native Fish
// Generates crisp, authentic pixel sprites on high-definition micro-canvases

const spriteCache = new Map();

export function getFishSpriteDataUrl(fishId, isSilhouette = false, scale = 3) {
  const cacheKey = `${fishId}_${isSilhouette ? 'sil' : 'color'}_${scale}`;
  if (spriteCache.has(cacheKey)) {
    return spriteCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  const w = 48;
  const h = 28;
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Draw pixel fish based on species id
  drawSpeciesPixels(ctx, fishId, isSilhouette, scale);

  const dataUrl = canvas.toDataURL();
  spriteCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function drawSpeciesPixels(ctx, id, isSilhouette, s) {
  const px = (x, y, color) => {
    ctx.fillStyle = isSilhouette ? '#1e293b' : color;
    ctx.fillRect(x * s, y * s, s, s);
  };

  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = isSilhouette ? '#1e293b' : color;
    ctx.fillRect(x * s, y * s, w * s, h * s);
  };

  switch (id) {
    case 'ilish': // Royal Hilsa: Deep silver diamond body, iridescent bluish-teal back, yellow tint, fork tail
      // Back teal
      rect(14, 8, 16, 2, '#0f766e');
      rect(11, 10, 22, 2, '#14b8a6');
      rect(9, 12, 26, 2, '#5eead4');
      // Deep silver belly
      rect(8, 14, 28, 4, '#f8fafc');
      rect(10, 18, 24, 3, '#e2e8f0');
      rect(14, 21, 16, 2, '#cbd5e1');
      // Golden iridescent belly sheen
      rect(13, 16, 12, 2, '#fef08a');
      // Dorsal fin
      rect(19, 5, 6, 3, '#0d9488');
      rect(21, 4, 3, 2, '#14b8a6');
      // Caudal fork tail
      rect(36, 12, 3, 5, '#94a3b8');
      rect(39, 9, 3, 4, '#64748b');
      rect(42, 6, 3, 4, '#475569');
      rect(39, 16, 3, 4, '#64748b');
      rect(42, 19, 3, 4, '#475569');
      // Pectoral / Pelvic fin
      rect(14, 19, 4, 2, '#cbd5e1');
      rect(26, 20, 5, 2, '#cbd5e1');
      // Gill spot (signature black spot behind gill)
      px(13, 13, isSilhouette ? '#1e293b' : '#334155');
      // Eye & mouth
      px(7, 13, isSilhouette ? '#1e293b' : '#020617');
      px(6, 13, isSilhouette ? '#1e293b' : '#ffffff');
      px(4, 14, isSilhouette ? '#1e293b' : '#475569');
      break;

    case 'rui': // Rohu Carp: Golden bronze scales, arching back, vermilion red-orange fins
      rect(13, 8, 17, 2, '#1e293b');
      rect(10, 10, 23, 3, '#78350f');
      rect(8, 13, 27, 4, '#d97706');
      rect(9, 17, 25, 3, '#f59e0b');
      rect(12, 20, 18, 2, '#fef3c7');
      // Scale checkerboard texture
      for (let x = 14; x <= 28; x += 3) {
        px(x, 14, isSilhouette ? '#1e293b' : '#b45309');
        px(x + 1, 16, isSilhouette ? '#1e293b' : '#b45309');
      }
      // Bright red fins (Signature Rui)
      rect(19, 5, 8, 3, '#dc2626');
      rect(21, 4, 4, 2, '#ef4444');
      // Red pelvic / anal fins
      rect(14, 20, 4, 3, '#dc2626');
      rect(26, 21, 5, 3, '#dc2626');
      // Tail
      rect(35, 13, 3, 4, '#b45309');
      rect(38, 10, 3, 4, '#dc2626');
      rect(41, 7, 3, 4, '#ef4444');
      rect(38, 16, 3, 4, '#dc2626');
      rect(41, 19, 3, 4, '#ef4444');
      // Eye & blunt snout
      px(7, 13, isSilhouette ? '#1e293b' : '#000000');
      px(6, 13, isSilhouette ? '#1e293b' : '#fef08a');
      px(4, 15, isSilhouette ? '#1e293b' : '#b45309');
      break;

    case 'katla': // Catla: Huge upturned head, deep grey-blue body, coppery scales
      // Massive head & deep body
      rect(6, 11, 10, 9, '#1e3a8a');
      rect(12, 7, 20, 3, '#1e40af');
      rect(10, 10, 24, 6, '#3b82f6');
      rect(11, 16, 22, 5, '#93c5fd');
      rect(14, 21, 16, 2, '#e0f2fe');
      // Upturned lower lip
      rect(3, 13, 4, 4, '#1d4ed8');
      rect(2, 12, 3, 2, '#60a5fa');
      // Dorsal
      rect(17, 4, 8, 4, '#1e3a8a');
      rect(19, 3, 4, 2, '#3b82f6');
      // Large dark tail
      rect(34, 13, 3, 4, '#1e40af');
      rect(37, 9, 4, 4, '#2563eb');
      rect(41, 6, 3, 4, '#3b82f6');
      rect(37, 17, 4, 4, '#2563eb');
      rect(41, 20, 3, 4, '#3b82f6');
      // Eye
      px(7, 11, isSilhouette ? '#1e293b' : '#000');
      px(6, 11, isSilhouette ? '#1e293b' : '#fef08a');
      break;

    case 'boal': // Freshwater Shark: Broad predatory mouth, olive-slate mottled, long barbels
      rect(5, 12, 13, 6, '#475569');
      rect(14, 10, 18, 5, '#334155');
      rect(13, 15, 20, 4, '#64748b');
      rect(28, 13, 9, 4, '#475569');
      // Wide grinning mouth
      rect(2, 15, 7, 2, '#0f172a');
      px(3, 14, isSilhouette ? '#1e293b' : '#ef4444');
      // Long predatory whiskers / barbels
      rect(5, 17, 2, 6, '#cbd5e1');
      rect(7, 23, 2, 4, '#cbd5e1');
      rect(5, 11, 2, 4, '#cbd5e1');
      // Sharp eyes
      px(6, 12, isSilhouette ? '#1e293b' : '#dc2626');
      px(7, 12, isSilhouette ? '#1e293b' : '#facc15');
      // Undulating anal tail fin
      rect(22, 19, 14, 2, '#334155');
      rect(37, 14, 4, 4, '#475569');
      break;

    case 'shol': // Giant Snakehead: Dark green mottled, golden lateral stripes, snake snout
      rect(4, 12, 9, 5, '#14532d');
      rect(10, 11, 24, 4, '#15803d');
      rect(9, 15, 26, 4, '#166534');
      rect(11, 19, 21, 2, '#fef08a');
      // Golden yellow blotch camouflage stripe
      for (let x = 12; x <= 30; x += 4) {
        rect(x, 13, 2, 2, '#facc15');
        rect(x + 2, 15, 2, 2, '#ca8a04');
      }
      // Long dorsal
      rect(14, 9, 18, 2, '#14532d');
      // Tail
      rect(35, 12, 4, 5, '#15803d');
      rect(39, 11, 3, 7, '#166534');
      // Fierce red eye
      px(6, 13, isSilhouette ? '#1e293b' : '#dc2626');
      px(5, 13, isSilhouette ? '#1e293b' : '#fef08a');
      break;

    case 'chitol': // Clown Knifefish: Humpback, undulating bottom fin, silver coin spots
      // Humpback rise
      rect(14, 7, 7, 4, '#475569');
      rect(10, 10, 18, 4, '#64748b');
      rect(8, 14, 24, 4, '#94a3b8');
      rect(10, 18, 24, 3, '#cbd5e1');
      // Continuous feather anal fin along bottom
      rect(15, 21, 20, 2, '#475569');
      // Row of silver coin spots along lower flank
      for (let x = 20; x <= 32; x += 3) {
        px(x, 18, isSilhouette ? '#1e293b' : '#0f172a');
        px(x, 17, isSilhouette ? '#1e293b' : '#ffffff');
      }
      // Small dorsal feather
      rect(17, 5, 2, 3, '#475569');
      // Pointed tail
      rect(34, 17, 4, 4, '#64748b');
      // Head & Eye
      rect(4, 14, 5, 4, '#64748b');
      px(6, 14, isSilhouette ? '#1e293b' : '#000');
      px(5, 14, isSilhouette ? '#1e293b' : '#38bdf8');
      break;

    case 'shing': // Stinging Catfish: Slender dark eel-catfish, red-tipped poison spine, 4 barbels
      rect(4, 13, 8, 4, '#1c1917');
      rect(10, 12, 24, 4, '#292524');
      rect(11, 16, 22, 2, '#44403c');
      // Long barbels
      rect(2, 12, 3, 1, '#78716c');
      rect(2, 16, 3, 1, '#78716c');
      rect(4, 17, 2, 5, '#78716c');
      // Poisonous sharp pectoral spine (red tipped danger barb)
      rect(11, 16, 5, 2, '#ef4444');
      // Tail
      rect(34, 13, 5, 3, '#1c1917');
      rect(39, 12, 3, 5, '#292524');
      // Eye
      px(6, 13, isSilhouette ? '#1e293b' : '#ef4444');
      break;

    case 'magur': // Walking Catfish: Thick dark body, yellow belly, whiskers
      rect(4, 12, 10, 6, '#1c1917');
      rect(11, 11, 21, 5, '#292524');
      rect(10, 16, 22, 4, '#44403c');
      rect(12, 20, 18, 2, '#ca8a04'); // Yellowish mud belly
      // Whiskers
      rect(2, 13, 3, 2, '#78716c');
      rect(3, 17, 2, 4, '#78716c');
      // Continuous dorsal
      rect(13, 9, 16, 2, '#1c1917');
      // Rounded tail fin
      rect(33, 13, 4, 5, '#292524');
      rect(37, 12, 4, 7, '#44403c');
      // Eye
      px(6, 13, isSilhouette ? '#1e293b' : '#facc15');
      break;

    case 'koi': // Climbing Perch: Compact spiny olive-green perch, gill spot
      rect(11, 9, 19, 3, '#3f6212');
      rect(9, 12, 23, 5, '#4d7c0f');
      rect(10, 17, 20, 4, '#65a30d');
      rect(13, 21, 14, 2, '#bef264');
      // Sharp spiny dorsal rays
      for (let x = 13; x <= 25; x += 2) {
        rect(x, 6, 1, 3, '#1a2e05');
      }
      // Dark blotch on gill
      px(14, 14, isSilhouette ? '#1e293b' : '#14532d');
      // Rounded tail
      rect(32, 13, 4, 4, '#3f6212');
      rect(36, 11, 4, 7, '#4d7c0f');
      // Orange eye
      px(7, 13, isSilhouette ? '#1e293b' : '#000');
      px(6, 13, isSilhouette ? '#1e293b' : '#ea580c');
      break;

    case 'puthi': // Swamp Barb: Small diamond barb, bright translucent orange fins, tail spot
      rect(14, 10, 12, 2, '#94a3b8');
      rect(12, 12, 16, 4, '#cbd5e1');
      rect(13, 16, 14, 3, '#f1f5f9');
      rect(15, 19, 10, 2, '#ffedd5');
      // Bright orange pelvic/dorsal fins
      rect(18, 7, 4, 3, '#ea580c');
      rect(17, 19, 3, 3, '#f97316');
      // Signature black spot near tail base
      px(27, 14, isSilhouette ? '#1e293b' : '#0f172a');
      // Tail
      rect(28, 13, 3, 2, '#cbd5e1');
      rect(31, 10, 3, 3, '#f97316');
      rect(31, 15, 3, 3, '#f97316');
      // Eye
      px(9, 13, isSilhouette ? '#1e293b' : '#000');
      px(8, 13, isSilhouette ? '#1e293b' : '#f97316');
      break;

    case 'pabda': // Butterfish: Silky translucent pinkish-silver body, delicate whiskers
      rect(7, 13, 9, 4, '#cbd5e1');
      rect(14, 12, 20, 3, '#e2e8f0');
      rect(12, 15, 23, 3, '#f8fafc');
      rect(15, 18, 18, 2, '#fce7f3'); // Rose blush belly
      // Tiny whisker
      rect(4, 12, 4, 1, '#f472b6');
      rect(5, 16, 3, 1, '#cbd5e1');
      // Translucent tail
      rect(35, 13, 3, 3, '#e2e8f0');
      rect(38, 11, 3, 3, '#f472b6');
      rect(38, 15, 3, 3, '#f472b6');
      // Eye
      px(8, 13, isSilhouette ? '#1e293b' : '#db2777');
      break;

    case 'pangas': // Giant River Catfish: Deep bullet body, slate grey back, white belly
      rect(10, 9, 21, 4, '#334155');
      rect(8, 13, 25, 5, '#475569');
      rect(9, 18, 23, 4, '#cbd5e1');
      rect(13, 22, 17, 2, '#f8fafc');
      // Dorsal shark-like fin
      rect(16, 5, 5, 4, '#1e293b');
      // Yellowish fin tips
      rect(14, 21, 4, 3, '#eab308');
      rect(24, 21, 5, 3, '#eab308');
      // Broad tail
      rect(33, 13, 4, 5, '#334155');
      rect(37, 9, 4, 5, '#475569');
      rect(37, 18, 4, 5, '#475569');
      // Eye
      px(6, 14, isSilhouette ? '#1e293b' : '#000');
      px(5, 14, isSilhouette ? '#1e293b' : '#eab308');
      break;

    case 'taki': // Spotted Snakehead: Compact mottled green-brown snakehead
      rect(6, 12, 8, 4, '#57534e');
      rect(11, 11, 20, 4, '#78716c');
      rect(10, 15, 22, 4, '#a8a29e');
      rect(13, 19, 17, 2, '#e7e5e4');
      // Dark chevron spots
      for (let x = 13; x <= 27; x += 4) {
        rect(x, 13, 2, 3, '#292524');
      }
      // Rounded tail
      rect(31, 13, 4, 4, '#57534e');
      rect(35, 12, 4, 6, '#78716c');
      // Eye
      px(7, 13, isSilhouette ? '#1e293b' : '#b91c1c');
      break;

    case 'ayr': // Long-whiskered Catfish: Golden olive river king, very long white whiskers
      rect(6, 12, 9, 5, '#4d7c0f');
      rect(12, 11, 21, 4, '#71717a');
      rect(10, 15, 24, 4, '#a1a1aa');
      rect(14, 19, 18, 2, '#fef08a');
      // Four pairs of long white trailing barbels
      rect(2, 11, 6, 1, '#ffffff');
      rect(2, 16, 6, 1, '#ffffff');
      rect(6, 17, 1, 8, '#ffffff');
      rect(8, 24, 6, 1, '#ffffff');
      // High dorsal & adipose fin
      rect(15, 6, 4, 5, '#3f3f46');
      rect(25, 9, 4, 2, '#4d7c0f');
      // Tail
      rect(34, 13, 4, 4, '#71717a');
      rect(38, 9, 4, 4, '#a1a1aa');
      rect(38, 17, 4, 4, '#a1a1aa');
      // Eye
      px(7, 13, isSilhouette ? '#1e293b' : '#000');
      px(6, 13, isSilhouette ? '#1e293b' : '#facc15');
      break;

    case 'kalbaush': // Black Rohu: Velvety deep charcoal & indigo scales, dark fins
      rect(13, 8, 17, 2, '#09090b');
      rect(10, 10, 23, 3, '#18181b');
      rect(8, 13, 27, 4, '#27272a');
      rect(9, 17, 25, 3, '#3f3f46');
      rect(12, 20, 18, 2, '#52525b');
      // Indigo violet sheen
      for (let x = 14; x <= 28; x += 3) {
        px(x, 14, isSilhouette ? '#1e293b' : '#581c87');
        px(x + 1, 16, isSilhouette ? '#1e293b' : '#3b0764');
      }
      // Velvety dark fins
      rect(19, 5, 7, 3, '#18181b');
      rect(14, 20, 4, 3, '#18181b');
      rect(26, 21, 5, 3, '#18181b');
      // Tail
      rect(35, 13, 3, 4, '#18181b');
      rect(38, 10, 3, 4, '#27272a');
      rect(41, 7, 3, 4, '#3f3f46');
      rect(38, 16, 3, 4, '#27272a');
      rect(41, 19, 3, 4, '#3f3f46');
      // Dark eye with gold ring
      px(7, 13, isSilhouette ? '#1e293b' : '#000');
      px(6, 13, isSilhouette ? '#1e293b' : '#ca8a04');
      break;

    case 'mola': // Mola Carplet: Small sparkling silver-emerald translucent schooler
      rect(13, 11, 14, 2, '#6ee7b7');
      rect(11, 13, 18, 3, '#a7f3d0');
      rect(12, 16, 16, 2, '#ecfdf5');
      // Dark lateral line
      for (let x = 12; x <= 26; x += 2) {
        px(x, 14, isSilhouette ? '#1e293b' : '#047857');
      }
      // Translucent dorsal & pelvic fin
      rect(18, 8, 3, 3, '#34d399');
      rect(16, 18, 3, 2, '#34d399');
      // Tail
      rect(29, 13, 3, 2, '#a7f3d0');
      rect(32, 11, 3, 3, '#34d399');
      rect(32, 15, 3, 3, '#34d399');
      // Big shiny eye
      px(8, 13, isSilhouette ? '#1e293b' : '#000');
      px(7, 13, isSilhouette ? '#1e293b' : '#34d399');
      break;

    case 'kakra': // Deshi Mud Crab: Round carapace with thorns, 2 crushing claws, 8 legs
      // Main shell (carapace)
      rect(16, 10, 16, 3, '#7c2d12');
      rect(14, 13, 20, 5, '#991b1b');
      rect(15, 18, 18, 3, '#b91c1c');
      rect(17, 21, 14, 2, '#ea580c');
      // Shell dorsal grooves
      rect(21, 13, 6, 2, '#450a0a');
      px(20, 15, isSilhouette ? '#1e293b' : '#f97316');
      px(27, 15, isSilhouette ? '#1e293b' : '#f97316');
      // Two massive crushing claws (Chelae)
      // Left claw
      rect(10, 8, 4, 3, '#b91c1c');
      rect(7, 6, 4, 4, '#ea580c');
      rect(5, 5, 3, 3, '#f97316');
      rect(5, 8, 3, 2, '#f97316');
      // Right claw
      rect(34, 8, 4, 3, '#b91c1c');
      rect(37, 6, 4, 4, '#ea580c');
      rect(40, 5, 3, 3, '#f97316');
      rect(40, 8, 3, 2, '#f97316');
      // Walking legs (8 legs)
      for (let i = 0; i < 4; i++) {
        // Left legs
        rect(12 - i * 2, 15 + i * 2, 3, 1, '#7c2d12');
        rect(9 - i * 2, 17 + i * 2, 2, 2, '#991b1b');
        // Right legs
        rect(33 + i * 2, 15 + i * 2, 3, 1, '#7c2d12');
        rect(37 + i * 2, 17 + i * 2, 2, 2, '#991b1b');
      }
      // Stalk eyes
      px(21, 8, isSilhouette ? '#1e293b' : '#000');
      px(21, 9, isSilhouette ? '#1e293b' : '#fef08a');
      px(26, 8, isSilhouette ? '#1e293b' : '#000');
      px(26, 9, isSilhouette ? '#1e293b' : '#fef08a');
      break;

    case 'galda_chingri': // Giant River Prawn: Long blue claws, segmented amber body, fan tail
      // Head & Cephalothorax with rostrum horn
      rect(10, 11, 10, 5, '#0284c7');
      rect(4, 9, 7, 2, '#0369a1'); // Rostrum serrated spear
      // Long sweeping antennae
      rect(2, 6, 5, 1, '#38bdf8');
      rect(2, 8, 4, 1, '#38bdf8');
      // Segmented curved prawn abdomen
      rect(19, 10, 4, 5, '#0284c7');
      rect(23, 11, 4, 5, '#0ea5e9');
      rect(27, 13, 4, 5, '#38bdf8');
      rect(31, 15, 4, 4, '#7dd3fc');
      // Uropod / Telson fan tail
      rect(35, 17, 3, 3, '#0284c7');
      rect(38, 16, 4, 2, '#0369a1');
      rect(38, 19, 4, 2, '#0369a1');
      // Signature long azure-blue pincer arms (Galda Chelae)
      rect(9, 16, 2, 4, '#0369a1');
      rect(7, 20, 2, 4, '#0284c7');
      rect(5, 23, 3, 2, '#38bdf8');
      rect(12, 16, 2, 5, '#0369a1');
      rect(14, 21, 2, 5, '#0284c7');
      rect(15, 25, 3, 2, '#38bdf8');
      // Walking pleopods swimmerets
      rect(21, 16, 2, 3, '#7dd3fc');
      rect(25, 17, 2, 3, '#7dd3fc');
      rect(29, 18, 2, 3, '#7dd3fc');
      // Eye
      px(9, 11, isSilhouette ? '#1e293b' : '#000');
      px(8, 11, isSilhouette ? '#1e293b' : '#fef08a');
      break;

    case 'tara_baim': // Zig-zag Spiny Eel: Long sinuous eel body, zigzag mud patterns, beak
      // Beak snout
      rect(3, 13, 4, 2, '#78716c');
      rect(7, 12, 10, 4, '#57534e');
      rect(16, 12, 22, 4, '#78716c');
      // Zigzag mud stripes
      for (let x = 10; x <= 34; x += 3) {
        px(x, 12, isSilhouette ? '#1e293b' : '#292524');
        px(x + 1, 14, isSilhouette ? '#1e293b' : '#ca8a04');
        px(x + 2, 13, isSilhouette ? '#1e293b' : '#292524');
      }
      // Continuous spiny comb along back
      for (let x = 14; x <= 36; x += 2) {
        px(x, 11, isSilhouette ? '#1e293b' : '#facc15');
      }
      // Tapering pointed tail
      rect(37, 13, 4, 2, '#57534e');
      rect(41, 13, 3, 1, '#ca8a04');
      // Eye
      px(5, 13, isSilhouette ? '#1e293b' : '#facc15');
      break;

    case 'gozar': // Great Snakehead: Colossal predator, leopard eye-rosettes, massive jaw
      // Heavy prehistoric head & jaw
      rect(3, 12, 10, 7, '#14532d');
      rect(2, 16, 6, 3, '#166534');
      rect(12, 10, 22, 6, '#15803d');
      rect(10, 16, 25, 5, '#166534');
      rect(13, 21, 20, 2, '#ca8a04');
      // Leopard-like camouflage ocelli (eye spots with yellow rings)
      const rosettes = [16, 22, 28, 33];
      rosettes.forEach((rx) => {
        rect(rx, 14, 3, 3, '#ca8a04');
        px(rx + 1, 15, isSilhouette ? '#1e293b' : '#052e16');
      });
      // Long spiked dorsal
      rect(15, 8, 18, 2, '#14532d');
      // Powerful caudal fin
      rect(35, 12, 4, 6, '#15803d');
      rect(39, 10, 4, 9, '#14532d');
      // Big fierce golden-red eye
      px(6, 13, isSilhouette ? '#1e293b' : '#dc2626');
      px(5, 13, isSilhouette ? '#1e293b' : '#fef08a');
      break;

    case 'frog': // Kola Bang: Chubby spotted green pond bullfrog, webbed legs, big eyes
      // Main rounded body
      rect(14, 11, 16, 8, '#15803d');
      rect(16, 9, 12, 3, '#16a34a');
      rect(16, 18, 12, 3, '#fef08a'); // Cream yellow belly
      // Dark spots
      px(17, 12, isSilhouette ? '#1e293b' : '#14532d');
      px(22, 13, isSilhouette ? '#1e293b' : '#14532d');
      px(19, 15, isSilhouette ? '#1e293b' : '#14532d');
      px(24, 16, isSilhouette ? '#1e293b' : '#14532d');
      // Folded muscular hind legs
      rect(28, 12, 4, 6, '#15803d');
      rect(31, 17, 4, 3, '#16a34a');
      rect(34, 19, 3, 2, '#4ade80');
      // Front arms
      rect(12, 16, 3, 4, '#15803d');
      rect(10, 19, 3, 2, '#4ade80');
      // Big bulbous frog eyes
      rect(13, 7, 4, 3, '#16a34a');
      px(14, 8, isSilhouette ? '#1e293b' : '#000000');
      px(13, 8, isSilhouette ? '#1e293b' : '#facc15');
      rect(22, 7, 4, 3, '#16a34a');
      px(23, 8, isSilhouette ? '#1e293b' : '#000000');
      px(22, 8, isSilhouette ? '#1e293b' : '#facc15');
      // Wide mouth
      rect(10, 13, 5, 2, '#14532d');
      break;

    case 'snake': // Joldhora Sap: Wavy checkered water snake with forked red tongue
      // Sinuous S-curved body
      rect(8, 13, 8, 3, '#78350f');
      rect(14, 11, 7, 3, '#854d0e');
      rect(19, 13, 8, 3, '#78350f');
      rect(25, 15, 8, 3, '#854d0e');
      rect(31, 13, 8, 3, '#78350f');
      rect(38, 14, 5, 2, '#854d0e');
      // Checkered yellow-brown belly scales
      for (let x = 9; x <= 37; x += 3) {
        px(x, 14, isSilhouette ? '#1e293b' : '#fef08a');
        px(x + 1, 12, isSilhouette ? '#1e293b' : '#451a03');
      }
      // Pointed snake head
      rect(4, 12, 5, 4, '#78350f');
      px(6, 12, isSilhouette ? '#1e293b' : '#000');
      px(5, 12, isSilhouette ? '#1e293b' : '#facc15');
      // Flicking red forked tongue
      rect(1, 14, 3, 1, '#ef4444');
      px(0, 13, isSilhouette ? '#1e293b' : '#ef4444');
      px(0, 15, isSilhouette ? '#1e293b' : '#ef4444');
      break;

    case 'tire': // Old Tire: Black rubber circle with algae slime and hub
      // Outer rubber ring
      rect(16, 7, 16, 3, '#18181b');
      rect(13, 10, 22, 3, '#27272a');
      rect(11, 13, 26, 6, '#18181b');
      rect(13, 19, 22, 3, '#27272a');
      rect(16, 22, 16, 3, '#18181b');
      // Tread notches
      for (let x = 14; x <= 32; x += 3) {
        px(x, 8, isSilhouette ? '#1e293b' : '#3f3f46');
        px(x, 23, isSilhouette ? '#1e293b' : '#3f3f46');
      }
      // Hollow center hub
      rect(19, 14, 10, 4, '#09090b');
      // Dripping green pond weed / algae
      rect(14, 21, 2, 4, '#15803d');
      rect(26, 22, 2, 5, '#166534');
      rect(30, 21, 3, 3, '#15803d');
      break;

    case 'sandal': // Chhera Sandal: Rubber flip-flop sole with broken V-strap
      // Sandal foam sole
      rect(12, 12, 24, 6, '#0284c7');
      rect(14, 10, 20, 3, '#0ea5e9');
      rect(14, 17, 20, 2, '#0369a1');
      // Broken red V-strap
      rect(18, 9, 3, 3, '#dc2626');
      rect(20, 7, 2, 3, '#ef4444');
      rect(23, 9, 4, 3, '#dc2626');
      // Toe post snap
      px(21, 6, isSilhouette ? '#1e293b' : '#ffffff');
      // Mud smear
      rect(28, 14, 4, 2, '#78350f');
      break;

    case 'shoe': // Muddy Boot: Waterlogged leather boot dripping river silt
      // Boot ankle shaft
      rect(15, 8, 8, 7, '#451a03');
      rect(16, 9, 2, 5, '#1c1917'); // Lace eyelets
      // Foot body & sole
      rect(15, 15, 18, 5, '#78350f');
      rect(13, 19, 21, 3, '#1c1917'); // Heavy rubber tread sole
      rect(13, 22, 5, 2, '#0c0a09');  // Raised heel
      // Mud drips
      rect(26, 17, 4, 3, '#292524');
      rect(18, 21, 3, 4, '#451a03');
      break;

    case 'plastic_bag': // Polythene Bag: Crinkled translucent white grocery sack with looped handles
      // Bag body
      rect(15, 10, 18, 10, '#f8fafc');
      rect(17, 9, 14, 12, '#e2e8f0');
      rect(18, 12, 12, 6, '#cbd5e1'); // Crinkle creases
      // Looped handles
      rect(11, 10, 5, 3, '#e2e8f0');
      rect(11, 16, 5, 3, '#e2e8f0');
      px(13, 11, isSilhouette ? '#1e293b' : '#94a3b8');
      px(13, 17, isSilhouette ? '#1e293b' : '#94a3b8');
      // Water weed entangled
      rect(22, 14, 2, 5, '#15803d');
      rect(29, 12, 3, 2, '#166534');
      break;

    case 'bhetki': // Barramundi / Sea Bass: Concave head, bronze-olive back, silvery flank, large jaw
      // Concave dorsal head contour & olive-bronze back
      rect(14, 8, 18, 3, '#374151');
      rect(12, 11, 22, 3, '#4b5563');
      // Silvery-bronze flank & belly
      rect(10, 14, 25, 4, '#9ca3af');
      rect(12, 18, 21, 3, '#d1d5db');
      rect(15, 21, 15, 2, '#f3f4f6');
      // Distinctive concave snout & jutting lower jaw
      rect(6, 15, 4, 3, '#374151');
      rect(5, 17, 5, 2, '#4b5563');
      // Two-part dorsal fin
      rect(17, 4, 6, 4, '#1f2937'); // Spiny first dorsal
      rect(25, 5, 8, 3, '#374151'); // Soft second dorsal
      // Broad rounded caudal fin
      rect(35, 13, 4, 6, '#4b5563');
      rect(39, 11, 4, 10, '#374151');
      // Ventral / anal fin
      rect(22, 23, 7, 3, '#6b7280');
      // Pectoral fin
      rect(14, 16, 5, 3, '#9ca3af');
      // Eye with bright bronze rim
      px(8, 13, isSilhouette ? '#1e293b' : '#f59e0b');
      px(9, 13, isSilhouette ? '#1e293b' : '#000000');
      break;

    case 'rupchanda': // Silver / Chinese Pomfret: Diamond disc shape, pearl silver, lavender iridescence
      // Deep diamond body top
      rect(18, 4, 10, 3, '#cbd5e1');
      rect(15, 7, 16, 3, '#e2e8f0');
      rect(12, 10, 22, 4, '#f8fafc');
      // Iridescent lavender sheen
      rect(14, 13, 16, 3, '#e9d5ff');
      // Lower diamond body
      rect(12, 16, 21, 4, '#f8fafc');
      rect(15, 20, 15, 3, '#e2e8f0');
      rect(18, 23, 9, 3, '#cbd5e1');
      // Sweeping long dorsal fin
      rect(17, 1, 4, 3, '#94a3b8');
      rect(21, 2, 7, 2, '#64748b');
      // Long sweeping anal fin
      rect(17, 26, 4, 3, '#94a3b8');
      rect(21, 25, 7, 2, '#64748b');
      // Deeply forked tail
      rect(34, 13, 3, 4, '#cbd5e1');
      rect(37, 9, 3, 4, '#94a3b8');
      rect(40, 6, 3, 4, '#64748b');
      rect(37, 17, 3, 4, '#94a3b8');
      rect(40, 20, 3, 4, '#64748b');
      // Tiny blunt snout and black pearl eye
      rect(9, 14, 3, 2, '#cbd5e1');
      px(11, 12, isSilhouette ? '#1e293b' : '#475569');
      px(12, 12, isSilhouette ? '#1e293b' : '#09090b');
      break;

    case 'bagda_chingri': // Giant Black Tiger Prawn: Segmented arched body, black & gold tiger stripes, blue legs
      // Arched prawn abdomen segments
      rect(13, 12, 5, 6, '#0f172a');
      rect(18, 9, 5, 7, '#f59e0b');
      rect(23, 10, 5, 6, '#0f172a');
      rect(28, 12, 4, 5, '#f59e0b');
      rect(32, 14, 4, 4, '#0f172a');
      // Cephalothorax (head shield)
      rect(8, 14, 6, 5, '#1e293b');
      rect(4, 13, 5, 2, '#d97706'); // Rostrum serrated spear
      px(3, 13, isSilhouette ? '#1e293b' : '#f59e0b');
      // Long sweeping antennae
      rect(1, 10, 4, 1, '#38bdf8');
      rect(0, 7, 3, 1, '#0284c7');
      // Tail fan (uropods & telson)
      rect(36, 13, 4, 3, '#f59e0b');
      rect(38, 11, 4, 3, '#0284c7');
      rect(38, 16, 4, 3, '#0284c7');
      // Slender blue walking periopods
      for (let legX = 10; legX <= 26; legX += 4) {
        px(legX, 19, isSilhouette ? '#1e293b' : '#38bdf8');
        px(legX - 1, 21, isSilhouette ? '#1e293b' : '#0284c7');
      }
      // Stalk eye
      px(7, 12, isSilhouette ? '#1e293b' : '#000000');
      break;

    case 'chewa': // Mangrove Mudskipper: Elongated grey-blue body, raised bulbous eyes, mud-walking fins
      // Slender mudskipper body
      rect(12, 14, 22, 5, '#334155');
      rect(14, 13, 18, 2, '#475569');
      rect(14, 19, 18, 2, '#1e293b');
      // Bulbous periscope eyes above head
      rect(8, 9, 4, 4, '#f8fafc');
      px(9, 10, isSilhouette ? '#1e293b' : '#0284c7');
      px(10, 10, isSilhouette ? '#1e293b' : '#000000');
      // Snout
      rect(6, 14, 6, 3, '#475569');
      // Mud-crawling front pectoral fin (angled down)
      rect(14, 17, 3, 5, '#64748b');
      rect(16, 21, 3, 2, '#0f172a');
      // Sail-like dorsal fin with blue spots
      rect(18, 8, 3, 5, '#0284c7');
      rect(21, 9, 6, 4, '#38bdf8');
      px(23, 10, isSilhouette ? '#1e293b' : '#ffffff');
      // Pointed caudal tail
      rect(34, 14, 4, 4, '#334155');
      rect(38, 15, 4, 2, '#1e293b');
      break;

    case 'sworna_boal': // Mythic Golden Boal: Radiant 24-karat gold body, emerald eye, golden whisker barbels
      // Massive radiant golden predatory back
      rect(12, 7, 24, 3, '#b45309');
      rect(10, 10, 27, 4, '#f59e0b');
      rect(8, 14, 29, 5, '#facc15');
      rect(9, 19, 27, 3, '#fef08a');
      rect(12, 22, 20, 2, '#ffffff');
      // Huge predatory jaw
      rect(4, 13, 6, 4, '#f59e0b');
      rect(3, 17, 7, 2, '#d97706');
      // Trailing golden sensory barbels
      rect(5, 12, 2, 2, '#fef08a');
      rect(2, 9, 3, 2, '#facc15');
      rect(0, 6, 2, 3, '#f59e0b');
      // Powerful golden caudal tail
      rect(37, 13, 4, 7, '#f59e0b');
      rect(41, 10, 4, 6, '#facc15');
      rect(41, 17, 4, 6, '#facc15');
      rect(45, 8, 2, 4, '#fef08a');
      rect(45, 21, 2, 4, '#fef08a');
      // Dorsal fin & glowing sparkles
      rect(20, 3, 5, 4, '#facc15');
      px(16, 5, isSilhouette ? '#1e293b' : '#ffffff');
      px(29, 6, isSilhouette ? '#1e293b' : '#ffffff');
      px(24, 16, isSilhouette ? '#1e293b' : '#ffffff');
      // Glowing emerald green eye
      px(7, 12, isSilhouette ? '#1e293b' : '#10b981');
      px(8, 12, isSilhouette ? '#1e293b' : '#064e3b');
      break;

    case 'kachhim': // Ganges Softshell Turtle: Leathery olive oval shell, extended tubular snout, webbed flippers
      // Leathery rounded oval shell
      rect(14, 9, 18, 3, '#3f6212');
      rect(12, 12, 22, 7, '#4d7c0f');
      rect(14, 19, 18, 3, '#365314');
      // Shell border / soft rim
      rect(11, 13, 2, 5, '#65a30d');
      rect(33, 13, 2, 5, '#65a30d');
      // Shell pattern markings
      px(18, 14, isSilhouette ? '#1e293b' : '#a16207');
      px(24, 14, isSilhouette ? '#1e293b' : '#a16207');
      px(21, 17, isSilhouette ? '#1e293b' : '#a16207');
      // Extended head with tubular snorkel snout
      rect(8, 13, 4, 4, '#65a30d');
      rect(4, 14, 4, 2, '#84cc16'); // Snorkel snout
      px(7, 13, isSilhouette ? '#1e293b' : '#000000'); // Eye
      // Front webbed flippers (paddling forward)
      rect(14, 6, 6, 3, '#65a30d');
      rect(12, 4, 4, 3, '#84cc16');
      rect(14, 22, 6, 3, '#65a30d');
      rect(12, 24, 4, 3, '#84cc16');
      // Rear flippers & stubby tail
      rect(31, 7, 4, 3, '#4d7c0f');
      rect(31, 21, 4, 3, '#4d7c0f');
      rect(34, 15, 3, 2, '#65a30d');
      break;

    default:
      // Generic fish fallback
      rect(10, 10, 24, 8, '#38bdf8');
      rect(34, 12, 4, 4, '#0284c7');
      rect(38, 9, 4, 10, '#0369a1');
      px(8, 13, isSilhouette ? '#1e293b' : '#000');
      break;
  }
}
