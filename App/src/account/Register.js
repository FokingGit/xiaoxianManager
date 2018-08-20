import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import ColorRes from "../config/ColorRes";
import StorageHelper from "../utils/StorageHelper.js";
import HttpManager from '../utils/HttpManager'

export default class RegisterPage extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            pwd: '',
            isShowClear: false
        }
    }

    /**
     * 登录按钮事件
     */
    loginEvent() {
        if (this.state.account.length === 0) {
            Alert.alert('提示', '请输入账号')
            return
        } else if (this.state.pwd.length === 0) {
            Alert.alert('提示', '请输入密码')
            return
        }
        let loginThis = this
        HttpManager.login(this.state.account, this.state.pwd)
            .then(function (response) {
                if (response.data.code == 200) {
                    StorageHelper.setUID(response.data.data.id);
                    StorageHelper.setPhone(this.state.account)
                } else {
                    alert('请检查用户名和密码！')
                }
            })
            .catch(function (error) {
                alert(error)
            })
    }

    /**
     * 监听账号输入框输入
     * @param text 输入账号
     */
    accountTextDidChange(text) {
        this.setState({
            account: text,
            isShowClear: text.length > 0 ? true : false
        });
    }

    /**
     * 监听密码输入框输入
     * @param text 输入密码
     */
    passwordTextDidChange(text) {
        this.setState({
            pwd: text
        });
    }

    /**
     * 清空账号输入内容
     */
    clearAccountTextEvent() {
        this.setState({
            account: '',
            isShowClear: false
        });
    }

    /**
     * 键盘回收事件
     */
    dissmissKeyboardEvent() {
        Keyboard.dismiss()
    }

    render() {
        return (
            <TouchableOpacity style={styles.container}
                              onPress={this.dissmissKeyboardEvent.bind(this)}
                              activeOpacity={1}>
                <View style={styles.input_background_view}>

                    <Image style={{height: 30, width: 30, marginLeft: 16}}
                           source={require('../../assets/images/login_account_icon.png')}/>
                    <TextInput style={{marginLeft: 5, marginRight: 5, flex: 1}}
                               placeholder='请输入账号'
                               autoFocus={true}
                               placeholderTextColor='#aaa'
                               underlineColorAndroid="transparent"
                               returnKeyType='next'
                               selectionColor={ColorRes.themeRed}
                               onChangeText={this.accountTextDidChange.bind(this)}
                               value={this.state.account}/>
                    <View style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                        {this.state.isShowClear ?
                            <TouchableOpacity onPress={this.clearAccountTextEvent.bind(this)}>
                                <Image style={{width: 16, height: 16, marginRight: 17}}
                                       source={require('../../assets/images/login_account_clear.png')}/>
                            </TouchableOpacity>
                            : null}

                    </View>
                </View>

                <View style={[styles.input_background_view, {marginTop: 16}]}>
                    <Image style={{height: 30, width: 30, marginLeft: 16}}
                           source={require('../../assets/images/login_password_icon.png')}/>
                    <TextInput style={{marginLeft: 5, marginRight: 45, flex: 1}}
                               placeholder='请输入密码'
                               secureTextEntry={true}
                               selectionColor={ColorRes.themeRed}
                               placeholderTextColor='#aaa'
                               underlineColorAndroid="transparent"
                               onChangeText={this.passwordTextDidChange.bind(this)}
                               value={this.state.pwd}
                               returnKeyType='search'/>
                </View>
                <TouchableOpacity style={[styles.style_login_button, {
                    position: 'absolute',
                    bottom: 30,
                    right:30,
                    left: 30
                }]}
                                  onPress={this.loginEvent.bind(this)}
                >
                    <Text style={{fontSize: 16, color: '#fff'}}>
                        登录
                    </Text>
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginLeft: 30,
                    marginRight: 30,
                    paddingRight: 20,
                    height: 50,
                }}>
                    <Text style={{fontSize: 12, color: '#dd433b'}}>立即注册</Text>
                </View>

            </TouchableOpacity>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#f2f2f2'
    },
    style_imageBackground: {
        alignItems: 'center',
        width: '100%',
        height: 292,
    },
    style_icon: {
        marginTop: 82,
        width: 80,
        height: 80
    },
    style_title: {
        fontSize: 18,
        marginTop: 10
    },
    input_background_view: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        marginLeft: 30,
        marginRight: 30,
        height: 50,

    },
    style_login_button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dd433b'
    }

});