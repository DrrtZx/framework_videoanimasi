#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 44100;

/**
 * Membuat buffer WAV 16-bit Mono PCM
 * @param {Float32Array} samples - Sample normalisasi -1.0 s/d 1.0
 * @param {number} sampleRate
 * @returns {Buffer}
 */
function createWavBuffer(samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length;
  const byteRate = sampleRate * 2; // 16-bit mono = 2 bytes per sample
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(1, 22); // num channels (1 = mono)
  buffer.writeUInt32LE(sampleRate, 24); // sample rate
  buffer.writeUInt32LE(byteRate, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // PCM data
  for (let i = 0; i < numSamples; i++) {
    // Clamp sample to [-1, 1]
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Pseudo-random generator dengan seed tetap agar reproducible
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// --- Generator Efek Suara Prosedural ---

function genWhoosh() {
  const duration = 0.45;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);
  const rand = seededRandom(42);

  for (let i = 0; i < total; i++) {
    const t = i / total;
    const env = Math.sin(t * Math.PI) ** 2;
    const noise = rand() * 2 - 1;
    // frequency sweep
    const freq = 300 + 1200 * Math.sin(t * Math.PI);
    const wave = Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE));
    out[i] = (noise * 0.6 + wave * 0.4) * env * 0.8;
  }
  return out;
}

function genPop() {
  const duration = 0.12;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  for (let i = 0; i < total; i++) {
    const t = i / total;
    const env = Math.exp(-t * 28);
    const freq = 650 * (1 - t * 0.75);
    out[i] = Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE)) * env * 0.9;
  }
  return out;
}

function genBloop() {
  const duration = 0.22;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  for (let i = 0; i < total; i++) {
    const t = i / total;
    const env = Math.sin(t * Math.PI) * Math.exp(-t * 4);
    const freq = 300 + 450 * Math.sin(t * Math.PI * 0.9);
    out[i] = Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE)) * env * 0.85;
  }
  return out;
}

function genBoing() {
  const duration = 0.65;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  for (let i = 0; i < total; i++) {
    const t = i / total;
    const env = Math.exp(-t * 4.5);
    const vibrato = Math.sin(2 * Math.PI * 18 * t) * 60;
    const freq = 180 + 120 * t + vibrato;
    out[i] = Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE)) * env * 0.8;
  }
  return out;
}

function genSwish() {
  const duration = 0.3;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);
  const rand = seededRandom(108);

  for (let i = 0; i < total; i++) {
    const t = i / total;
    const env = Math.sin(t * Math.PI) ** 3;
    const noise = rand() * 2 - 1;
    out[i] = noise * env * 0.7;
  }
  return out;
}

function genDing() {
  const duration = 1.2;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  for (let i = 0; i < total; i++) {
    const t = i / total;
    const timeSec = i / SAMPLE_RATE;
    const env1 = Math.exp(-timeSec * 3.5);
    const env2 = Math.exp(-timeSec * 5.0);
    const s1 = Math.sin(2 * Math.PI * 1250 * timeSec) * env1;
    const s2 = Math.sin(2 * Math.PI * 2500 * timeSec) * env2 * 0.35;
    const s3 = Math.sin(2 * Math.PI * 3750 * timeSec) * env2 * 0.15;
    out[i] = (s1 + s2 + s3) * 0.8;
  }
  return out;
}

function genDuar() {
  const duration = 1.4;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);
  const rand = seededRandom(999);

  for (let i = 0; i < total; i++) {
    const timeSec = i / SAMPLE_RATE;
    const envSub = Math.exp(-timeSec * 3.0);
    const envNoise = Math.exp(-timeSec * 6.5);
    const subFreq = Math.max(30, 140 - timeSec * 90);
    const sub = Math.sin(2 * Math.PI * subFreq * timeSec) * envSub;
    const noise = (rand() * 2 - 1) * envNoise;
    out[i] = Math.tanh(sub * 0.9 + noise * 0.7) * 0.9;
  }
  return out;
}

function genRadar() {
  const duration = 0.8;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  for (let i = 0; i < total; i++) {
    const timeSec = i / SAMPLE_RATE;
    const env = Math.exp(-timeSec * 4.2);
    const freq = 1760;
    out[i] = Math.sin(2 * Math.PI * freq * timeSec) * env * 0.75;
  }
  return out;
}

function genGiggle() {
  const duration = 0.75;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  // 4 nada staccato gembira
  const notes = [659, 784, 880, 1046];
  for (let i = 0; i < total; i++) {
    const t = i / total;
    const noteIdx = Math.min(notes.length - 1, Math.floor(t * 4));
    const noteTime = (t * 4) % 1;
    const env = Math.sin(noteTime * Math.PI) * Math.exp(-noteTime * 2.5);
    const freq = notes[noteIdx];
    out[i] = Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE)) * env * 0.75;
  }
  return out;
}

function genYeay() {
  const duration = 1.0;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  // Arpeggio akord C Mayor (C5, E5, G5, C6)
  const chord = [523.25, 659.25, 783.99, 1046.5];
  for (let i = 0; i < total; i++) {
    const timeSec = i / SAMPLE_RATE;
    let sum = 0;
    for (let c = 0; c < chord.length; c++) {
      const delay = c * 0.08;
      if (timeSec >= delay) {
        const localT = timeSec - delay;
        const env = Math.exp(-localT * 3.0);
        sum += Math.sin(2 * Math.PI * chord[c] * localT) * env;
      }
    }
    out[i] = (sum / chord.length) * 0.9;
  }
  return out;
}

