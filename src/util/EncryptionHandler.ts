import {UserLevel} from "../ble/BluenetSettings";


export class EncryptionHandler {

  
}


let BLOCK_LENGTH             = 16
let NONCE_LENGTH             = 16
let SESSION_DATA_LENGTH      = 5
let SESSION_KEY_LENGTH       = 4
let PACKET_USER_LEVEL_LENGTH = 1
let PACKET_NONCE_LENGTH      = 3
let CHECKSUM                 = 0xcafebabe

let BLUENET_ENCRYPTION_TESTING = false

class SessionData {
  sessionNonce  = null
  validationKey = null

  constructor(sessionData) {
    if (sessionData.length != SESSION_DATA_LENGTH) {
      //     BluenetBleException(BleError.INVALID_SESSION_DATA, "Invalid Session Data")
    }

    // this.sessionNonce = [0] * SESSION_DATA_LENGTH
    // this.validationKey = [0] * SESSION_KEY_LENGTH

    // for i in range(0, SESSION_KEY_LENGTH):
    //   this.sessionNonce[i] = sessionData[i]
    //   this.validationKey[i] = sessionData[i]

    this.sessionNonce[SESSION_DATA_LENGTH - 1] = sessionData[SESSION_DATA_LENGTH - 1]
  }
}


class EncryptedPackage {
  nonce = null
  userLevel = null
  payload = null

