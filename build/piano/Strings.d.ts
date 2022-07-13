import { PianoComponent, PianoComponentOptions } from './Component';
interface StringsOptions extends PianoComponentOptions {
    minNote: number;
    maxNote: number;
    velocities: number;
}
/**
 *  Manages all of the hammered string sounds
 */
export declare class PianoStrings extends PianoComponent {
    /**
     * All of the piano strings
     */
    private _strings;
    /**
     * Maps a midi note to a piano string
     */
    private _activeNotes;
    constructor(options: StringsOptions);
    /**
     * Scale a value between a given range
     */
    private scale;
    triggerAttack(note: number, time: number, velocity: number): void;
    triggerRelease(note: number, time: number): void;
    protected _internalLoad(): Promise<void>;
}
export {};
