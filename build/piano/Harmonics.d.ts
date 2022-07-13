import { PianoComponent, PianoComponentOptions } from './Component';
interface HarmonicsOptions extends PianoComponentOptions {
    minNote: number;
    maxNote: number;
    release: boolean;
}
export declare class Harmonics extends PianoComponent {
    private _sampler;
    private _urls;
    constructor(options: HarmonicsOptions);
    triggerAttack(note: number, time: number, velocity: number): void;
    protected _internalLoad(): Promise<void>;
}
export {};
