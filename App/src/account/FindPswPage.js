import React, {Component} from 'react'
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import Style from '../config/StyleRes'
import ColorRes from "../config/ColorRes";
import Util from "../utils/Utils"
import HttpManager from "../utils/HttpManager"
import NativeManager from "../native/native"

/**
 * 找回密码
 */
export default class FindPswPage extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '找回密码',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#DD433B'
            },
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            question: '',
            answer: '',
            newPsw: '',
            confirmNewPsw: '',
            isLoadingQuestion: false
        }
    }

    /**
     * 获取密保问题
     */
    fetchQuestion = () => {
        if (Util.isEmpty(this.state.account)) {
            Alert.alert("提示", "您还未输入账号")
            return
        }
        this.setState({
            isLoadingQuestion: true
        });
        HttpManager
            .findEncrypted(this.state.account)
            .then((response) => {
                if (response.data.code === 200) {
                    this.setState({
                        isLoadingQuestion: false,
                        question: response.data.data.encrypted
                    });
                } else {
                    Alert.alert("提示", "获取失败，请稍后重试")
                    this.setState({
                        isLoadingQuestion: false,
                    });
                }
            })
            .catch((e) => {
                Alert.alert("提示", "获取失败，请稍后重试")
                this.setState({
                    isLoadingQuestion: false,
                });
            })


    };

    /**
     * 忘记密码
     */
    forgetPassword = () => {
        if (Util.isEmpty(this.state.account)
            || Util.isEmpty(this.state.answer)
            || Util.isEmpty(this.state.newPsw)
            || Util.isEmpty(this.state.confirmNewPsw)) {
            Alert.alert("提示", "您还有未填写项");
            return;
        }
        if (this.state.newPsw.trim() !== this.state.confirmNewPsw.trim()) {
            Alert.alert("提示", "您两次输入的密码不一致");
            return;
        }

        HttpManager
            .findBackpass(this.state.account.trim(), this.state.answer.trim(), this.state.newPsw.trim())
            .then((response) => {
                if (response.data.code === 200) {
                    if (this.props.navigation.state.params.isForget) {
                        NativeManager.nativeUtil.showToast("设置密码成功,请重新登陆");
                    } else {
                        NativeManager.nativeUtil.showToast("密码修改成功");
                    }
                    this.props.navigation.goBack()
                } else {
                    Alert.alert("提示", response.data.code.msg)
                }
            })
            .catch((e) => {
                Alert.alert("提示", "操作失败，请稍后重试")
            })


    };


    render() {
        return (
            <View style={{flex: 1}}>
                {/*账号*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>账号:</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder='请输入您的账号'
                        onChangeText={
                            (text) => {
                                this.setState({
                                    account: text
                                })
                            }
                        }
                        value={this.state.account}
                        style={[Style.item_input, {color: 'black'}]}>
                    </TextInput>
                </View>
                <View style={Style.item_line}/>

                {/*密保问题*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>密保问题:</Text>
                    <Text
                        style={[Style.item_input, {color: 'black'}]}>{this.state.question}
                    </Text>

                    <View style={[Style.list_content_watchReportTouch, {height: 25, marginRight: 0}]}>
                        {
                            this.state.isLoadingQuestion ?
                                <ActivityIndicator
                                    size={"small"}
                                    color={'white'}
                                /> : <TouchableOpacity
                                    onPress={() => {
                                        this.fetchQuestion();
                                    }
                                    }>
                                    <Text style={{color: 'white', fontSize: 10}}>获取密保问题</Text>
                                </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={Style.item_line}/>

                {/*密保*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>密保答案:</Text>
                    <TextInput
                        placeholder='请输入您的密保答案'
                        underlineColorAndroid="transparent"
                        onChangeText={
                            (text) => {
                                this.setState({
                                    answer: text
                                })
                            }
                        }
                        value={this.state.answer}
                        style={[Style.item_input, {color: 'black'}]}>
                    </TextInput>
                </View>
                <View style={Style.item_line}/>
                {/*新密码*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>新密码:</Text>
                    <TextInput
                        placeholder='请输入您的新密码'
                        secureTextEntry={true}
                        underlineColorAndroid="transparent"
                        onChangeText={
                            (text) => {
                                this.setState({
                                    newPsw: text
                                })
                            }
                        }
                        value={this.state.newPsw}
                        style={[Style.item_input, {color: 'black'}]}>
                    </TextInput>
                </View>
                <View style={Style.item_line}/>
                {/*密码确认*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>确认密码:</Text>
                    <TextInput
                        placeholder='请再次输入您的新密码'
                        secureTextEntry={true}
                        underlineColorAndroid="transparent"
                        onChangeText={
                            (text) => {
                                this.setState({
                                    confirmNewPsw: text
                                })
                            }
                        }
                        value={this.state.confirmNewPsw}
                        style={[Style.item_input, {color: 'black'}]}>
                    </TextInput>
                </View>
                <TouchableOpacity
                    style={[Style.style_login_button, {
                        position: 'absolute',
                        bottom: 30,
                        right: 30,
                        left: 30
                    }]}
                    onPress={() => {
                        this.forgetPassword();
                    }}

                >
                    <Text style={{fontSize: 16, color: '#fff'}}>
                        确认
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }
}