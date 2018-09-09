import {
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native'

const KEY_USER_ID = 'uid';
const KEY_USER_PHONE = 'phone'

const functions = {

    async setUID(uid) {
        try {
            await AsyncStorage.setItem(KEY_USER_ID, uid)
            DeviceEventEmitter.emit('LoginStateChange', uid);
        } catch (e) {
            console.log(e)
        }
    },
    getUID() {
        return AsyncStorage.getItem(KEY_USER_ID)
    },
    async setPhone(phone) {
        try {
            await AsyncStorage.setItem(KEY_USER_PHONE, phone)
        } catch (e) {
            console.log(e)
        }
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