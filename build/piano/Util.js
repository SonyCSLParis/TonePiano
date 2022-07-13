// import * as Tone from '../node_modules/tone/Tone'
import { Frequency, intervalToFrequencyRatio, ToneBufferSource } from 'tone';
export function noteToMidi(note) {
    return Frequency(note).toMidi();
}
export function midiToNote(midi) {
    const frequency = Frequency(midi, 'midi');
    const ret = frequency.toNote();
    return ret;
}
function midiToFrequencyRatio(midi) {
    const mod = midi % 3;
    if (mod === 1) {
        return [midi - 1, intervalToFrequencyRatio(1)];
    }
    else if (mod === 2) {
        // @ts-ignore
        return [midi + 1, intervalToFrequencyRatio(-1)];
    }
    else {
        return [midi, 1];
    }
}
function createSource(buffer) {
    return new ToneBufferSource(buffer);
}
export function randomBetween(low, high) {
    return Math.random() * (high - low) + low;
}
