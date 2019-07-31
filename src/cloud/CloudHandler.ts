import {BluenetSettings} from "../BluenetSettings";
import {CLOUD} from "./cloudAPI";
const sha1 = require('sha-1');

export class CloudHandler {

  token  = null;
  userId = null;

  constructor() {}

  login(userData) {
    return this._login(userData)
      .then((result : any) => {
        CLOUD.setAccess(result.id);
        CLOUD.setUserId(result.userId);

        this.token = result.id;
        this.userId = result.userId;
      })
  }


  getKeys(sphereId) {
    return CLOUD.forUser(this.userId).getKeys(sphereId)
      .then((results) => {
        if (sphereId) {
          for (let i = 0; i < results.length; i++) {
            if (results[i].sphereId === sphereId) {
              let keyData = {};
              for (let j = 0; j < results[i].sphereKeys.length; j++) {
                let key = results[i].sphereKeys[j];
                if (key.ttl == 0) {
                  keyData[key.keyType] = key.key;
                }
              }
              return keyData
            }
          }
          throw ("Unknown SphereId Provided")
        }
        else {
          throw ("No SphereId Provided")
        }
      })
  }

  _login(userData) {
    return new Promise((resolve, reject) => {
      if (userData.email && userData.password) {
        let password = sha1(userData.password);
        resolve(CLOUD.login({
          email: userData.email,
          password: password,
          onUnverified: () => { reject("User has not validated their email yet.")},
          onInvalidCredentials: () => { reject("Invalid Credentials")}
        }))
      }
      else if (userData.email && userData.sha1Password) {
        resolve(CLOUD.login({
          email: userData.email,
          password: userData.sha1Password,
          onUnverified: () => { reject("User has not validated their email yet.")},
          onInvalidCredentials: () => { reject("Invalid Credentials")}
        }))
      }
      else if (userData.userId && userData.token) {
        resolve({userId: userData.userId, id: userData.token})
      }
      else if (userData.token) {
        CLOUD.setAccess(userData.token);
        resolve(CLOUD.getUserId().then((result) => { return {userId: result, id: userData.token}}))
      }
      else {
        reject("Invalid user data.")
      }
    })
  }
}