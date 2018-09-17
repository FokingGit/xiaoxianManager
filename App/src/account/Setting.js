import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet, FlatList, Image,

} from 'react-native'
import StorageHelper from "../../src/utils/StorageHelper.js";
import ColorRes from "../config/ColorRes";
import Constants from "../config/Constants";

var listData = [
    {"title": "修改密码", "img": require('../../assets/images/me_setting.png')}
]
export default class Setting extends Component {

    static navigationOptions = {
        headerTitle: '设置',
        headerTintColor: '#fff'

    };
    keyExtractor = (item, index) => item.title
    /**
     * 列表的每一行
     * @param item
     * @param index
     * @returns {*}
     */
    renderItem = (item, index) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    this.clickItem(item, index)
                }}
                style={styles.style_listView_content}>
                <Text style={styles.style_listView_text}>{item.title}</Text>
                <Text style={styles.style_listView_subText}>{index === 1 ? Constants.VERSION_NAME : ''}</Text>
                {
                    index === 0 ?
                        <Image style={styles.style_listView_arrow}
                               source={require('../../assets/images/me_list_arrow.png')}/> : null
                }
            </TouchableOpacity>
        )
    };

    /**
     * 点击cell
     * @param item
     * @param index
     */
    clickItem = (item, index) => {
        if (index === 0) {
            this.props.navigation.navigate({
                routeName: "FINDPSW",
                params: {
                    isForget: false
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList data={listData}
                          renderItem={({item, index}) => this.renderItem(item, index)}
                          keyExtractor={this.keyExtractor}
                          extraData={this.state}
                          style={styles.style_listView} alwaysBounceVertical={false}
                />


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
    },
    style_listView_content: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d1d1d1',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: 50,
        backgroundColor: '#fff'
    },
    style_listView_text: {
        marginLeft: 15,
        fontSize: 16,
        textAlign: 'left',
        flex: 1,
        color: '#191919',
        fontFamily: 'PingFangSC-Regular'
    },
    style_listView_subText: {
        fontSize: 16,
        color: '#999999',
        fontFamily: 'PingFangSC-Regular',
        marginRight: 12
    },
    style_listView_arrow: {
        marginRight: 15,
        width: 9,
        height: 14
    }
});