import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Keyboard,
    Alert, Platform
} from 'react-native';
import ColorRes from "../config/ColorRes";
import StorageHelper from "../utils/StorageHelper.js";
import HttpManager from '../utils/HttpManager'
import Utils from '../utils/Utils'
import dimenRes from "../config/DimenRes";

export default class RegisterPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            pwd: '',
            confirm: '', //确认密码
            registerCode: '', //注册码
            question: '', //密保问题
            answer: '', //密保答案
            isShowClear: false
        };
        this.phoneRegex = /^[1][345789]{1}[0-9]{1}\d{8}$/;
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '注册',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#DD433B'
            },
        }
    };
    /**
     * 注册账号
     */
    register = () => {
        if (Utils.isEmpty(this.state.account)
            || Utils.isEmpty(this.state.pwd)
            || Utils.isEmpty(this.state.confirm)
            || Utils.isEmpty(this.state.registerCode)
            || Utils.isEmpty(this.state.question)
            || Utils.isEmpty(this.state.answer)
        ) {
            Alert.alert("您还有空白项未填写");
            return
        }

        if (!this.phoneRegex.test(parseInt(this.state.account))) {
            Alert.alert("您输入的手机号格式不正确");
            return
        }

        if (this.state.pwd !== this.state.confirm) {
            Alert.alert("您两次输入的密码不一致");
            return
        }

        HttpManager
            .register(this.state.account, this.state.pwd, this.state.registerCode, this.state.question, this.state.answer)
            .then((response) => {
                if (response.data.code === 200) {
                    StorageHelper.setUID(String(response.data.data.uid));
                    StorageHelper.setPhone(String(this.state.account))
                } else {
                    Alert.alert(response.data.msg)
                }
            }).catch((e) => {
            Alert.alert(String(e));
        })
    };

    render() {
        return (
            <View style={{backgroundColor: ColorRes.grayBackgroud, width: '100%', height: '100%'}}>
                <Text style={{
                    color: ColorRes.fontGray,
                    fontSize: 12,
                    marginTop: 20,
                    marginBottom: 8,
                    marginLeft: dimenRes.pageBorder
                }}>请填写账号信息</Text>

                {/*注册码*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>注册码:</Text>
                    <TextInput
                        value={this.state.registerCode}
                        placeholder='请输入注册码'
                        placeholderTextColor='#aaa'
                        keyboardType={'email-address'}
                        returnKeyType={'done'}
                        onChangeText={
                            (text) => {
                                this.setState({
                                    registerCode: text
                                })
                            }
                        }
                        underlineColorAndroid="transparent"
                        style={Style.item_input}>

                    </TextInput>
                </View>
                <View style={Style.item_line}/>
                {/*手机号*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>手机号:</Text>
                    <TextInput
                        value={this.state.account}
                        keyboardType={'numeric'}
                        placeholderTextColor='#aaa'
                        returnKeyType={'done'}
                        placeholder='请输入手机号'
                        onChangeText={
                            (text) => {
                                this.setState({
                                    account: text
                                })
                            }
                        }
                        underlineColorAndroid="transparent"
                        style={Style.item_input}>

                    </TextInput>
                </View>
                <View style={Style.item_line}/>

                {/*密码*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>密码:</Text>
                    <TextInput
                        value={this.state.pwd}
                        secureTextEntry={true}
                        placeholder='请输入密码'
                        returnKeyType={'done'}
                        placeholderTextColor='#aaa'
                        onChangeText={
                            (text) => {
                                this.setState({
                                    pwd: text
                                })
                            }
                        }
                        underlineColorAndroid="transparent"
                        style={Style.item_input}>

                    </TextInput>
                </View>
                <View style={Style.item_line}/>
                {/*确认密码*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>确认密码:</Text>

                    <TextInput
                        value={this.state.confirm}
                        placeholder='请再次输入密码'
                        returnKeyType={'done'}
                        secureTextEntry={true}
                        placeholderTextColor='#aaa'
                        onChangeText={
                            (text) => {
                                this.setState({
                                    confirm: text
                                })
                            }
                        }
                        underlineColorAndroid="transparent"
                        style={Style.item_input}>

                    </TextInput>
                </View>
                <View style={Style.item_line}/>

                <Text style={{
                    color: ColorRes.fontGray,
                    fontSize: 12,
                    marginTop: 20,
                    marginBottom: 8,
                    marginLeft: dimenRes.pageBorder
                }}>密保问题，有助于您找回密码</Text>

                {/*密保问题*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>密保问题:</Text>
                    {
                        Platform.OS === 'ios' ?
                            <TextInput
                                underlineColorAndroid="transparent"
                                placeholder='请输入您想设置的问题'
                                returnKeyType={'done'}
                                onEndEditing={
                                    (evt) => {
                                        this.setState({
                                            question: evt.nativeEvent.text
                                        })
                                    }
                                }
                                value={this.state.question}
                                style={Style.item_input}>

                            </TextInput>
                            : <TextInput
                                underlineColorAndroid="transparent"
                                placeholder='请输入您想设置的问题'
                                returnKeyType={'done'}
                                onChangeText={
                                    (evt) => {
                                        this.setState({
                                            question: evt
                                        })
                                    }
                                }
                                value={this.state.question}
                                style={Style.item_input}>

                            </TextInput>
                    }
                </View>
                <View style={Style.item_line}/>

                {/*密保答案*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>密保答案:</Text>
                    {
                        Platform.OS === 'ios' ?
                            <TextInput
                                underlineColorAndroid="transparent"
                                returnKeyType={'done'}
                                placeholder='请输入对应答案'
                                onEndEditing={
                                    (evt) => {
                                        this.setState({
                                            answer: evt.nativeEvent.text
                                        })
                                    }
                                }
                                value={this.state.answer}
                                style={Style.item_input}>

                            </TextInput>
                            : <TextInput
                                underlineColorAndroid="transparent"
                                returnKeyType={'done'}
                                placeholder='请输入对应答案'
                                onChangeText={
                                    (evt) => {
                                        this.setState({
                                            answer: evt
                                        })
                                    }
                                }
                                value={this.state.answer}
                                style={Style.item_input}>

                            </TextInput>
                    }
                </View>
                <View style={Style.item_line}/>
                <TouchableOpacity
                    style={[Style.style_login_button, {
                        position: 'absolute',
                        bottom: 30,
                        right: 30,
                        left: 30
                    }]}
                    onPress={() => this.register()}
                >
                    <Text style={{fontSize: 16, color: '#fff'}}>
                        注册
                    </Text>
                </TouchableOpacity>
            </View>

        );

    }
}

const Style = StyleSheet.create({
    item_bg: {
        backgroundColor: 'white',
        paddingLeft: dimenRes.pageBorder,
        paddingRight: dimenRes.pageBorder,
        height: dimenRes.itemHeight,
        alignItems: 'center',
        flexDirection: 'row'
    },
    item_key: {
        color: ColorRes.fontBlack,
        fontSize: 14,
        width: 70
    },
    item_input: {
        fontSize: 14,
        flex: 1,
        color: ColorRes.fontPlaceholder,
        padding: 0
    },
    item_line: {
        height: 1,
        width: dimenRes.pageBorder,
        backgroundColor: 'white'
    },
    style_login_button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dd433b'
    }
});
