import { BleHandler }      from "./ble/BleHandler";
import { BluenetSettings } from "./BluenetSettings";
import { eventBus }        from "./util/EventBus";
import { ControlHandler }  from "./ble/modules/ControlHandler";
import { CloudHandler }    from "./cloud/CloudHandler";
import { Topics }          from "./topics/Topics";
import { SetupHandler }    from "./ble/modules/SetupHandler";

export default class Bluenet {
  ble: BleHandler;
  settings: BluenetSettings;
  control : ControlHandler;
  setup : SetupHandler;
  cloud : CloudHandler;

  constructor() {
    this.settings = new BluenetSettings();
    this.ble      = new BleHandler(this.settings);
    this.control  = new ControlHandler(this.ble);
    this.setup    = new SetupHandler(this.ble);
    this.cloud    = new CloudHandler();
  }

  /**
   *
   * @param keys
   * @param {string} referenceId
   * @param {boolean} encryptionEnabled
   */
  setSettings(keys : keyMap, referenceId="BluenetNodeJSLib", encryptionEnabled=true) {
    this.settings.loadKeys(encryptionEnabled, keys.adminKey, keys.memberKey, keys.basicKey, keys.serviceDataKey, keys.localizationKey, keys.meshNetworkKey, keys.meshAppKey, referenceId)
  }


  linkCloud(userData) {
    if (userData.adminKey !== undefined && userData.serviceDataKey !== undefined) {
      return new Promise((resolve, reject) => {
        console.log("Keys found in userData, no need to link Cloud.");
        this.settings.loadKeys(true, userData.adminKey, userData.memberKey, userData.basicKey, userData.serviceDataKey, userData.localizationKey, userData.meshNetworkKey, userData.meshAppKey, "UserData")
        resolve();
      })
    }
    else {
      return this.cloud.login(userData)
        .then(() => {
          return this.cloud.getKeys(userData.sphereId);
        })
        .then((keys : any) => {
          this.settings.loadKeys(true, keys.ADMIN_KEY, keys.MEMBER_KEY, keys.BASIC_KEY, keys.SERVICE_DATA_KEY, keys.LOCALIZATION_KEY, keys.MESH_NETWORK_KEY, keys.MESH_APPLICATION_KEY, "CloudData");
        })
    }
  }

  connect(connectData) : Promise<void> {
    return this.ble.connect(connectData)
      .then(() => {
        console.log("Getting Session Nonce...")
        return this.control.getAndSetSessionNonce()
      })
      .then(() => {
        console.log("Session Nonce Processed.")
      })
  }

  wait(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve() }, seconds * 1000);
    })
  }

  setupCrownstone(handle, sphereUid, crownstoneId, meshAccessAddress, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor) {
    return this.connect(handle)
      .then(() => {
        return this.setup.setup(sphereUid, crownstoneId, meshAccessAddress, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor)
      })
  }

  disconnect() {
    return this.ble.disconnect()
  }

  on(topic, callback) {
    return eventBus.on(topic, callback);
  }
}