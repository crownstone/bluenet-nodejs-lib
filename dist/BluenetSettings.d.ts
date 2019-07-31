/// <reference types="node" />
export declare const UserLevel: {
    admin: number;
    member: number;
    basic: number;
    setup: number;
    unknown: number;
};
export declare class BluenetSettings {
    encryptionEnabled: boolean;
    adminKey: Buffer;
    memberKey: Buffer;
    basicKey: Buffer;
    serviceDataKey: Buffer;
    localizationKey: Buffer;
    meshNetworkKey: Buffer;
    meshAppKey: Buffer;
    setupKey: Buffer;
    referenceId: string;
    sessionNonce: Buffer;
    initializedKeys: boolean;
    temporaryDisable: boolean;
    userLevel: number;
    loadKeys(encryptionEnabled: any, adminKey: string, memberKey: string, basicKey: string, serviceDataKey: string, localizationKey: string, meshNetworkKey: string, meshAppKey: string, referenceId: any): void;
    _prepKey(key: any): Buffer;
    determineUserLevel(): void;
    invalidateSessionNonce(): void;
    setSessionNonce(sessionNonce: any): void;
    loadSetupKey(setupKey: any): void;
    exitSetup(): void;
    disableEncryptionTemporarily(): void;
    restoreEncryption(): void;
    isTemporarilyDisabled(): boolean;
    isEncryptionEnabled(): boolean;
}
