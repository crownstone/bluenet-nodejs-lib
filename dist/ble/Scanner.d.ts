import { BluenetSettings } from "../BluenetSettings";
import { TrackerMap, Cache } from "../types/declarations";
export declare class Scanner {
    nobleState: string;
    scanningInProgress: boolean;
    trackedStones: TrackerMap;
    cache: Cache;
    settings: BluenetSettings;
    constructor(settings: BluenetSettings);
    isReady(): Promise<{}>;
    start(): Promise<void>;
    stop(): void;
    cleanUp(): void;
    /**
     * Check if this uuid is in the cache. If it is not, we will scan for 3 seconds to find it!
     * @param identifier
     * @returns {Promise<any>}
     */
    getPeripheral(identifier: any, scanDuration?: number): Promise<{}>;
    /**
     * This can be either an iBeacon payload, a scanresponse or both combined.
     * @type {Advertisement}
     */
    discover(peripheral: any): void;
}
