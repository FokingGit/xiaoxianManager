import {
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native'

const KEY_USER_ID = 'uid';
const KEY_USER_PHONE = 'phone'

const functions = {

    setUID(uid) {
        DeviceEventEmitter.emit('LoginStateChange', uid);
        return AsyncStorage.setItem(KEY_USER_ID, uid)
    },
    getUID() {
        return AsyncStorage.getItem(KEY_USER_ID)
    },
    setPhone(phone) {
        return AsyncStorage.setItem(KEY_USER_PHONE, phone)
    },
    getPhone() {
        return AsyncStorage.getItem(KEY_USER_PHONE)
    },
    async checkLoginState() {
        try {
            let userId = await AsyncStorage.getItem(KEY_USER_ID);
            DeviceEventEmitter.emit('LoginStateChange', userId.length > 0 ? userId : null)
        } catch (e) {
            DeviceEventEmitter.emit('LoginStateChange', null)
        }
    },

};

module.exports = {...functions};