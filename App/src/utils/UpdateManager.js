import React, {
    Component,
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Platform,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Linking,
} from 'react-native';

import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';

import _updateConfig from '../../update.json';

const {appKey} = _updateConfig[Platform.OS];
const functions = {
    checkUpdate() {
        checkUpdate(appKey).then(info => {
            if (info.expired) {
            } else if (info.upToDate) {

            } else {
                this.doUpdate(info)
            }
        });
    },

    doUpdate(info) {
        downloadUpdate(info).then(hash => {
            switchVersionLater(hash)
        });
    }
};
module.exports = {...functions};