function genFootstep() {
  const duration = 0.14;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);
  const rand = seededRandom(333);

  for (let i = 0; i < total; i++) {
    const timeSec = i / SAMPLE_RATE;
    const env = Math.exp(-timeSec * 35);
    const thud = Math.sin(2 * Math.PI * 95 * timeSec) * env;
    const scrape = (rand() * 2 - 1) * Math.exp(-timeSec * 50) * 0.3;
    out[i] = (thud * 0.8 + scrape) * 0.8;
  }
  return out;
}

function genStinger() {
  const duration = 1.5;
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  // Dramatic hit: akar nada rendah + interval tritone tajam + swell
  for (let i = 0; i < total; i++) {
    const timeSec = i / SAMPLE_RATE;
    const env = Math.exp(-timeSec * 2.5);
    const bass = Math.sin(2 * Math.PI * 110 * timeSec);
    const mid1 = Math.sin(2 * Math.PI * 220 * timeSec) * 0.7;
    const mid2 = Math.sin(2 * Math.PI * 311.13 * timeSec) * 0.5; // Eb (dramatis)
    out[i] = Math.tanh((bass + mid1 + mid2) * 0.6) * env * 0.95;
  }
  return out;
}

function genBgmLoop() {
  // Loopable warm edutainment background music (~8 detik pada 120 BPM = 16 beat)
  const bpm = 120;
  const secondsPerBeat = 60 / bpm; // 0.5 detik
  const totalBeats = 16;
  const duration = totalBeats * secondsPerBeat; // 8.0 detik
  const total = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(total);

  // Melodi pentatonik ramah: C - D - E - G - A (Hz)
  const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  // Pola nada per beat
  const melodyNotes = [0, 2, 3, 4, 2, 0, 3, 4, 1, 3, 4, 5, 4, 3, 2, 0];
  const bassNotes = [130.81, 130.81, 164.81, 164.81, 174.61, 174.61, 196.0, 196.0];

  for (let i = 0; i < total; i++) {
    const timeSec = i / SAMPLE_RATE;
    const currentBeat = (timeSec / secondsPerBeat) % totalBeats;
    const beatIndex = Math.floor(currentBeat);
    const beatFraction = currentBeat - beatIndex;

    // Bassline hangat
    const bassIdx = Math.floor(beatIndex / 2) % bassNotes.length;
    const bassFreq = bassNotes[bassIdx];
    const bassEnv = Math.exp(-beatFraction * 2.2);
    const bassWave = Math.sin(2 * Math.PI * bassFreq * timeSec) * bassEnv * 0.35;

    // Lead melodi lembut (sinus dengan envelope teratur)
    const melFreq = scale[melodyNotes[beatIndex] % scale.length];
    const melEnv = Math.sin(beatFraction * Math.PI) * Math.exp(-beatFraction * 2.0);
    const melWave = Math.sin(2 * Math.PI * melFreq * timeSec) * melEnv * 0.25;

    // Soft hi-hat tick pada setiap half-beat
    const tickTime = (timeSec / (secondsPerBeat / 2)) % 1;
    const tickEnv = Math.exp(-tickTime * 35);
    const tickNoise = ((Math.sin(timeSec * 12345.67) * 43758.54) % 1) * 2 - 1;
    const tickWave = tickNoise * tickEnv * 0.08;

    out[i] = Math.tanh(bassWave + melWave + tickWave) * 0.7;
  }

  // Crossfade halus di 0.05 detik awal dan akhir agar loop mulus tanpa klik
  const fadeSamples = Math.floor(SAMPLE_RATE * 0.05);
  for (let i = 0; i < fadeSamples; i++) {
    const factor = i / fadeSamples;
    out[i] *= factor;
    out[total - 1 - i] *= factor;
  }

  return out;
}

// Eksekusi generator
function main() {
  const sfxDir = path.resolve(process.cwd(), "public/audio/sfx");
  const musicDir = path.resolve(process.cwd(), "public/audio/music");

  if (!existsSync(sfxDir)) mkdirSync(sfxDir, { recursive: true });
  if (!existsSync(musicDir)) mkdirSync(musicDir, { recursive: true });

  const sfxRegistry = [
    { name: "whoosh", gen: genWhoosh },
    { name: "pop", gen: genPop },
    { name: "bloop", gen: genBloop },
    { name: "boing", gen: genBoing },
    { name: "swish", gen: genSwish },
    { name: "ding", gen: genDing },
    { name: "duar", gen: genDuar },
    { name: "radar", gen: genRadar },
    { name: "giggle", gen: genGiggle },
    { name: "yeay", gen: genYeay },
    { name: "footstep", gen: genFootstep },
    { name: "stinger", gen: genStinger },
  ];

  console.log(`[generate-sfx] Mensintesis ${sfxRegistry.length} sound effects prosedural...`);

  for (const sfx of sfxRegistry) {
    const samples = sfx.gen();
    const wavBuffer = createWavBuffer(samples);
    const filePath = path.join(sfxDir, `${sfx.name}.wav`);
    writeFileSync(filePath, wavBuffer);
    console.log(`  + [SFX] ${sfx.name}.wav (${samples.length} samples, ${(samples.length / SAMPLE_RATE).toFixed(2)}s)`);
  }

  console.log(`[generate-sfx] Mensintesis background music loopable...`);
  const bgmSamples = genBgmLoop();
  const bgmWav = createWavBuffer(bgmSamples);
  const bgmPath = path.join(musicDir, "bgm-loop.wav");
  writeFileSync(bgmPath, bgmWav);
  console.log(`  + [MUSIC] bgm-loop.wav (${bgmSamples.length} samples, ${(bgmSamples.length / SAMPLE_RATE).toFixed(2)}s)`);

  console.log(`[generate-sfx] Selesai! Semua audio tersimpan dengan sukses.`);
}

main();
