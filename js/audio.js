/**
 * rorongBooks Audio Utility
 * Web Audio API based sound synthesizer for rich, lag-free sound effects.
 */
const RorongAudio = (() => {
  let audioCtx = null;

  function initContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(err => console.log('Audio resume blocked:', err));
    }
  }

  // Cute bubble pop sound for general clicks/touches
  function playBubble() {
    try {
      initContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      osc.type = 'sine';
      
      // Sweep pitch up quickly
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);

      // Fast fade out
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  // Sparkling magical chime sound for progress completion & success
  function playChime() {
    try {
      initContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (arpeggio)

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  // Soft slide sound simulating a page turn
  function playPageTurn() {
    try {
      initContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const bufferSize = audioCtx.sampleRate * 0.18;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Soft white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.18);
      filter.Q.value = 1.2;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.19);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  // Tiny click sound played during long press countdown ticks
  function playTick() {
    try {
      initContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  // Grand magical success sound for high rating submission
  function playSuccess() {
    try {
      initContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.45);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.5);
      });
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  return {
    playBubble,
    playChime,
    playPageTurn,
    playTick,
    playSuccess,
    initContext
  };
})();
