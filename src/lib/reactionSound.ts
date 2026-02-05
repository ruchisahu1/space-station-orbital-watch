/**
 * Plays short synthesized tones for correct/wrong answer feedback.
 * Uses Web Audio API so no audio files are required.
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency: number, durationSeconds: number, type: OscillatorType = 'sine', volume = 0.15): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + durationSeconds);
  } catch {
    // Ignore if audio is not allowed or unavailable
  }
}

/** Play "system nominal" tone for correct answer. */
export function playCorrectSound(): void {
  playTone(640, 0.12, 'sine', 0.12);
  setTimeout(() => {
    playTone(800, 0.08, 'sine', 0.1);
  }, 80);
}

/** Play "warning" tone for wrong answer. */
export function playWrongSound(): void {
  playTone(280, 0.15, 'sine', 0.14);
  setTimeout(() => {
    playTone(220, 0.12, 'sine', 0.1);
  }, 100);
}
