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
import SearchPage from "./src/customer/SearchPage";
import FindPswPage from "./src/account/FindPswPage";
import GetRegisterCode from "./src/account/GetRegisterCode";
import ColorRes from "./src/config/ColorRes";

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
            activeTintColor: ColorRes.themeRed,
            inactiveTintColor: '#999999'
        }
    }
);
const navigationStyle = {
    headerStyle: {backgroundColor: ColorRes.themeRed}
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
        FINDPSW: {screen: FindPswPage},
        SETTING: {screen: Setting},
        SEARCH: {screen: SearchPage},
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
        FINDPSW: {screen: FindPswPage},
        GETREGISTERCODE: {screen: GetRegisterCode},
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
            markSuccess()
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



