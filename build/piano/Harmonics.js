import { Midi, Sampler } from 'tone';
import { PianoComponent } from './Component';
import { getHarmonicsInRange, getHarmonicsUrl, inHarmonicsRange } from './Salamander';
import { randomBetween } from './Util';
export class Harmonics extends PianoComponent {
    constructor(options) {
        super(options);
        this._urls = {};
        const notes = getHarmonicsInRange(options.minNote, options.maxNote);
        for (const n of notes) {
            this._urls[n] = getHarmonicsUrl(n);
        }
    }
    triggerAttack(note, time, velocity) {
        if (this._enabled && inHarmonicsRange(note)) {
            this._sampler.triggerAttack(Midi(note).toNote(), time, velocity * randomBetween(0.5, 1));
        }
    }
    _internalLoad() {
        return new Promise(onload => {
            this._sampler = new Sampler({
                baseUrl: this.samples,
                onload,
                urls: this._urls,
            }).connect(this.output);
        });
    }
}
