/// <reference types="node" />
import { BleHandler } from "../BleHandler";
export declare class SetupHandler {
    ble: BleHandler;
    constructor(ble: any);
    setup(sphereUid: any, crownstoneId: any, meshAccessAddress: any, meshDeviceKey: any, ibeaconUUID: any, ibeaconMajor: any, ibeaconMinor: any): Promise<{}>;
    _performFastSetupV2(sphereUid: any, crownstoneId: any, meshDeviceKey: any, ibeaconUUID: any, ibeaconMajor: any, ibeaconMinor: any): Promise<void>;
    _performFastSetup(crownstoneId: any, meshAccessAddress: any, ibeaconUUID: any, ibeaconMajor: any, ibeaconMinor: any): Promise<void>;
    _handleSetupPhaseEncryption(): Promise<void>;
    _commandSetupV2(sphereUid: any, crownstoneId: any, adminKey: any, memberKey: any, basicKey: any, serviceDataKey: any, localizationKey: any, meshNetworkKey: any, meshAppKey: any, meshDeviceKey: any, ibeaconUUID: any, ibeaconMajor: any, ibeaconMinor: any): Promise<void>;
    _commandSetup(crownstoneId: any, adminKey: any, memberKey: any, guestKey: any, meshAccessAddress: any, ibeaconUUID: any, ibeaconMajor: any, ibeaconMinor: any): Promise<void>;
    _getSessionKey(): Promise<Buffer>;
    _getSessionNonce(): Promise<Buffer>;
}
