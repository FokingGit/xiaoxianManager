import React, {Component} from "react"
import {
    View,
    ScrollView,
    Text,
    Image, Platform, ActivityIndicator
} from "react-native";
import Util from '../utils/Utils'
import ColorRes from "../config/ColorRes";
import NativeManager from "../native/native";

export default class GetRegisterCodePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '获取注册码',
            headerTintColor: '#fff'
        }
    };

    render() {
        return (
            <ScrollView>
                <Text style={{fontSize: 15, marginTop: 10, marginBottom: 10, marginLeft: 10}}>1.添加客服微信</Text>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Image style={{alignItems: 'center'}}
                           source={require('../../assets/images/weChat_service.png')}/></View>

                <Text style={{fontSize: 15, marginTop: 10, marginBottom: 10, marginLeft: 10}}>2.联系客服,转账获取注册码</Text>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Image source={require('../../assets/images/getCode.png')}/></View>
                <Text style={{fontSize: 15, marginTop: 10, marginBottom: 10, marginLeft: 10}}>3.填写注册码,继续注册</Text>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Image source={require('../../assets/images/register.png')}/></View>

            </ScrollView>
        )

    }
}