(function (root) {
  'use strict';

  const MODE_SUMS = [];
  const RENDER_INTERVAL_MS = 300;
  for (let m = 1; m <= 9; m++) for (let n = m + 1; n <= 10; n++) MODE_SUMS.push({ m, n, sum: m * m + n * n });

  function frequencyToMode(frequency, platePercent = 100) {
    const f = Number(frequency), pct = Number(platePercent);
    if (!Number.isFinite(f) || f < 200 || f > 1000 || !Number.isFinite(pct) || pct <= 0) return null;
    const scale = 432 / 34 * (pct / 100);
    let best = null;
    for (const mode of MODE_SUMS) {
      const resonance = scale * mode.sum;
      const distance = Math.abs(resonance - f);
      if (!best || distance < best.distance) best = { m: mode.m, n: mode.n, frequency: f, resonance, distance };
    }
    return best;
  }

  function peakFrequency(db, sampleRate, fftSize) {
    const binHz = sampleRate / fftSize;
    const first = Math.max(1, Math.ceil(200 / binHz));
    const last = Math.min(db.length - 2, Math.floor(1000 / binHz));
    let peak = -Infinity, index = -1;
    for (let i = first; i <= last; i++) if (db[i] > peak) { peak = db[i]; index = i; }
    if (index < 0 || peak < -90) return null;
    const left = db[index - 1], center = db[index], right = db[index + 1];
    const denom = left - 2 * center + right;
    const offset = Number.isFinite(denom) && Math.abs(denom) > 1e-6 ? 0.5 * (left - right) / denom : 0;
    return (index + Math.max(-0.5, Math.min(0.5, offset))) * binHz;
  }

  class ChladniLive {
    constructor(onFrequency, onState = () => {}) {
      this.onFrequency = onFrequency;
      this.onState = onState;
      this.stream = null;
      this.context = null;
      this.timer = null;
      this.data = null;
      this.generation = 0;
    }
    async start() {
      if (this.timer) return;
      if (!root.navigator?.mediaDevices?.getUserMedia || !root.AudioCapture?.manager) throw new Error('microphone-unavailable');
      if (typeof root.stopMic === 'function') root.stopMic();
      if (root.TuningLab && typeof root.TuningLab.stopCapture === 'function') root.TuningLab.stopCapture();
      const generation = ++this.generation;
      this.onState('requesting');
      try {
        const request = { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } };
        this.stream = await root.AudioCapture.manager.acquire('chladni-live', request);
        if (generation !== this.generation) {
          this.stop();
          return;
        }
        const AudioContextType = root.AudioContext || root.webkitAudioContext;
        if (!AudioContextType) throw new Error('audio-context-unavailable');
        this.context = new AudioContextType();
        await this.context.resume();
        if (generation !== this.generation) { this.stop(); return; }
        const source = this.context.createMediaStreamSource(this.stream);
        const analyser = this.context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.55;
        source.connect(analyser);
        this.data = new Float32Array(analyser.frequencyBinCount);
        let dutyWindowStarted = root.performance.now(), dutyWindowMs = 0;
        this.timer = root.setInterval(() => {
          const began = root.performance.now();
          analyser.getFloatFrequencyData(this.data);
          const frequency = peakFrequency(this.data, this.context.sampleRate, analyser.fftSize);
          if (frequency) this.onFrequency(frequency);
          dutyWindowMs += root.performance.now() - began;
          const windowElapsed = root.performance.now() - dutyWindowStarted;
          this.onState('listening', dutyWindowMs / Math.max(1000, windowElapsed));
          if (windowElapsed >= 1000) { dutyWindowStarted = root.performance.now(); dutyWindowMs = 0; }
        }, RENDER_INTERVAL_MS);
        this.onState('listening', 0);
      } catch (error) {
        const cancelled = generation !== this.generation;
        this.stop();
        if (cancelled) return;
        this.onState('error', error.message);
        throw error;
      }
    }
    stop() {
      this.generation++;
      if (this.timer) root.clearInterval(this.timer);
      this.timer = null;
      if (root.AudioCapture?.manager) root.AudioCapture.manager.release('chladni-live');
      else if (this.stream) this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      if (this.context) this.context.close();
      this.context = null;
      this.data = null;
      this.onState('stopped');
    }
  }

  const api = { frequencyToMode, peakFrequency, ChladniLive };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ChladniLiveModule = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
