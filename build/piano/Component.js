var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ToneAudioNode, Volume } from 'tone';
/**
 * Base class for the other components
 */
export class PianoComponent extends ToneAudioNode {
    constructor(options) {
        super(options);
        this.name = 'PianoComponent';
        this.input = undefined;
        this.output = new Volume({ context: this.context });
        /**
         * If the component is enabled or not
         */
        this._enabled = false;
        /**
         * The volume output of the component
         */
        this.volume = this.output.volume;
        /**
         * Boolean indication of if the component is loaded or not
         */
        this._loaded = false;
        this.volume.value = options.volume;
        this._enabled = options.enabled;
        this.samples = options.samples;
    }
    /**
     * If the samples are loaded or not
     */
    get loaded() {
        return this._loaded;
    }
    /**
     * Load the samples
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._enabled) {
                yield this._internalLoad();
                this._loaded = true;
            }
            else {
                return Promise.resolve();
            }
        });
    }
}
