import { ToneAudioBuffers, ToneBufferSource } from 'tone';
import { PianoComponent } from './Component';
import { getReleasesUrl } from './Salamander';
import { randomBetween } from './Util';
export class Keybed extends PianoComponent {
    constructor(options) {
        super(options);
        /**
         * The urls to load
         */
        this._urls = {};
        for (let i = options.minNote; i <= options.maxNote; i++) {
            this._urls[i] = getReleasesUrl(i);
        }
    }
    _internalLoad() {
        return new Promise(success => {
            this._buffers = new ToneAudioBuffers(this._urls, success, this.samples);
        });
    }
    start(note, time, velocity) {
        if (this._enabled && this._buffers.has(note)) {
            const source = new ToneBufferSource({
                url: this._buffers.get(note),
                context: this.context,
            }).connect(this.output);
            // randomize the velocity slightly
            source.start(time, 0, undefined, 0.015 * velocity * randomBetween(0.5, 1));
        }
    }
}
