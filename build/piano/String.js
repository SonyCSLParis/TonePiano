import { Sampler, ToneAudioNode } from 'tone';
import { getNotesUrl } from './Salamander';
/**
 * A single velocity of strings
 */
export class PianoString extends ToneAudioNode {
    constructor(options) {
        super(options);
        this.name = 'PianoString';
        this._urls = {};
        // create the urls
        options.notes.forEach(note => this._urls[note] = getNotesUrl(note, options.velocity));
        this.samples = options.samples;
    }
    load() {
        return new Promise(onload => {
            this._sampler = this.output = new Sampler({
                attack: 0,
                baseUrl: this.samples,
                curve: 'exponential',
                onload,
                release: 0.4,
                urls: this._urls,
                volume: 3,
            });
        });
    }
    triggerAttack(note, time, velocity) {
        this._sampler.triggerAttack(note, time, velocity);
    }
    triggerRelease(note, time) {
        this._sampler.triggerRelease(note, time);
    }
}
