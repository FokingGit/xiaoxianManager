import React, {Component} from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    Dimensions,
    StyleSheet, DeviceEventEmitter
} from 'react-native'
import Util from '../utils/Utils'
import ColorRes from "../config/ColorRes";
import DashLine from "./DashLine.js";
import HttpManager from '../utils/HttpManager'
import Constants from "../config/Constants";

let screenW = Dimensions.get('window').width;
export default class CustomerDetailPage extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            customerDetail: {},
            displayData: []
        })
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '客户详情',
            headerTintColor: '#fff',
            headerRight: (
                <TouchableOpacity
                    style={{alignItems: 'center', justifyContent: 'center', marginRight: 16}}
                    onPress={
                        () => navigation.state.params && navigation.state.params.jumpToCreatCargo ? navigation.state.params.jumpToCreatCargo() : () => {
                        }}
                >
                    <Text style={{color: '#fff', fontFamily: 'PingFangSC-Regular', fontSize: 16}}>添加商品</Text>
                </TouchableOpacity>
            )
        }
    };

    componentWillMount() {
        this.props.navigation.setParams({
            jumpToCreatCargo: this.jumpToCreatCargo
        });

        this.emitter = DeviceEventEmitter.addListener(Constants.REFRESH_CUSTOMER, (data) => {
            this.fetchData()
        })
        this.emitterCustomer = DeviceEventEmitter.addListener(Constants.REFRESH_CUSTOMER_DETAIL, (data) => {
            this.fetchCustomerData()
        })
    }

    componentWillUnmount() {
        this.emitter.remove()
        this.emitterCustomer.remove()
    }

    componentDidMount() {
        this.setState({
            customerDetail: this.props.navigation.state.params.customerDetail,
        });
        this.fetchData();
    }

    fetchData = () => {
        let displayData = [];
        HttpManager
            .customerCargoList(this.props.navigation.state.params.customerDetail.id, 1)
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    displayData = response.data.data.list;
                } else {
                    console.log(response)
                }
                this.setState({
                    displayData: Util.clone(displayData)
                })
            })
            .catch(e => {
                console.log(e.toString())
            });
    };

    fetchCustomerData = () => {
        HttpManager
            .getCustomerDetail(this.props.navigation.state.params.customerDetail.id)
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    this.setState({
                        customerDetail: Util.clone(response.data.data)
                    })
                }

            })
            .catch(e => {
                console.log(e.toString())
            });
    }
    /**
     * 跳转添加商品
     */
    jumpToCreatCargo = () => {
        this.props.navigation.navigate({
            routeName: 'CARGO_ADD_EDIT',
            key: 'customer-edit-cargo',
            params: {
                isCreate: true,
                customer_id: this.props.navigation.state.params.customerDetail.id

            }
        })
    };

    /**
     * 删除用户
     * @param customer_id 客户id
     */
    deleteCustomer = (customer_id) => {
        HttpManager.deleteCustomer(customer_id).then(() => {
            console.log('删除成功客户')
            DeviceEventEmitter.emit(Constants.REFRESH_HOME, Constants.FROM_DELETE);
            this.props.navigation.goBack()
        })
    };


    /**
     * 删除商品
     * @param order_id 商品id
     */
    deleteOrder = (order_id) => {
        HttpManager.deleteOrder(order_id).then(() => {
            console.log('删除成功商品')
            let displayData = this.state.displayData;
            for (let i = 0; i < displayData.length; i++) {
                if (displayData[i].id === order_id) {
                    displayData.splice(i, 1)
                    this.setState({
                        displayData: Util.clone(displayData)
                    });
                    return;
                }
            }
        })
    };

    renderItem = (item, index) => {
        return (
            <View style={styles.list_content}>
                <View style={styles.list_content_titleView}>
                    <Text
                        style={styles.list_content_carName}> {item.cargo_name}</Text>


                    <TouchableOpacity style={styles.list_content_watchReportTouch}
                                      onPress={() => {
                                          //todo 确认回访
                                          Alert.alert('提示', "删除该商品？", [
                                              {text: '点错了'},
                                              {
                                                  text: '是', onPress: () => this.deleteOrder(item.id)
                                              }
                                          ])
                                      }
                                      }>
                        <Text
                            style={styles.list_content_watchReport_text}>删除</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.list_content_detailTouch}
                                      onPress={() => {
                                          this.props.navigation.navigate({
                                              routeName: 'CARGO_ADD_EDIT',
                                              key: 'customer-edit-cargo',
                                              params: {
                                                  isCreate: false,
                                                  cargoInfo: item,
                                              }
                                          })
                                      }}
                    >
                        <Text style={styles.list_content_detail_text}>编辑</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.list_content_access_stateView}>
                    <Text
                        style={styles.list_content_assessNumber}>{item.cargo_price + '元'}</Text>
                </View>
                <View style={styles.list_content_access_infoView}>
                    <Text style={styles.list_content_rowTitle}>购买时间:</Text>
                    <Text style={styles.list_content_rowText}>{Util.formatDate(item.deal_time, 'yyyy-MM-dd')}</Text>
                </View>
                <View style={[styles.list_content_access_infoView, {
                    marginBottom: 10,
                    alignItems: 'flex-start',
                }]}>
                    <Text style={styles.list_content_rowTitle} selectable={true}>购买备注:</Text>
                    <Text
                        style={[styles.list_content_rowText, {
                            flex: 1,
                            marginRight: 10
                        }]}>{item.customer_reason}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <View style={styles.list_content}>
                    <View style={styles.list_content_titleView}>
                        <Text
                            style={styles.list_content_carName}> {this.state.customerDetail.name}</Text>

                        <TouchableOpacity style={styles.list_content_watchReportTouch}
                                          onPress={() => {
                                              //todo 确认回访
                                              Alert.alert('提示', "删除该客户？", [
                                                  {text: '点错了'},
                                                  {
                                                      text: '是',
                                                      onPress: () => this.deleteCustomer(this.props.navigation.state.params.customerDetail.id)
                                                  }
                                              ])
                                          }
                                          }>
                            <Text
                                style={styles.list_content_watchReport_text}>删除</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.list_content_detailTouch}
                                          onPress={() => {
                                              this.props.navigation.navigate({
                                                  routeName: 'CREATE_CUSTOMER',
                                                  key: 'list-create',
                                                  params: {
                                                      isCreate: false,
                                                      customerDetail: this.state.customerDetail,
                                                  }
                                              })
                                          }}
                        >
                            <Text style={styles.list_content_detail_text}>编辑</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.list_content_access_stateView}>
                        <Text
                            selectable={true}
                            style={styles.list_content_assessNumber}>{this.state.customerDetail.phone}</Text>
                        <View style={styles.list_content_assessPartingLine}/>
                        <Text
                            style={styles.list_content_assessStatus}>年龄：{this.state.customerDetail.age}</Text>
                    </View>
                    <DashLine backgroundColor={'#b0b0b0'} len={50} width={screenW - 30}/>
                    <View style={styles.list_content_access_infoView}>
                        <Text style={styles.list_content_rowTitle}>工作:</Text>
                        <Text selectable={true}
                              style={styles.list_content_rowText}>{this.state.customerDetail.job}</Text>
                    </View>
                    <View style={styles.list_content_access_infoView}>
                        <Text style={styles.list_content_rowTitle}>住址:</Text>
                        <Text selectable={true}
                              style={styles.list_content_rowText}>{this.state.customerDetail.address}</Text>
                    </View>
                    <View style={[styles.list_content_access_infoView, {alignItems: 'flex-start'}]}>
                        <Text style={[styles.list_content_rowTitle]}>肤质描述:</Text>
                        <Text selectable={true}
                              style={[styles.list_content_rowText, {
                                  flex: 1,
                                  marginRight: 10
                              }]}>{this.state.customerDetail.skindesc}</Text>
                    </View>
                    <View style={[styles.list_content_access_infoView, {marginBottom: 10}]}>
                        <Text style={styles.list_content_rowTitle}>上次操作时间:</Text>
                        <Text
                            style={styles.list_content_rowText}>{Util.formatDate(this.state.customerDetail.last_time)}</Text>
                    </View>
                </View>

                <FlatList
                    style={{marginTop: 10}}
                    keyExtractor={(item, index) => String(item.id)}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    data={this.state.displayData}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    list_content: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 10
    },
    list_content_titleView: {
        width: '100%',
        height: 24,
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    list_content_access_stateView: {
        width: '100%',
        marginTop: 8,
        alignItems: 'center',
        flexDirection: 'row'
    },
    list_content_access_infoView: {
        width: '100%',
        marginTop: 12,
        alignItems: 'center',
        flexDirection: 'row'
    },

    list_content_carName: {
        marginLeft: 16,
        fontFamily: 'PingFangSC-Medium',
        fontSize: 18,
        color: '#111',
        flex: 1
    },
    list_content_detailTouch: {
        marginRight: 20,
        width: 56,
        height: 24,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: ColorRes.themeRed,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list_content_detail_text: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        color: ColorRes.themeRed

    },
    list_content_assessNumber: {
        marginLeft: 15,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12
    },
    list_content_assessPartingLine: {
        marginLeft: 8,
        alignSelf: 'center',
        width: 2,
        height: 8,
        backgroundColor: '#444'
    },
    list_content_assessStatus: {
        marginLeft: 8,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12
    },
    list_content_rowTitle: {
        marginLeft: 15,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#777'
    },
    list_content_watchReport_text: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        color: '#fff'
    },
    list_content_watchReportTouch: {
        marginRight: 15,
        width: 88,
        borderRadius: 2,
        backgroundColor: ColorRes.themeRed,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list_content_rowText: {
        marginLeft: 8,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#111'
    }
});