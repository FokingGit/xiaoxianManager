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
import dimenRes from "../config/DimenRes";

export default class RegisterPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            pwd: '',
            isShowClear: false
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: '注册'
        }
    };


    render() {
        return (
            <View style={{backgroundColor: ColorRes.grayBackgroud, width: '100%', height: '100%'}}>
                <Text style={{
                    color: colorRes.fontGray,
                    fontSize: 12,
                    marginTop: 20,
                    marginBottom: 8,
                    marginLeft: dimenRes.pageBorder
                }}>账号信息</Text>

                <Text style={{
                    color: colorRes.fontGray,
                    fontSize: 12,
                    marginTop: 20,
                    marginBottom: 8,
                    marginLeft: dimenRes.pageBorder
                }}>密保问题</Text>

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
            </View>

        );

    }
}
