/// <reference types="node" />
import { EventEmitter } from 'events';
declare type NoteEventType = 'keyDown' | 'keyUp';
declare type PedalEventType = 'pedalDown' | 'pedalUp';
declare type ConnectionEventType = 'connect' | 'disconnect';
interface DeviceData {
    id: string;
    manufacturer: string;
    name: string;
}
interface MidiEvent {
    device: DeviceData;
}
interface NoteEvent extends MidiEvent {
    note: string;
    midi: number;
    velocity: number;
}
declare type ConditionalEmitter<EventType> = EventType extends PedalEventType ? MidiEvent : EventType extends ConnectionEventType ? DeviceData : EventType extends NoteEventType ? NoteEvent : unknown;
declare type ConditionalListener<EventType> = (e: ConditionalEmitter<EventType>) => void;
export declare class MidiInput extends EventEmitter {
    /**
     * The device ID string. If set to 'all', will listen
     * to all MIDI inputs. Otherwise will filter a specific midi device
     */
    deviceId: string | 'all';
    constructor(deviceId?: string | 'all');
    /**
     * Attach listeners to the device when it's connected
     */
    private _addListeners;
    private _inputToDevice;
    /**
     * Internal call to remove all event listeners associated with the device
     */
    private _removeListeners;
    emit<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(event: EventType, data: ConditionalEmitter<EventType>): boolean;
    on<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(event: EventType, listener: ConditionalListener<EventType>): this;
    once<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(event: EventType, listener: ConditionalListener<EventType>): this;
    off<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(event: EventType, listener: ConditionalListener<EventType>): this;
    private static connectedDevices;
    private static _isEnabled;
    /**
     * Resolves when the MIDI Input is enabled and ready to use
     */
    static enabled(): Promise<void>;
    /**
     * Get a list of devices that are currently connected
     */
    static getDevices(): Promise<DeviceData[]>;
}
export {};
