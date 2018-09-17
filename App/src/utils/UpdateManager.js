import React, {} from 'react';

import {
    Alert,
    Platform,
} from 'react-native';

import {
    checkUpdate,
    downloadUpdate, markSuccess,
    switchVersionLater,
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