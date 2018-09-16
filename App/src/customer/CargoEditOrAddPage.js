import React, {Component} from 'react'
import colorRes from "../config/ColorRes";
import dimenRes from "../config/DimenRes";
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    TouchableWithoutFeedback,
    StyleSheet, BackHandler, DeviceEventEmitter
} from "react-native";
import styleRes from '../config/StyleRes'
import Util from '../utils/Utils'
import DateTimePicker from 'react-native-modal-datetime-picker'
import HttpManager from "../utils/HttpManager";
import Constant from "../config/Constants";

let dateMap = new Map();
dateMap.set('Jan', '01');
dateMap.set('Feb', '02');
dateMap.set('Mar', '03');
dateMap.set('Apr', '04');
dateMap.set('May', '05');
dateMap.set('Jun', '06');
dateMap.set('Jul', '07');
dateMap.set('Aug', '08');
dateMap.set('Sep', '09');
dateMap.set('Oct', '10');
dateMap.set('Nov', '11');
dateMap.set('Dec', '12');

/**
 * 商品的新建和编辑页面
 */
export default class CargoEditOrAddPage extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            cargo_name: '',
            cargo_price: 0,
            deal_time: 0,
            customer_reason: '',
            isCreate: true,
            isDateTimePickerVisible: false
        })
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{color: '#ffffff', fontSize: 20}}>
                        {navigation.state.params.isCreate ? '新建商品' : '编辑商品'}
                    </Text>
                </View>),
            headerStyle: {
                backgroundColor: colorRes.themeRed
            },
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        if (!Util.isEmpty(navigation.state.params) && navigation.state.params.isDatachange()) {
                            Alert.alert('商品信息尚未保存,是否退出', null,
                                [
                                    {text: "取消"},
                                    {
                                        text: "退出", onPress: () => {
                                            navigation.goBack()
                                        }
                                    },
                                ]);
                        } else {
                            navigation.goBack()
                        }
                    }}
                >
                    <Text style={{color: '#ffffff', fontSize: 16, marginLeft: 8}}>
                        取消
                    </Text>
                </TouchableOpacity>
            ),
            headerRight: (
                <Text style={{color: colorRes.themeRed, fontSize: 16, marginLeft: 8}}>
                    取消
                </Text>
            ),
            gesturesEnabled: false
        }
    };
    showExitAlert = () => {
        if (this.isDatachange()) {
            Alert.alert('商品信息尚未保存,是否退出', null,
                [
                    {text: "取消"},
                    {
                        text: "退出", onPress: () => {
                            this.props.navigation.goBack()
                        }
                    },
                ]);
            return true
        }
    };

    componentWillMount() {
        let params = this.props.navigation.state.params;
        if (params) {
            if (params.isCreate) {
                //新建商品
                this.setState({
                    isCreate: true
                })
            } else {
                //编辑商品
                this.setState({
                    isCreate: false,
                    cargo_name: params.cargoInfo.cargo_name,
                    cargo_price: params.cargoInfo.cargo_price,
                    deal_time: params.cargoInfo.deal_time,
                    customer_reason: params.cargoInfo.customer_reason,
                })
            }
        }
        this.props.navigation.setParams({
            isCreate: this.props.navigation.state.params.isCreate,
            isDatachange: this.isDatachange
        });

        BackHandler.addEventListener('hardwareBackPress', this.showExitAlert);
    }

    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.showExitAlert);
    }

    getRegisterDate = (date) => {
        date = parseInt(date)
        if (Util.isEmpty(date) || date === 0) {
            return ''
        } else {
            let registerDate = new Date(date * 1000);
            return `${registerDate.getFullYear()}-${registerDate.getMonth() + 1}-${registerDate.getDate()}`;
        }
    };

    extracted = (date) => {
        let registerDate = date.toString().split(' ');
        let month = dateMap.get(registerDate[1])
        let day = registerDate[2];
        let year = registerDate[3];

        let dateStr = `${year}-${month}-${day}`;
        console.log(dateStr)
        let time = parseInt(new Date(dateStr).getTime() / 1000);
        console.log(time)
        this.setState({
            isDateTimePickerVisible: false,
            deal_time: time
        })
    };


    /**
     * 编辑的时候判断数据发生变化
     *
     * */
    isDatachange = () => {
        if (!this.state.isCreate) {
            let params = this.props.navigation.state.params;
            if (this.state.cargo_name === params.cargoInfo.cargo_name
                && this.state.cargo_price === params.cargoInfo.cargo_price
                && this.state.deal_time === params.cargoInfo.deal_time
                && this.state.customer_reason === params.cargoInfo.customer_reason
            ) {
                return false
            }
        }
        return true;
    };

    render() {
        return (
            <View style={{backgroundColor: colorRes.grayBackgroud, width: '100%', height: '100%'}}>
                <Text style={{
                    color: colorRes.fontGray,
                    fontSize: 12,
                    marginTop: 20,
                    marginBottom: 8,
                    marginLeft: dimenRes.pageBorder
                }}>请根据情况完善以下资料</Text>

                {/*商品名称*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>商品名称:</Text>
                    {
                        <TextInput
                                underlineColorAndroid="transparent"
                                onChangeText={
                                    (text) => {
                                        this.setState({
                                            cargo_name: text
                                        })
                                    }
                                }
                                value={this.state.cargo_name}
                                style={Style.item_input}>
                            </TextInput>
                    }

                </View>
                <View style={Style.item_line}/>

                {/*商品价格*/}
                <View style={Style.item_bg}>
                    <Text style={Style.item_key}>商品价格:</Text>
                    <TextInput
                        value={String(this.state.cargo_price)}
                        onChangeText={
                            (text) => {
                                this.setState({
                                    cargo_price: text
                                })
                            }
                        }
                        underlineColorAndroid="transparent"
                        style={Style.item_input}>

                    </TextInput>
                </View>
                <View style={Style.item_line}/>

                {/*成交时间*/}
                <TouchableWithoutFeedback
                    onPress={
                        () => this.setState({isDateTimePickerVisible: true})
                    }
                >
                    <View style={Style.item_bg}>
                        <Text style={Style.item_key}>成交时间:</Text>
                        <Text style={{
                            fontSize: 14,
                            color: colorRes.fontPlaceholder,
                        }}>
                            {this.getRegisterDate(this.state.deal_time)}
                        </Text>


                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={(date) => {
                                this.extracted(date);
                            }}
                            mode={'date'}
                            cancelTextIOS={'取消'}
                            confirmTextIOS={'确认'}
                            onCancel={() => this.setState({isDateTimePickerVisible: false})}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={Style.item_line}/>

                {/*购买原因*/}
                <View style={{
                    backgroundColor: 'white',
                    paddingLeft: dimenRes.pageBorder,
                    paddingRight: dimenRes.pageBorder,
                    height: 200,
                    marginTop: 10,
                    padding: 10,
                    alignItems: 'flex-start',
                    flexDirection: 'row'
                }}>
                    {

                         <TextInput
                                placeholder='购买原因'
                                underlineColorAndroid="transparent"
                                onChangeText={
                                    (evt) => {
                                        this.setState({
                                            customer_reason: evt
                                        })
                                    }
                                }
                                value={this.state.customer_reason}
                                style={Style.item_input}>

                            </TextInput>
                    }
                </View>


                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                        style={[styleRes.button_bg_red, {alignSelf: 'stretch'}]}

                        onPress={() => {
                            let data = {
                                customer_reason: this.state.customer_reason,
                                deal_time: parseInt(this.state.deal_time),
                                cargo_price: this.state.cargo_price,
                                cargo_name: this.state.cargo_name,
                            };

                            if (Util.isEmpty(this.state.cargo_name)) {
                                Alert.alert('提示', '商品的名字是一定要写的哦');
                                return
                            }

                            if (Util.isEmpty(this.state.deal_time) && parseInt(this.state.deal_time) === 0) {
                                Alert.alert('提示', '成交时间是一定要写的哦');
                                return
                            }

                            if (this.state.isCreate) {
                                HttpManager
                                    .customerAddCargo(this.props.navigation.state.params.customer_id, data)
                                    .then((response) => {
                                        if (response.data.code === Constant.SUCCESS_CODE) {
                                            //刷新首页
                                            DeviceEventEmitter.emit(Constant.REFRESH_CUSTOMER, Constant.FROM_CREATE);
                                            console.log('新建成功');
                                            this.props.navigation.goBack()
                                        } else {
                                            Alert.alert('新建失败');
                                        }
                                    });
                            } else {
                                if (!this.isDatachange()) {
                                    Alert.alert('提示', '商品数据没有发生改变是不需要保存的');
                                    return
                                }
                                HttpManager
                                    .customerEditCargo(this.props.navigation.state.params.cargoInfo.id, data)
                                    .then((response) => {
                                        if (response.data.code === Constant.SUCCESS_CODE) {
                                            //刷新首页
                                            DeviceEventEmitter.emit(Constant.REFRESH_CUSTOMER, Constant.FROM_CREATE);
                                            console.log('编辑成功');
                                            this.props.navigation.goBack()
                                        } else {
                                            Alert.alert('编辑失败');
                                        }
                                    });
                            }
                        }}
                    >
                        <Text style={{color: 'white', fontSize: 16}}>保存</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
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
        color: colorRes.fontBlack,
        fontSize: 14,
        width: 70
    },
    item_input: {
        fontSize: 14,
        flex: 1,
        color: colorRes.fontPlaceholder,
        padding: 0
    },
    item_line: {
        height: 1,
        width: dimenRes.pageBorder,
        backgroundColor: 'white'
    }
});