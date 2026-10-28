// Procedural Web Audio 16-Bit Chiptune & Bengali Folk Ambient Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.ambientGain = null;
    this.isMuted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicTimer = null;
    this.ambientNoiseNode = null;
    this.currentAmbientMode = null;
    this.currentTrackIndex = 0;
    this.radioTracks = [
      { id: 'mon_majhi', nameBn: 'মন মাঝি', nameEn: 'Mon Majhi', fullNameBn: 'মন মাঝি তোর বৈঠা নে রে', fullNameEn: 'Mon Majhi (Bhatiyali)', tempo: 0.38, mode: 'bhatiyali' },
      { id: 'majhi_baiya', nameBn: 'মাঝি বাইয়া', nameEn: 'Majhi Baiya', fullNameBn: 'মাঝি বাইয়া যাও রে', fullNameEn: 'Majhi Baiya Jao (River Flow)', tempo: 0.32, mode: 'boat_race' },
      { id: 'sohag_chand', nameBn: 'সোহাগ চাঁদ', nameEn: 'Sohag Chand', fullNameBn: 'সোহাগ চাঁদ বদনী ধনী', fullNameEn: 'Sohag Chand (Baul Dance)', tempo: 0.30, mode: 'baul' },
      { id: 'nodiya_ektara', nameBn: 'নদীয়া একতারা', nameEn: 'Nodiya Ektara', fullNameBn: 'পদ্মার নদীয়া একতারা', fullNameEn: 'Nodiya Ektara (Meditative)', tempo: 0.44, mode: 'ektara' }
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.musicEnabled;
  }

  nextRadioTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % (this.radioTracks.length + 1);
    if (this.currentTrackIndex === this.radioTracks.length) {
      // Mute radio channel
      this.musicEnabled = false;
      this.stopMusic();
      return { id: 'off', nameBn: 'রেডিও বন্ধ', nameEn: 'Radio Off', fullNameBn: 'রেডিও বন্ধ', fullNameEn: 'Radio Off' };
    } else {
      this.musicEnabled = true;
      this.stopMusic();
      this.startMusic();
      return this.radioTracks[this.currentTrackIndex];
    }
  }

  getCurrentTrack() {
    if (!this.musicEnabled) {
      return { id: 'off', nameBn: 'রেডিও বন্ধ', nameEn: 'Radio Off', fullNameBn: 'রেডিও বন্ধ', fullNameEn: 'Radio Off' };
    }
    return this.radioTracks[this.currentTrackIndex] || this.radioTracks[0];
  }

  // --- Sound Effects (16-bit retro synthesizers) ---
  playCast() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playSplash(isHeavy = false) {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const dur = isHeavy ? 0.35 : 0.18;
    const key = isHeavy ? 'heavy' : 'light';

    if (!this.splashBuffers) this.splashBuffers = {};
    if (!this.splashBuffers[key]) {
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      this.splashBuffers[key] = buffer;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.splashBuffers[key];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isHeavy ? 1200 : 2200, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isHeavy ? 0.45 : 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  playBite() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    // Retro energetic alert
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.08); // A5
    osc2.frequency.setValueAtTime(293.66, now);
    osc2.frequency.setValueAtTime(440, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }

  playReelClick() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  playLineSnapWarning() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.setValueAtTime(1100, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playPolloSlam() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    // Heavy mud slam impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.26);

    this.playSplash(true);
  }

  playCatchFanfare(rarity = 'common') {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    const notes = rarity === 'legendary' 
      ? [392, 523.25, 659.25, 783.99, 1046.50, 1318.51] // G4, C5, E5, G5, C6, E6
      : rarity === 'epic'
      ? [329.63, 440, 554.37, 659.25, 880]
      : [261.63, 329.63, 392, 523.25]; // C major jingle

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = rarity === 'legendary' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  }

  playCoinSound() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.07); // E6
    osc2.frequency.setValueAtTime(1975.53, now + 0.07);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  playUiClick() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  // --- Sundarbans Atmospheric SFX ---
  playTigerRoar() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    // Deep guttural predator rumble / growl
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    subOsc.type = 'triangle';

    osc.frequency.setValueAtTime(85, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(55, now + 1.2);

    subOsc.frequency.setValueAtTime(45, now);
    subOsc.frequency.exponentialRampToValueAtTime(65, now + 0.4);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.linearRampToValueAtTime(450, now + 0.35);
    filter.frequency.linearRampToValueAtTime(160, now + 1.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 1.35);
    subOsc.stop(now + 1.35);
  }

  playOtterChirp() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    // High playful chittering frequency chirps
    for (let c = 0; c < 3; c++) {
      const chirpTime = now + c * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1300 + c * 150, chirpTime);
      osc.frequency.exponentialRampToValueAtTime(2100 - c * 100, chirpTime + 0.035);
      osc.frequency.exponentialRampToValueAtTime(900, chirpTime + 0.065);

      gain.gain.setValueAtTime(0.22, chirpTime);
      gain.gain.exponentialRampToValueAtTime(0.001, chirpTime + 0.07);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(chirpTime);
      osc.stop(chirpTime + 0.075);
    }
  }

  playAchievementFanfare() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C E G C5 E5 G5

    notes.forEach((freq, idx) => {
      const time = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 0.38);
    });
  }

  // --- Chiptune Folk Melody Synthesizer (Bhatiyali & Ektara inspired) ---
  startMusic() {
    if (this.isPlayingMusic || !this.musicEnabled) return;
    this.ensureContext();
    this.isPlayingMusic = true;

    // Traditional Bengali Folk Pentatonic Scale (Sa Re Ga Pa Dha / C D E G A)
    // with lyrical Bhatiyali river feel
    const scale = [
      261.63, // C4 (Sa)
      293.66, // D4 (Re)
      329.63, // E4 (Ga)
      392.00, // G4 (Pa)
      440.00, // A4 (Dha)
      523.25, // C5 (Sa')
      587.33, // D5 (Re')
      659.25  // E5 (Ga')
    ];

    const track = this.radioTracks[this.currentTrackIndex] || this.radioTracks[0];

    // Melodic phrases tailored to each folk song
    let melody = [];
    if (track.id === 'mon_majhi') {
      // Classic Bhatiyali: মন মাঝি তোর বৈঠা নে রে
      melody = [
        { note: 2, dur: 0.5 }, { note: 3, dur: 0.5 }, { note: 4, dur: 1.0 },
        { note: 3, dur: 0.5 }, { note: 2, dur: 0.5 }, { note: 1, dur: 1.0 },
        { note: 2, dur: 0.5 }, { note: 3, dur: 0.5 }, { note: 5, dur: 1.5 },
        { note: 4, dur: 0.5 }, { note: 3, dur: 0.5 }, { note: 2, dur: 1.0 },
        { note: 0, dur: 1.0 }, { note: 2, dur: 0.5 }, { note: 3, dur: 0.5 },
        { note: 4, dur: 1.0 }, { note: 5, dur: 0.5 }, { note: 4, dur: 0.5 },
        { note: 3, dur: 1.0 }, { note: 2, dur: 1.0 }, { note: 0, dur: 2.0 }
      ];
    } else if (track.id === 'majhi_baiya') {
      // Boat Race Tempo: মাঝি বাইয়া যাও রে
      melody = [
        { note: 4, dur: 0.5 }, { note: 4, dur: 0.5 }, { note: 5, dur: 0.5 }, { note: 4, dur: 0.5 },
        { note: 3, dur: 0.75 }, { note: 2, dur: 0.25 }, { note: 1, dur: 1.0 },
        { note: 2, dur: 0.5 }, { note: 3, dur: 0.5 }, { note: 4, dur: 0.75 }, { note: 3, dur: 0.25 },
        { note: 2, dur: 1.0 }, { note: 0, dur: 1.5 },
        { note: 3, dur: 0.5 }, { note: 4, dur: 0.5 }, { note: 5, dur: 1.0 },
        { note: 6, dur: 0.5 }, { note: 5, dur: 0.5 }, { note: 4, dur: 1.5 }
      ];
    } else if (track.id === 'sohag_chand') {
      // Folk Baul: সোহাগ চাঁদ বদনী ধনী
      melody = [
        { note: 3, dur: 0.5 }, { note: 3, dur: 0.5 }, { note: 4, dur: 0.5 }, { note: 3, dur: 0.5 },
        { note: 2, dur: 1.0 }, { note: 0, dur: 1.0 },
        { note: 1, dur: 0.5 }, { note: 2, dur: 0.5 }, { note: 3, dur: 1.0 },
        { note: 4, dur: 0.5 }, { note: 3, dur: 0.5 }, { note: 2, dur: 0.5 }, { note: 1, dur: 0.5 },
        { note: 0, dur: 2.0 }
      ];
    } else {
      // Meditative River Ektara Drone: পদ্মার নদীয়া একতারা
      melody = [
        { note: 0, dur: 1.5 }, { note: 2, dur: 1.0 }, { note: 3, dur: 1.5 },
        { note: 4, dur: 2.0 }, { note: 3, dur: 1.0 }, { note: 2, dur: 1.5 },
        { note: 1, dur: 1.0 }, { note: 0, dur: 3.0 }
      ];
    }

    let currentStep = 0;
    const tempo = track.tempo; // seconds per beat

    const playNextNote = () => {
      if (!this.isPlayingMusic || !this.ctx) return;
      const now = this.ctx.currentTime;
      const item = melody[currentStep];
      const freq = scale[item.note];
      const duration = item.dur * tempo;

      // Melody voice (Square / Bamboo flute feel with mild vibrato)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = track.id === 'nodiya_ektara' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.95);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + duration);

      // Drone / Ektara plucked string bass on downbeats
      if (currentStep % (track.id === 'majhi_baiya' ? 2 : 4) === 0) {
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'sawtooth';
        drone.frequency.setValueAtTime(130.81, now); // Low C3
        droneGain.gain.setValueAtTime(0.13, now);
        droneGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);

        drone.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(this.musicGain);
        drone.start(now);
        drone.stop(now + duration * 1.6);
      }

      currentStep = (currentStep + 1) % melody.length;
      this.musicTimer = setTimeout(playNextNote, duration * 1000);
    };

    playNextNote();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  setWeatherAmbience(weather = 'clear') {
    if (!this.ctx || this.isMuted) return;
    // Update ambient sound based on weather
    if (weather === 'monsoon' || weather === 'rain') {
      this.ambientGain.gain.setTargetAtTime(0.28, this.ctx.currentTime, 1);
    } else {
      this.ambientGain.gain.setTargetAtTime(0.15, this.ctx.currentTime, 1);
    }
  }
}

export const sound = new SoundEngine();
