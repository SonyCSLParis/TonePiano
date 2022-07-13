import { PianoComponent, PianoComponentOptions } from './Component';
interface KeybedOptions extends PianoComponentOptions {
    minNote: number;
    maxNote: number;
}
export declare class Keybed extends PianoComponent {
    /**
     * All of the buffers of keybed clicks
     */
    private _buffers;
    /**
     * The urls to load
     */
    private _urls;
    constructor(options: KeybedOptions);
    protected _internalLoad(): Promise<void>;
    start(note: number, time: number, velocity: number): void;
}
export {};
