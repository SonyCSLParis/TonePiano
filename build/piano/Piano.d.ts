import { Gain, Param, ToneAudioNode, Unit } from 'tone';
import type { ToneAudioNodeOptions } from 'tone/build/esm/core/context/ToneAudioNode';
export interface PianoOptions extends ToneAudioNodeOptions {
    /**
     * The number of velocity steps to load
     */
    velocities: number;
    /**
     * The lowest note to load
     */
    minNote: number;
    /**
     * The highest note to load
     */
    maxNote: number;
    /**
     * If it should include a 'release' sounds composed of a keyclick and string harmonic
     */
    release: boolean;
    /**
     * If the piano should include a 'pedal' sound.
     */
    pedal: boolean;
    /**
     * The directory of the salamander grand piano samples
     */
    url: string;
    /**
     * The maximum number of notes that can be held at once
     */
    maxPolyphony: number;
    /**
     * Volume levels for each of the components (in decibels)
     */
    volume: {
        pedal: number;
        strings: number;
        keybed: number;
        harmonics: number;
    };
}
interface KeyEvent {
    time?: Unit.Time;
    velocity?: number;
    note?: string;
    midi?: number;
}
interface PedalEvent {
    time?: Unit.Time;
}
/**
 *  The Piano
 */
export declare class Piano extends ToneAudioNode<PianoOptions> {
    readonly name = "Piano";
    readonly input: any;
    readonly output: Gain<"gain">;
    /**
     * The string harmonics
     */
    private _harmonics;
    /**
     * The keybed release sound
     */
    private _keybed;
    /**
     * The pedal
     */
    private _pedal;
    /**
     * The strings
     */
    private _strings;
    /**
     * The volume level of the strings output. This is the main piano sound.
     */
    strings: Param<"decibels">;
    /**
     * The volume output of the pedal up and down sounds
     */
    pedal: Param<"decibels">;
    /**
     * The volume of the string harmonics
     */
    harmonics: Param<"decibels">;
    /**
     * The volume of the keybed click sound
     */
    keybed: Param<"decibels">;
    /**
     * The maximum number of notes which can be held at once
     */
    maxPolyphony: number;
    /**
     * The sustained notes
     */
    private _sustainedNotes;
    /**
     * The currently held notes
     */
    private _heldNotes;
    /**
     * If it's loaded or not
     */
    private _loaded;
    constructor(options?: Partial<PianoOptions>);
    static getDefaults(): PianoOptions;
    /**
     *  Load all the samples
     */
    load(): Promise<void>;
    /**
     * If all the samples are loaded or not
     */
    get loaded(): boolean;
    /**
     *  Put the pedal down at the given time. Causes subsequent
     *  notes and currently held notes to sustain.
     */
    pedalDown({ time }?: PedalEvent): this;
    /**
     *  Put the pedal up. Dampens sustained notes
     */
    pedalUp({ time }?: PedalEvent): this;
    /**
     *  Play a note.
     *  @param note	  The note to play. If it is a number, it is assumed to be MIDI
     *  @param velocity  The velocity to play the note
     *  @param time	  The time of the event
     */
    keyDown({ note, midi, time, velocity }: KeyEvent): this;
    /**
     *  Release a held note.
     */
    keyUp({ note, midi, time, velocity }: KeyEvent): this;
    stopAll(): this;
}
export {};
