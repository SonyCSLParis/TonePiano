var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from 'events';
import { WebMidi } from 'webmidi';
export class MidiInput extends EventEmitter {
    constructor(deviceId = 'all') {
        super();
        this.deviceId = deviceId;
        /**
         * Automatically attaches the event listeners when a device is connect
         * and removes listeners when a device is disconnected
         */
        MidiInput.enabled().then(() => {
            WebMidi.addListener('connected', (event) => {
                if (event.port.type === 'input') {
                    this._addListeners(event.port);
                }
            });
            WebMidi.addListener('disconnected', (event) => {
                this._removeListeners(event.port);
            });
            // add all of the existing inputs
            WebMidi.inputs.forEach((input) => this._addListeners(input));
        });
    }
    /**
     * Attach listeners to the device when it's connected
     */
    _addListeners(device) {
        if (!MidiInput.connectedDevices.has(device.id)) {
            MidiInput.connectedDevices.set(device.id, device);
            this.emit('connect', this._inputToDevice(device));
            device.addListener('noteon', (event) => {
                if (this.deviceId === 'all' || this.deviceId === device.id) {
                    this.emit('keyDown', {
                        note: `${event.note.name}${event.note.octave}`,
                        midi: event.note.number,
                        velocity: event.rawValue,
                        device: this._inputToDevice(device)
                    });
                }
            });
            device.addListener('noteoff', (event) => {
                if (this.deviceId === 'all' || this.deviceId === device.id) {
                    this.emit('keyUp', {
                        note: `${event.note.name}${event.note.octave}`,
                        midi: event.note.number,
                        velocity: event.rawValue,
                        device: this._inputToDevice(device)
                    });
                }
            });
            device.addListener('controlchange', (event) => {
                if (this.deviceId === 'all' || this.deviceId === device.id) {
                    if (event.controller.name === 'holdpedal') {
                        this.emit(event.value ? 'pedalDown' : 'pedalUp', {
                            device: this._inputToDevice(device)
                        });
                    }
                }
            });
        }
    }
    _inputToDevice(input) {
        return {
            name: input.name,
            id: input.id,
            manufacturer: input.manufacturer
        };
    }
    /**
     * Internal call to remove all event listeners associated with the device
     */
    _removeListeners(event) {
        if (MidiInput.connectedDevices.has(event.id)) {
            const device = MidiInput.connectedDevices.get(event.id);
            this.emit('disconnect', this._inputToDevice(device));
            MidiInput.connectedDevices.delete(event.id);
            device.removeListener('noteon');
            device.removeListener('noteoff');
            device.removeListener('controlchange');
        }
    }
    // EVENT FUNCTIONS
    emit(event, data) {
        return super.emit(event, data);
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    once(event, listener) {
        super.once(event, listener);
        return this;
    }
    off(event, listener) {
        super.off(event, listener);
        return this;
    }
    /**
     * Resolves when the MIDI Input is enabled and ready to use
     */
    static enabled() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!MidiInput._isEnabled) {
                yield WebMidi.enable();
                MidiInput._isEnabled = true;
            }
        });
    }
    /**
     * Get a list of devices that are currently connected
     */
    static getDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            yield MidiInput.enabled();
            return WebMidi.inputs;
        });
    }
}
// STATIC
MidiInput.connectedDevices = new Map();
MidiInput._isEnabled = false;
