var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Midi } from 'tone';
import { PianoComponent } from './Component';
import { getNotesInRange, velocitiesMap } from './Salamander';
import { PianoString } from './String';
/**
 *  Manages all of the hammered string sounds
 */
export class PianoStrings extends PianoComponent {
    constructor(options) {
        super(options);
        const notes = getNotesInRange(options.minNote, options.maxNote);
        const velocities = velocitiesMap[options.velocities].slice();
        this._strings = velocities.map(velocity => {
            const string = new PianoString(Object.assign(options, {
                notes, velocity,
            }));
            return string;
        });
        this._activeNotes = new Map();
    }
    /**
     * Scale a value between a given range
     */
    scale(val, inMin, inMax, outMin, outMax) {
        return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    }
    triggerAttack(note, time, velocity) {
        const scaledVel = this.scale(velocity, 0, 1, -0.5, this._strings.length - 0.51);
        const stringIndex = Math.max(Math.round(scaledVel), 0);
        let gain = 1 + scaledVel - stringIndex;
        if (this._strings.length === 1) {
            gain = velocity;
        }
        const sampler = this._strings[stringIndex];
        if (this._activeNotes.has(note)) {
            this.triggerRelease(note, time);
        }
        this._activeNotes.set(note, sampler);
        sampler.triggerAttack(Midi(note).toNote(), time, gain);
    }
    triggerRelease(note, time) {
        // trigger the release of all of the notes at that velociy
        if (this._activeNotes.has(note)) {
            this._activeNotes.get(note).triggerRelease(Midi(note).toNote(), time);
            this._activeNotes.delete(note);
        }
    }
    _internalLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this._strings.map((s) => __awaiter(this, void 0, void 0, function* () {
                yield s.load();
                s.connect(this.output);
            })));
        });
    }
}
