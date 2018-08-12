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
import MePage from './src/account/MePage'

const TAB_STACK = TabNavigator({
        CUSTOMER_HOME: {
            screen: CustomerListPage,
            navigationOptions: {
                tabBarLabel: '客户',
                tabBarIcon: ({tintColor, focused}) => {
                    if (focused) {
                        return <Image style={[Style.tab, {tintColor: tintColor}]}
                                      source={require('./assets/images/car_assess_selected.png')}/>
                    } else {
                        return <Image style={[Style.tab, {tintColor: tintColor}]}
                                      source={require('./assets/images/car_assess_unselected.png')}/>
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
        CREATE_CUSTOMER: {screen: CreateCustomerPage}
    },
    {
        initialRouteName: 'MAIN',
        navigationOptions: navigationStyle
    }
);


export default class App extends Component<Props> {


    render() {
        return <APPSTACK/>;
    }

}
const Style = StyleSheet.create({
    tab: {width: 28, height: 28},
});



