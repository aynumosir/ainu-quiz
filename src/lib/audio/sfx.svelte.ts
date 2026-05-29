import { browser } from '$app/environment';
import { settings } from '$lib/settings/settings.svelte';

/**
 * Procedural UI sound effects (Web Audio — no files, no licensing, no ethics
 * gate). Tones are synthesized plucks evoking a tonkori (Ainu 5-string zither)
 * on a major-pentatonic scale, so feedback feels distinctly Ainu rather than
 * generic. The combo's rising pitch is the key dopamine cue. All gated by the
 * `sound` setting; the AudioContext is created lazily on the first user gesture
 * (tap/check), satisfying browser autoplay policy.
 */

// Major pentatonic, ascending (Hz) — bright and positive.
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];

class Sfx {
	#ctx: AudioContext | null = null;
	#master: GainNode | null = null;

	#ac(): AudioContext | null {
		if (!browser || !settings.sound) return null;
		if (!this.#ctx) {
			const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			if (!AC) return null;
			this.#ctx = new AC();
			this.#master = this.#ctx.createGain();
			this.#master.gain.value = 0.16;
			this.#master.connect(this.#ctx.destination);
		}
		if (this.#ctx.state === 'suspended') this.#ctx.resume();
		return this.#ctx;
	}

	/** A plucked-string tone: triangle + octave sine through a closing lowpass + exp decay. */
	#pluck(freq: number, when: number, dur = 0.36, gain = 0.9, type: OscillatorType = 'triangle') {
		const ctx = this.#ctx!;
		const g = ctx.createGain();
		const lp = ctx.createBiquadFilter();
		lp.type = 'lowpass';
		lp.frequency.setValueAtTime(Math.min(9000, freq * 6), when);
		lp.frequency.exponentialRampToValueAtTime(Math.max(700, freq * 1.8), when + dur);
		const o1 = ctx.createOscillator();
		o1.type = type;
		o1.frequency.value = freq;
		const o2 = ctx.createOscillator();
		o2.type = 'sine';
		o2.frequency.value = freq * 2;
		const g2 = ctx.createGain();
		g2.gain.value = 0.22;
		g.gain.setValueAtTime(0.0001, when);
		g.gain.exponentialRampToValueAtTime(gain, when + 0.005);
		g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
		o1.connect(g);
		o2.connect(g2);
		g2.connect(g);
		g.connect(lp);
		lp.connect(this.#master!);
		o1.start(when);
		o2.start(when);
		o1.stop(when + dur);
		o2.stop(when + dur);
	}

	/** A short blip (clicks/taps). */
	#blip(freq: number, dur = 0.05, gain = 0.4, type: OscillatorType = 'sine') {
		const ctx = this.#ac();
		if (!ctx) return;
		const t = ctx.currentTime;
		const g = ctx.createGain();
		const o = ctx.createOscillator();
		o.type = type;
		o.frequency.value = freq;
		g.gain.setValueAtTime(0.0001, t);
		g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
		g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
		o.connect(g);
		g.connect(this.#master!);
		o.start(t);
		o.stop(t + dur);
	}

	/** Soft sine (gentle, non-alarming — for wrong answers). */
	#soft(freq: number, when: number, dur: number, gain = 0.5) {
		const ctx = this.#ctx!;
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = 'sine';
		o.frequency.value = freq;
		g.gain.setValueAtTime(0.0001, when);
		g.gain.exponentialRampToValueAtTime(gain, when + 0.02);
		g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
		o.connect(g);
		g.connect(this.#master!);
		o.start(when);
		o.stop(when + dur);
	}

	// --- public cues ---

	tap() {
		this.#blip(1180, 0.045, 0.32, 'sine');
	}
	select() {
		this.#blip(760, 0.05, 0.34, 'triangle');
	}
	unplace() {
		this.#blip(520, 0.05, 0.28, 'sine');
	}
	/** single pleasant pluck (e.g. a correct match). */
	ping() {
		const ctx = this.#ac();
		if (!ctx) return;
		this.#pluck(880, ctx.currentTime, 0.28, 0.8);
	}

	/** Correct answer: a 3-note pentatonic arpeggio that climbs with the combo. */
	correct(streak = 0) {
		const ctx = this.#ac();
		if (!ctx) return;
		const t = ctx.currentTime;
		const shift = Math.min(streak, 4);
		[2, 3, 5].forEach((i, k) =>
			this.#pluck(PENTA[Math.min(PENTA.length - 1, i + shift)], t + k * 0.07, 0.4, 0.85)
		);
	}

	/** A single rising pluck keyed to the in-lesson combo (the dopamine cue). */
	combo(n: number) {
		const ctx = this.#ac();
		if (!ctx) return;
		const idx = Math.min(PENTA.length - 1, Math.max(0, n - 1));
		this.#pluck(PENTA[idx], ctx.currentTime, 0.3, 0.8);
	}

	/** Wrong answer: a soft, low descending two-tone — firm, never harsh. */
	wrong() {
		const ctx = this.#ac();
		if (!ctx) return;
		const t = ctx.currentTime;
		this.#soft(196.0, t, 0.22, 0.45);
		this.#soft(155.56, t + 0.12, 0.3, 0.45);
	}

	heartLost() {
		const ctx = this.#ac();
		if (!ctx) return;
		const t = ctx.currentTime;
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = 'sine';
		o.frequency.setValueAtTime(220, t);
		o.frequency.exponentialRampToValueAtTime(110, t + 0.26);
		g.gain.setValueAtTime(0.45, t);
		g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
		o.connect(g);
		g.connect(this.#master!);
		o.start(t);
		o.stop(t + 0.32);
	}

	/** Lesson complete: a triumphant pentatonic run + a shimmering final chord. */
	complete() {
		const ctx = this.#ac();
		if (!ctx) return;
		const t = ctx.currentTime;
		[0, 2, 4, 5].forEach((i, k) => this.#pluck(PENTA[i], t + k * 0.1, 0.5, 0.9));
		this.#pluck(PENTA[5], t + 0.46, 0.9, 0.7);
		this.#pluck(PENTA[7], t + 0.46, 0.9, 0.5);
	}
}

export const sfx = new Sfx();
