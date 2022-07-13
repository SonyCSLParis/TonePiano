var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Gain, isString, Midi, optionsFromArguments, ToneAudioNode } from 'tone';
import { Harmonics } from './Harmonics';
import { Keybed } from './Keybed';
import { Pedal } from './Pedal';
import { PianoStrings } from './Strings';
/**
 *  The Piano
 */
export class Piano extends ToneAudioNode {
    constructor() {
        super(optionsFromArguments(Piano.getDefaults(), arguments));
        this.name = 'Piano';
        this.input = undefined;
        this.output = new Gain({ context: this.context });
        /**
         * The currently held notes
         */
        this._heldNotes = new Map();
        /**
         * If it's loaded or not
         */
        this._loaded = false;
        const options = optionsFromArguments(Piano.getDefaults(), arguments);
        // make sure it ends with a /
        if (!options.url.endsWith('/')) {
            options.url += '/';
        }
        this.maxPolyphony = options.maxPolyphony;
        this._heldNotes = new Map();
        this._sustainedNotes = new Map();
        this._strings = new PianoStrings(Object.assign({}, options, {
            enabled: true,
            samples: options.url,
            volume: options.volume.strings,
        })).connect(this.output);
        this.strings = this._strings.volume;
        this._pedal = new Pedal(Object.assign({}, options, {
            enabled: options.pedal,
            samples: options.url,
            volume: options.volume.pedal,
        })).connect(this.output);
        this.pedal = this._pedal.volume;
        this._keybed = new Keybed(Object.assign({}, options, {
            enabled: options.release,
            samples: options.url,
            volume: options.volume.keybed,
        })).connect(this.output);
        this.keybed = this._keybed.volume;
        this._harmonics = new Harmonics(Object.assign({}, options, {
            enabled: options.release,
            samples: options.url,
            volume: options.volume.harmonics,
        })).connect(this.output);
        this.harmonics = this._harmonics.volume;
    }
    static getDefaults() {
        return Object.assign(ToneAudioNode.getDefaults(), {
            maxNote: 108,
            minNote: 21,
            pedal: true,
            release: false,
            url: 'https://tambien.github.io/Piano/audio/',
            velocities: 1,
            maxPolyphony: 32,
            volume: {
                harmonics: 0,
                keybed: 0,
                pedal: 0,
                strings: 0,
            },
        });
    }
    /**
     *  Load all the samples
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this._strings.load(),
                this._pedal.load(),
                this._keybed.load(),
                this._harmonics.load(),
            ]);
            this._loaded = true;
        });
    }
    /**
     * If all the samples are loaded or not
     */
    get loaded() {
        return this._loaded;
    }
    /**
     *  Put the pedal down at the given time. Causes subsequent
     *  notes and currently held notes to sustain.
     */
    pedalDown({ time = this.immediate() } = {}) {
        if (this.loaded) {
            time = this.toSeconds(time);
            if (!this._pedal.isDown(time)) {
                this._pedal.down(time);
            }
        }
        return this;
    }
    /**
     *  Put the pedal up. Dampens sustained notes
     */
    pedalUp({ time = this.immediate() } = {}) {
        if (this.loaded) {
            const seconds = this.toSeconds(time);
            if (this._pedal.isDown(seconds)) {
                this._pedal.up(seconds);
                // dampen each of the notes
                this._sustainedNotes.forEach((t, note) => {
                    if (!this._heldNotes.has(note)) {
                        this._strings.triggerRelease(note, seconds);
                    }
                });
                this._sustainedNotes.clear();
            }
        }
        return this;
    }
    /**
     *  Play a note.
     *  @param note	  The note to play. If it is a number, it is assumed to be MIDI
     *  @param velocity  The velocity to play the note
     *  @param time	  The time of the event
     */
    keyDown({ note, midi, time = this.immediate(), velocity = 0.8 }) {
        if (this.loaded && this.maxPolyphony > this._heldNotes.size + this._sustainedNotes.size) {
            time = this.toSeconds(time);
            if (isString(note)) {
                midi = Math.round(Midi(note).toMidi());
            }
            if (!this._heldNotes.has(midi)) {
                // record the start time and velocity
                this._heldNotes.set(midi, { time, velocity });
                this._strings.triggerAttack(midi, time, velocity);
            }
        }
        else {
            console.warn('samples not loaded');
        }
        return this;
    }
    /**
     *  Release a held note.
     */
    keyUp({ note, midi, time = this.immediate(), velocity = 0.8 }) {
        if (this.loaded) {
            time = this.toSeconds(time);
            if (isString(note)) {
                midi = Math.round(Midi(note).toMidi());
            }
            if (this._heldNotes.has(midi)) {
                const prevNote = this._heldNotes.get(midi);
                this._heldNotes.delete(midi);
                // compute the release velocity
                const holdTime = Math.pow(Math.max(time - prevNote.time, 0.1), 0.7);
                const prevVel = prevNote.velocity;
                let dampenGain = (3 / holdTime) * prevVel * velocity;
                dampenGain = Math.max(dampenGain, 0.4);
                dampenGain = Math.min(dampenGain, 4);
                if (this._pedal.isDown(time)) {
                    if (!this._sustainedNotes.has(midi)) {
                        this._sustainedNotes.set(midi, time);
                    }
                }
                else {
                    // release the string sound
                    this._strings.triggerRelease(midi, time);
                    // trigger the harmonics sound
                    this._harmonics.triggerAttack(midi, time, dampenGain);
                }
                // trigger the keybed release sound
                this._keybed.start(midi, time, velocity);
            }
        }
        return this;
    }
    stopAll() {
        this.pedalUp();
        this._heldNotes.forEach((_, midi) => {
            this.keyUp({ midi });
        });
        return this;
    }
}
