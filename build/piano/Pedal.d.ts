import { PianoComponent, PianoComponentOptions } from './Component';
export declare class Pedal extends PianoComponent {
    private _downTime;
    private _currentSound;
    private _buffers;
    constructor(options: PianoComponentOptions);
    protected _internalLoad(): Promise<void>;
    /**
     *  Squash the current playing sound
     */
    private _squash;
    private _playSample;
    /**
     * Put the pedal down
     */
    down(time: number): void;
    /**
     * Put the pedal up
     */
    up(time: number): void;
    /**
     * Indicates if the pedal is down at the given time
     */
    isDown(time: number): boolean;
}
