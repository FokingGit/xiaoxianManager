import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Image,
    View,
    DeviceEventEmitter, Alert
} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import CustomerListPage from './src/customer/CustomerListPage'
import CreateCustomerPage from './src/customer/CreateCustomerPage'
import CustomerDetailPage from './src/customer/CustomerDetailPage'
import CargoEditOrAddPage from './src/customer/CargoEditOrAddPage'
import MePage from './src/account/MePage'
import LoginPage from "./src/account/Login";
import Setting from "./src/account/Setting";
import RegisterPage from "./src/account/Register";
import StorageHelper from "./src/utils/StorageHelper.js";
import UpdateManager from "./src/utils/UpdateManager.js";
import {
    isFirstTime, isRolledBack,
    markSuccess,
} from 'react-native-update';

const TAB_STACK = TabNavigator({
        CUSTOMER_HOME: {
            screen: CustomerListPage,
            navigationOptions: {
                tabBarLabel: '客户',
                tabBarIcon: ({tintColor, focused}) => {
                    if (focused) {
                        return <Image style={[Style.tab, {tintColor: tintColor}]}
                                      source={require('./assets/images/customer_select.png')}/>
                    } else {
                        return <Image style={[Style.tab, {tintColor: tintColor}]}
                                      source={require('./assets/images/customer_unselected.png')}/>
                    }
                },
            }
        }
        ,
        ME_HOME: {
            screen: MePage,
            navigationOptions: {
                tabBarLabel: '我',
                tabBarIcon: ({tintColor, focused}) => {
                    if (focused) {
                        return <Image style={[Style.tab, {tintColor: tintColor}]}
                                      source={require('./assets/images/me_selected.png')}/>
                    } else {
                        return <Image style={[Style.tab, {tintColor: tintColor}]}
                                      source={require('./assets/images/me_unselected.png')}/>
                    }
                }
            }
        },
    }
    , {
        animationEnabled: false,
        swipeEnabled: false,
        removeClippedSubviews: false,
        tabBarPosition: 'bottom',
        lazy: true,
        tabBarOptions: {
            showIcon: true,
            indicatorStyle: {
                backgroundColor: '#FAFAFA',
            },
            style: {
                backgroundColor: '#FAFAFA',
                height: 49
            },
            labelStyle: {
                marginTop: 0,
                fontSize: 10
            },
            activeTintColor: '#DD433B',
            inactiveTintColor: '#999999'
        }
    }
);
const navigationStyle = {
    headerStyle: {backgroundColor: '#DD433B'}
};

const APPSTACK = StackNavigator(
    {
        MAIN: {screen: TAB_STACK},
        ME_PAGE: {screen: MePage},
        CUSTOMER_LIST: {screen: CustomerListPage},
        CREATE_CUSTOMER: {screen: CreateCustomerPage},
        CUSTOMER_DETAIL: {screen: CustomerDetailPage},
        CARGO_ADD_EDIT: {screen: CargoEditOrAddPage},
        LOGIN: {screen: LoginPage},
        SETTING: {screen: Setting},
    },
    {
        initialRouteName: 'MAIN',
        navigationOptions: navigationStyle
    }
);

const LOGIN_STACK = StackNavigator(
    {
        LOGIN: {screen: LoginPage},
        REGISTER: {screen: RegisterPage},
    }, {
        initialRouteName: 'LOGIN',
        navigationOptions: navigationStyle
    });


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderView: null
        };
    }

    componentWillMount() {
        this.listener = DeviceEventEmitter.addListener('LoginStateChange', (userId) => this.configMainPage(userId));
        StorageHelper.checkLoginState()
        if (isFirstTime) {
            Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
                {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请重启应用')}},
                {text: '否', onPress: ()=>{markSuccess()}},
            ]);
        } else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
        }

        UpdateManager.checkUpdate();

    }

    componentWillUnmount() {
        this.listener.remove();
    }

    configMainPage = (userId) => {
        if (userId) {
            this.setState({
                renderView: <APPSTACK/>
            })
        } else {
            this.setState({
                renderView: <LOGIN_STACK/>
            })
        }
    }


    render() {
        return this.state.renderView ? this.state.renderView : <View style={{backgroundColor: '#111'}}/>;
    }

}
const Style = StyleSheet.create({
    tab: {width: 28, height: 28},
});



