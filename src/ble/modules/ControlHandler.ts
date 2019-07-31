import {BleHandler} from "../BleHandler";
import {CrownstoneCharacteristics} from "../../protocol/Characteristics";
import {CSServices} from "../../protocol/Services";
import {EncryptionHandler} from "../../util/EncryptionHandler";
import {ControlPacketsGenerator} from "../../protocol/ControlPackets";
import {BluenetErrorType} from "../../BluenetError";


export class ControlHandler {
  ble : BleHandler;


  constructor(ble) {
    this.ble = ble;
  }

  getAndSetSessionNonce() {
    return this.ble.readCharacteristicWithoutEncryption(CSServices.CrownstoneService, CrownstoneCharacteristics.SessionNonce)
      .then((rawNonce : Buffer) => {
        console.log("Got Nonce!")
        let decryptedNonce = EncryptionHandler.decryptSessionNonce(rawNonce, this.ble.settings.basicKey);

        console.log("Decrypted Nonce", decryptedNonce)
        this.ble.settings.setSessionNonce(decryptedNonce);
        console.log("Set Nonce")
      })
      .catch((err) => {
        if (err.type == BluenetErrorType.COULD_NOT_VALIDATE_SESSION_NONCE) {
          throw err;
        }
      })
  }


  setSwitchState(state: number) {
    let switchState = state*100;
    let packet = ControlPacketsGenerator.getSwitchStatePacket(switchState)
    return this._writeControlPacket(packet)
  }

  commandFactoryReset() {
    let packet = ControlPacketsGenerator.getCommandFactoryResetPacket()
    return this._writeControlPacket(packet)
  }

  disconnect() {
    let packet = ControlPacketsGenerator.getDisconnectPacket()
    return this._writeControlPacket(packet)
      .then(() => {
        let sessionId = this.ble.connectionSessionId;
        setTimeout(() => {
          if (sessionId === this.ble.connectionSessionId) {
            console.log("Forcing cleanup after disconnect command");
            if (this.ble.connectedPeripheral !== null) {
              this.ble.connectedPeripheral = null;
              this.ble.connectionPending = null;
            }
          }
        }, 2000)
      })
  }


  _writeControlPacket(packet: Buffer) : Promise<void> {
    return this.ble.writeToCharacteristic(CSServices.CrownstoneService, CrownstoneCharacteristics.Control, packet)
  }

}