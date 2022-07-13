import { Sampler, ToneAudioNode } from 'tone';
import { PianoComponentOptions } from './Component';
interface PianoStringOptions extends PianoComponentOptions {
    notes: number[];
    velocity: number;
}
/**
 * A single velocity of strings
 */
export declare class PianoString extends ToneAudioNode {
    readonly name = "PianoString";
    private _sampler;
    output: Sampler;
    input: undefined;
    private _urls;
    readonly samples: string;
    constructor(options: PianoStringOptions);
    load(): Promise<void>;
    triggerAttack(note: string, time: number, velocity: number): void;
    triggerRelease(note: string, time: number): void;
}
export {};
