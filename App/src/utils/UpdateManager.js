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
                Alert.alert('已是最新')
            } else {
                Alert.alert('提示', '需要更新', [
                    {
                        text: '是', onPress: () => {
                            this.doUpdate(info)
                        }
                    },
                    {
                        text: '否', onPress: () => {

                        }
                    },
                ]);

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