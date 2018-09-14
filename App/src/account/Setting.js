import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,

} from 'react-native'
import StorageHelper from "../../src/utils/StorageHelper.js";
import ColorRes from "../config/ColorRes";

export default class Setting extends Component {

    static navigationOptions = {
        headerTitle: '设置',
        headerTintColor: '#fff'

    }

    render() {
        return (
            <View style={styles.container}>


                <TouchableOpacity
                    style={styles.style_login_button}
                    onPress={this.clickExitAction.bind(this)}>
                    <Text style={{fontSize: 16, color: '#fff'}}>
                        退出登录
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }


    /**
     * 退出登录事件（跳转到登录页面）
     * @private
     */
    async clickExitAction() {
        StorageHelper.setUID('')
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: '#ebebeb',
        width: '100%',
        height: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 8,
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
    },
    content_text: {
        marginLeft: 15,
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular',
        color: '#191919',
        flex: 1
    },
    content_switch: {
        marginRight: 16
    },
    exit_button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorRes.themeRed,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 24,
        height: 44,
        borderRadius: 4

    },
    exit_text: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular'
    },
    style_login_button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorRes.themeRed,
        position: 'absolute',
        bottom: 30,
        right: 30,
        left: 30
    }
});