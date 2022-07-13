export declare const githubURL = "https://tambien.github.io/Piano/Salamander/";
export declare function getReleasesUrl(midi: number): string;
export declare function getHarmonicsUrl(midi: number): string;
export declare function getNotesUrl(midi: number, vel: any): string;
/**
 * Maps velocity depths to Salamander velocities
 */
export declare const velocitiesMap: {
    [s: number]: number[];
};
/**
 * All the notes of audio samples
 */
export declare const allNotes: number[];
export declare function getNotesInRange(min: number, max: number): number[];
export declare function getHarmonicsInRange(min: number, max: number): number[];
export declare function inHarmonicsRange(note: number): boolean;