  constructor(dataArray) {
    let prefixLength = PACKET_NONCE_LENGTH + PACKET_USER_LEVEL_LENGTH
    // 20 is the minimal size of a packet (3+1+16)
    if (dataArray.length < 20) {
      // BluenetBleException(BleError.INVALID_ENCRYPTION_PACKAGE, "Invalid package for encryption. It is too short (min length 20) got " + str(len(dataArray)) + " bytes.")
    }

    this.nonce = dataArray.slice(0, PACKET_NONCE_LENGTH);

    if (dataArray[PACKET_NONCE_LENGTH] > 2 && dataArray[PACKET_NONCE_LENGTH] != UserLevel.setup) {
      // raise BluenetBleException(BleError.INVALID_ENCRYPTION_USER_LEVEL, "User level in read packet is invalid:" + str(dataArray[PACKET_NONCE_LENGTH]))
    }

    // try:
    //   this.userLevel = UserLevel(dataArray[PACKET_NONCE_LENGTH])
    // except ValueError:
    //   raise BluenetBleException(BleError.INVALID_ENCRYPTION_USER_LEVEL, "User level in read packet is invalid:" + str(dataArray[PACKET_NONCE_LENGTH]))

    let payload = dataArray(prefixLength)

    if (payload.length % 16 != 0) {
      // BluenetBleException(BleError.INVALID_ENCRYPTION_PACKAGE, "Invalid size for encrypted payload")
    }

    this.payload = payload
  }
}

    
  
  /**
class EncryptionHandler:
  
  static decryptSessionNonce(inputData, key):
  if len(inputData) == 16:
  decrypted = EncryptionHandler.decryptECB(inputData, key)
  checksum = Conversion.uint8_array_to_uint32(decrypted)
  if checksum == CHECKSUM:
  return [decrypted[4], decrypted[5], decrypted[6], decrypted[7], decrypted[8]]
  else:
  raise BluenetBleException(BleError.COULD_NOT_VALIDATE_SESSION_NONCE, "Could not validate the session nonce.")
  
  else:
  raise BluenetBleException(BleError.COULD_NOT_READ_SESSION_NONCE, "Could not read session nonce, maybe encryption is disabled?")
  
  
  @staticmethod
   decryptECB(uint8Array, key):
  aes = pyaes.AESModeOfOperationECB(key)
  
  stringPayload = "".join(chr(b) for b in uint8Array)
  
  decrypted = aes.decrypt(stringPayload)
  
  return decrypted
  
  
  @staticmethod
   encryptECB(uint8Array, key):
  aes = pyaes.AESModeOfOperationECB(key)
  
  stringPayload = "".join(chr(b) for b in uint8Array)
  
  encrypted = aes.encrypt(stringPayload)
  
  return encrypted
  
  
  @staticmethod
   decryptCTR(data, packetNonce, sessionNonce, key):
  IV = EncryptionHandler.generateIV(packetNonce, sessionNonce)
  
  stringPayload = "".join(chr(b) for b in data)
  
  aes = pyaes.AESModeOfOperationCTR(key, counter=IVCounter(IV))
  
  decryptedData = aes.decrypt(stringPayload)
  
  return decryptedData
  
  
  @staticmethod
   decrypt(data, settings):
  if settings.sessionNonce is null:
  raise BluenetBleException(BleError.NO_SESSION_NONCE_SET, "Can't Decrypt: No session nonce set")
  
  if settings.userLevel == UserLevel.unknown:
  raise BluenetBleException(BleError.NO_ENCRYPTION_KEYS_SET, "Can't Decrypt: No encryption keys set.")
  
  //unpack the session data
  sessionData = SessionData(settings.sessionNonce)
  package = EncryptedPackage(data)
  
  key = EncryptionHandler._getKeyForLevel(package.userLevel, settings)
  
  // decrypt data
  decrypted = EncryptionHandler.decryptCTR(package.payload, package.nonce, sessionData.sessionNonce, key)
  
  return EncryptionHandler._verifyDecryption(decrypted, sessionData.validationKey)
  
  
  @staticmethod
   _verifyDecryption(decrypted, validationKey):
  // the conversion to uint32 only takes the first 4 bytes
  if Conversion.uint8_array_to_uint32(decrypted) == Conversion.uint8_array_to_uint32(validationKey):
  // remove checksum from decryption and return payload
  result = [0] * (len(decrypted) - SESSION_KEY_LENGTH)
  for i in range(0,len(result)):
  result[i] = decrypted[i+SESSION_KEY_LENGTH]
  return result
  
  else:
  raise BluenetBleException(BleError.ENCRYPTION_VALIDATION_FAILED, "Failed to validate result, Could not decrypt")
  
  
  @staticmethod
   getRandomNumber(testing=false):
  if testing:
  return 128
  return random.randint(0,255)
  
  
  @staticmethod
   encryptCTR(dataArray, packetNonce, sessionNonce, key):
  sessionData = SessionData(sessionNonce)
  
  IV = EncryptionHandler.generateIV(packetNonce, sessionNonce)
  
  // calculate the amount of blocks
  amountOfBlocks = int(math.ceil(float(SESSION_KEY_LENGTH + len(dataArray)) / float(BLOCK_LENGTH)))
  
  // create buffer that is zero padded
  paddedPayload = [0] * amountOfBlocks * BLOCK_LENGTH
  
  // fill the payload with the key and the data
  for i in range(0, SESSION_KEY_LENGTH):
  paddedPayload[i] = sessionData.validationKey[i]
  
  for i in range(0, len(dataArray)):
  paddedPayload[i + SESSION_KEY_LENGTH] = dataArray[i]
  
  stringPayload = "".join(chr(b) for b in paddedPayload)
  
  aes = pyaes.AESModeOfOperationCTR(key, counter=IVCounter(IV))
  
  encryptedData = aes.encrypt(stringPayload)
  
  return encryptedData
  
  @staticmethod
   encrypt(dataArray, settings):
  if settings.sessionNonce is null:
  raise BluenetBleException(BleError.NO_SESSION_NONCE_SET, "Can't Decrypt: No session nonce set")
  
  if settings.userLevel == UserLevel.unknown:
  raise BluenetBleException(BleError.NO_ENCRYPTION_KEYS_SET, "Can't Decrypt: No encryption keys set.")
  
  packetNonce = [0] * PACKET_NONCE_LENGTH
  // create a random nonce
  for i in range(0, PACKET_NONCE_LENGTH):
  packetNonce[i] = EncryptionHandler.getRandomNumber()
  
  key = EncryptionHandler._getKey(settings)
  encryptedData = EncryptionHandler.encryptCTR(dataArray, packetNonce, settings.sessionNonce, key)
  
  result = packetNonce + [settings.userLevel.value]
  
  for byte in encryptedData:
  result.append(byte)
  
  return bytes(result)
  
  
  @staticmethod
   _getKey(settings):
  return EncryptionHandler._getKeyForLevel(settings.userLevel, settings)
  
  @staticmethod
   _getKeyForLevel(userLevel, settings):
  if settings.initializedKeys == false and userLevel != UserLevel.setup:
  raise BluenetBleException(BleError.NO_ENCRYPTION_KEYS_SET, "Could not encrypt: Keys not set.")
  
  key = null
  if userLevel == UserLevel.admin:
  key = settings.adminKey
  elif userLevel == UserLevel.member:
  key = settings.memberKey
  elif userLevel == UserLevel.guest:
  key = settings.guestKey
  elif userLevel == UserLevel.setup:
  key = settings.setupKey
  else:
  raise BluenetBleException(BleError.NO_ENCRYPTION_KEYS_SET, "Could not encrypt: Invalid key for encryption.")
  
  if key is null:
  raise BluenetBleException(BleError.NO_ENCRYPTION_KEYS_SET, "Could not encrypt: Keys not set.")
  
  return key
  
  
  @staticmethod
   generateIV(packetNonce, sessionData):
  if len(packetNonce) != PACKET_NONCE_LENGTH:
  raise BluenetBleException(BleError.INVALID_SESSION_NONCE, "Invalid size for session nonce packet")
  
  IV = [0] * NONCE_LENGTH
  
  // the IV used in the CTR mode is 8 bytes, the first 3 are random
  for i in range(0,PACKET_NONCE_LENGTH):
  IV[i] = packetNonce[i]
  
  // the IV used in the CTR mode is 8 bytes, the last 5 are from the session data
  for i in range(0,SESSION_DATA_LENGTH):
  IV[i + PACKET_NONCE_LENGTH] = sessionData[i]
  
  return IV


 class IVCounter(object):
 """
 A counter object for the Counter (CTR) mode of operation.

 To create a custom counter, you can usually just override the
 increment method.
 """

  __init__( initialList):

 // Convert the value into an array of bytes long
 this._counter = initialList

 value = property(lambda s: s._counter)

  increment():
 this._counter[len(this._counter)-1] += 1


   */