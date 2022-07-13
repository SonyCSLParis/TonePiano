import { Param, ToneAudioNode, Unit, Volume } from 'tone';
import type { ToneAudioNodeOptions } from 'tone/build/esm/core/context/ToneAudioNode';
export interface PianoComponentOptions extends ToneAudioNodeOptions {
    volume: Unit.Decibels;
    enabled: boolean;
    samples: string;
}
export interface UrlsMap {
    [note: string]: string;
}
/**
 * Base class for the other components
 */
export declare abstract class PianoComponent extends ToneAudioNode {
    readonly name = "PianoComponent";
    readonly input: any;
    readonly output: Volume;
    /**
     * If the component is enabled or not
     */
    protected _enabled: boolean;
    /**
     * The volume output of the component
     */
    readonly volume: Param<"decibels">;
    /**
     * Boolean indication of if the component is loaded or not
     */
    private _loaded;
    /**
     * The directory to load the Salamander samples out of
     */
    readonly samples: string;
    constructor(options: PianoComponentOptions);
    /**
     * Load the component internally
     */
    protected abstract _internalLoad(): Promise<void>;
    /**
     * If the samples are loaded or not
     */
    get loaded(): boolean;
    /**
     * Load the samples
     */
    load(): Promise<void>;
}
