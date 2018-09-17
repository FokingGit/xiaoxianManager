import React, {Component} from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    Dimensions,
    StyleSheet,
    ActivityIndicator, DeviceEventEmitter, TouchableWithoutFeedback
} from 'react-native'
import HttpManager from '../utils/HttpManager'
import Util from '../utils/Utils'
import ColorRes from "../config/ColorRes";
import Style from "../config/StyleRes";
import Constants from "../config/Constants";
import DashLine from "./DashLine.js";
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import DateTimePicker from "react-native-modal-datetime-picker";

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
 * 客户列表页
 */
let screenW = Dimensions.get('window').width;
export default class CustomerListPage extends Component {


    constructor(props) {
        super(props);
        this.state = ({
            isNeedVisiteLoading: true,
            isVisitedLoading: true,
            isAllCustomerLoading: true,
            isHistoryCustomerLoading: true,

            allCustomerData: [], //全部客户数据
            allCustomerCount: 0, //全部客户数量
            allCustomerCurrentPage: 0,

            needVisiteCustomerData: [], //待回访客户数据
            needVisiteCustomerCount: 0, //待回访客户数量
            needVisiteCurrentPage: 0,

            visitedCustomerData: [], //已回访客户数据
            visitedCustomerCount: 0, //已回访客户数量
            visitedCurrentPage: 0,

            historyCustomerData: [], //指定日期的客户数据
            historyCustomerCount: 0, //指定日期的客户数量
            historyCurrentPage: 0,
            startTime: parseInt((new Date().getTime() - 30 * 24 * 60 * 60 * 1000) / 1000),
            endTime: parseInt(new Date().getTime() / 1000),
            isShowChooseTime: false,
            fakeStartTime: 0,
            fakeEndTime: 0,
            isDateStartTimeVisible: false,
            isDateEndTimeVisible: false,


            isShowALL: true, //默认是显示全部客户
            isShowNeedVisit: true,
            isShowAlreadyVisit: true,
            isShowOldCustomer: true

        });
        this.lastSelectedIndex = -1
    }


    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{color: '#ffffff', fontSize: 20}}>
                        客户信息
                    </Text>
                </View>),
            headerStyle: {
                backgroundColor: ColorRes.themeRed
            },
            headerRight: (
                <TouchableOpacity
                    onPress={navigation.state.params ? navigation.state.params.createCustomer : () => {
                    }}
                >
                    <Image style={{width: 30, height: 30, marginRight: 8}}
                           source={require('../../assets/images/create.png')}/>
                </TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity
                    onPress={navigation.state.params ? navigation.state.params.searchCustomer : () => {
                    }}
                >
                    <Image style={{width: 30, height: 30, marginLeft: 8}}
                           source={require('../../assets/images/search.png')}/>
                </TouchableOpacity>
            )
        }
    };

    componentWillMount() {
        this.props.navigation.setParams({
            searchCustomer: this.searchCustomer,
            createCustomer: this.createCustomer,
        });
        this.emitter = DeviceEventEmitter.addListener(Constants.REFRESH_HOME, (data) => {
            this.refs.scrollableTabView.goToPage(0);
            this.fetchNetData()
        })
    }

    componentDidMount() {
        this.fetchNetData();
    }

    fetchNetData = () => {
        this.fetchAllFirstPageData();
        this.handleNeedVisitedNetWork(1, 1);
        this.handleNeedVisitedNetWork(1, 2);
        this.historyCustomer(1, this.state.startTime, this.state.endTime);
    };

    componentWillUnmount() {
        this.emitter.remove()
    }

    /**
     * 获取全部tab第一页数据
     */
    fetchAllFirstPageData = () => {
        this.setState({
            allCustomerCurrentPage: 1
        });

        let displayData = [];
        HttpManager
            .customerGetList(1)
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    displayData = response.data.data.list;
                } else {
                    console.log(response);
                }
                this.setState({
                    allCustomerData: Util.clone(displayData),
                    isAllCustomerLoading: false,
                    allCustomerCount: response.data.data.total
                })
            })
            .catch((e) => {
                this.setState({
                    isAllCustomerLoading: false,
                })
            });

    };

    /**
     * 获取分页数据
     * @param page
     */
    fetchAllPerPageData = (page) => {
        this.setState({
            allCustomerCurrentPage: page
        });
        let displayData = [];
        HttpManager
            .customerGetList(page)
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    displayData = this.state.allCustomerData.concat(response.data.data.list);
                } else {
                    console.log(response);
                }
                this.setState({
                    allCustomerData: Util.clone(displayData),
                    isAllCustomerLoading: false
                })
            })
            .catch((e) => {
                this.setState({
                    isAllCustomerLoading: false,
                })
            });


    };

    handleNeedVisitedNetWork = (page, type) => {
        let displayData = [];
        HttpManager
            .customerVisitedGetList(page, type)
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    if (type === 1) {
                        //待回访
                        if (page === 1) {
                            //第一页数据
                            displayData = response.data.data.list;
                        } else {
                            //更多
                            displayData = this.state.needVisiteCustomerData.concat(response.data.data.list);
                        }
                        this.setState({
                            needVisiteCustomerData: Util.clone(displayData),
                            isNeedVisiteLoading: false,
                            needVisiteCustomerCount: response.data.data.total,
                            needVisiteCurrentPage: page
                        })
                    } else if (type === 2) {
                        //已回访
                        if (page === 1) {
                            //第一页数据
                            displayData = response.data.data.list
                        } else {
                            //更多
                            displayData = this.state.visitedCustomerData.concat(response.data.data.list);
                        }
                        this.setState({
                            visitedCustomerData: Util.clone(displayData),
                            isVisitedLoading: false,
                            visitedCustomerCount: response.data.data.total,
                            visitedCurrentPage: page
                        })
                    }
                } else {
                    if (type === 1) {
                        //待回访
                        this.setState({
                            isNeedVisiteLoading: false,
                        })
                    } else if (type === 2) {
                        this.setState({
                            isVisitedLoading: false,
                        })
                    }
                }
            })
            .catch((e) => {
                if (type === 1) {
                    //待回访
                    this.setState({
                        isNeedVisiteLoading: false,
                    })
                } else if (type === 2) {
                    this.setState({
                        isVisitedLoading: false,
                    })
                }
            })
    };

    emptyComponent = () => {
        return (
            <View style={styles.empty_container}>
                <Image style={styles.empty_image}
                       source={require('../../assets/images/search_empty.png')}/>
                <Text style={styles.empty_text}>暂无客户</Text>
            </View>)
    };

    /**
     * 搜索用户
     */
    searchCustomer = () => {
        this.props.navigation.navigate({
            routeName: "SEARCH"
        })
    };

    /**
     * 创建客户
     */
    createCustomer = () => {
        this.props.navigation.navigate({
            routeName: 'CREATE_CUSTOMER',
            key: 'list-create',
            params: {
                isCreate: true
            }
        })
    };

    /**
     * 确认回访
     * @param customer_id
     */
    confirmVisited = (customer_id) => {
        HttpManager
            .confirmVisited(customer_id)
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    //确认回访成功
                    for (let i = 0; i < this.state.needVisiteCustomerData.length; i++) {
                        if (this.state.needVisiteCustomerData[i].id === customer_id) {
                            this.state.needVisiteCustomerData.splice(i, 1)
                            this.setState({
                                needVisiteCustomerData: this.state.needVisiteCustomerData
                            })
                        }
                    }
                    this.handleNeedVisitedNetWork(1, 2)
                } else {
                    console.log(response);
                }
            })
            .catch((e) => console.log(e.toString()))
    };

    /**
     * 历史客户
     * @param page
     * @param startTime 开始时间
     * @param endTime   结束时间
     */
    historyCustomer = (page, startTime, endTime) => {
        let displayData = [];
        HttpManager
            .historyCustomerGetList(page, startTime, endTime)
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    if (page === 1) {
                        //第一页数据
                        displayData = response.data.data.list;
                    } else {
                        //更多
                        displayData = this.state.historyCustomerData.concat(response.data.data.list);
                    }
                    this.setState({
                        historyCustomerCount: response.data.data.total,
                        historyCustomerData: Util.clone(displayData),
                        isHistoryCustomerLoading: false
                    })
                } else {
                    console.log(response);
                }
            })
            .catch(e => console.log(e.toString()))
    };
    /**
     * 全部的item
     * @param item
     * @param index
     * @param type 0.全部 1.待回仿 2.已回访
     * @returns {*}
     */
    renderItem = (item, index, type) => {
        return (
            <View style={this.getStyle(index)}>
                <View style={styles.list_content_titleView}>
                    <Text
                        style={styles.list_content_carName}> {item.name}</Text>

                    {type === 1
                        ?
                        <TouchableOpacity style={styles.list_content_watchReportTouch}
                                          onPress={() => {
                                              //todo 确认回访
                                              Alert.alert('提示', "已确认回访？", [
                                                  {text: '点错了'},
                                                  {
                                                      text: '是', onPress: () => this.confirmVisited(item.id)
                                                  }
                                              ])
                                          }
                                          }>
                            <Text
                                style={styles.list_content_watchReport_text}>确认回访</Text>
                        </TouchableOpacity>
                        : null
                    }
                    <TouchableOpacity style={styles.list_content_detailTouch}
                                      onPress={() => {
                                          this.props.navigation.navigate({
                                              routeName: 'CUSTOMER_DETAIL',
                                              key: 'list-customerDetail',
                                              params: {
                                                  customerDetail: item
                                              }
                                          });
                                      }}
                    >
                        <Text style={styles.list_content_detail_text}>详情</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.list_content_access_stateView}>
                    <Text
                        style={styles.list_content_assessNumber}>{String(item.phone)}</Text>
                    <View style={styles.list_content_assessPartingLine}/>
                    <Text
                        style={styles.list_content_assessStatus}>年龄：{String(item.age)}</Text>
                </View>
                <DashLine backgroundColor={'#b0b0b0'} len={50} width={screenW - 30}/>
                {
                    type === 0 ?
                        <View style={[styles.list_content_access_infoView, {marginBottom: 10}]}>
                            <Text style={styles.list_content_rowTitle}>上次操作时间:</Text>
                            <Text
                                style={styles.list_content_rowText}>{Util.formatDate(item.last_time)}</Text>
                        </View> : null
                }
                {
                    type === 1 ?
                        <View style={{
                            marginBottom: 10,
                            width: '100%',
                            marginTop: 10,
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            marginRight: 10
                        }}>
                            <Text style={styles.list_content_rowTitle}>肤质描述:</Text>
                            <Text
                                style={[styles.list_content_rowText, {flex: 1, marginRight: 10}]}>{item.skindesc}</Text>
                        </View> : null
                }
                {
                    type === 2 ?
                        <View style={[styles.list_content_access_infoView, {marginBottom: 10}]}>
                            <Text style={styles.list_content_rowTitle}>回访次数:</Text>
                            <Text
                                style={styles.list_content_rowText}>{item.visit_num}</Text>
                        </View> : null
                }


            </View>
        )
    };


    render() {
        let chooseTimeComponent = this.generateChooseTimeComponent();
        return (
            <ScrollableTabView
                ref='scrollableTabView'
                tabBarBackgroundColor={'white'}
                tabBarPosition='top'
                initialPage={0}
                tabBarActiveTextColor={ColorRes.themeRed}
                tabBarInactiveTextColor={'#999999'}
                tabBarTextStyle={{fontSize: 14, marginTop: 10}}
                scrollWithoutAnimation={false}
                tabBarUnderlineStyle={{backgroundColor: ColorRes.themeRed, height: 2}}
            >
                {
                    this.state.isAllCustomerLoading ?
                        <View
                            tabLabel={`全部(0)`}
                            key={1}
                            style={{
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}><ActivityIndicator
                            size={"large"}
                            color={ColorRes.themeRed}
                        /></View> :
                        <FlatList
                            data={this.state.allCustomerData}
                            refreshing={this.state.isAllCustomerLoading}
                            onRefresh={() => this.fetchAllFirstPageData()}
                            keyExtractor={(item) => item.last_time}
                            renderItem={({item, index}) => this.renderItem(item, index, 0)}
                            tabLabel={`全部(${this.state.allCustomerCount})`}
                            onEndReached={() => this.fetchAllPerPageData(this.state.allCustomerCurrentPage + 1)}
                            onEndReachedThreshold={0.1}
                            ListEmptyComponent={this.emptyComponent}
                            key={1}
                        />
                }


                {this.state.isNeedVisiteLoading ?
                    <View
                        tabLabel={`待回访(0)`}
                        key={2}
                        style={{
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}><ActivityIndicator
                        size={"large"}
                        color={ColorRes.themeRed}
                    /></View> :
                    <FlatList
                        data={this.state.needVisiteCustomerData}
                        refreshing={this.state.isNeedVisiteLoading}
                        onRefresh={() => this.handleNeedVisitedNetWork(1, 1)}
                        keyExtractor={(item) => item.last_time}
                        renderItem={({item, index}) => this.renderItem(item, index, 1)}
                        tabLabel={`待回访(${this.state.needVisiteCustomerCount})`}
                        onEndReached={() => this.handleNeedVisitedNetWork(this.state.needVisiteCurrentPage + 1, 1)}
                        onEndReachedThreshold={0.1}
                        key={2}
                        ListEmptyComponent={this.emptyComponent}
                    />
                }

                {this.state.isVisitedLoading ?
                    <View
                        tabLabel={`已回访(0)`}
                        key={3}
                        style={{
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}><ActivityIndicator
                        size={"large"}
                        color={ColorRes.themeRed}
                    /></View> :
                    <FlatList
                        keyExtractor={(item) => item.last_time}
                        data={this.state.visitedCustomerData}
                        refreshing={this.state.isVisitedLoading}
                        onRefresh={() => this.handleNeedVisitedNetWork(1, 2)}
                        renderItem={({item, index}) => this.renderItem(item, index, 2)}
                        tabLabel={`已回访(${this.state.visitedCustomerCount})`}
                        ListEmptyComponent={this.emptyComponent}
                        onEndReached={() => this.handleNeedVisitedNetWork(this.state.visitedCurrentPage + 1, 2)}
                        onEndReachedThreshold={0.1}
                        key={3}
                    />}
                <View style={{flex: 1}} key={4} tabLabel={'历史客户'}>
                    {
                        this.state.isShowChooseTime ? chooseTimeComponent :
                            <FlatList
                                ListHeaderComponent={this.getHeader()}
                                keyExtractor={(item) => item.last_time}
                                data={this.state.historyCustomerData}
                                refreshing={this.state.isHistoryCustomerLoading}
                                onRefresh={() => this.historyCustomer(1, this.state.startTime, this.state.endTime)}
                                renderItem={({item, index}) => this.renderItem(item, index, 0)}
                                ListEmptyComponent={this.emptyComponent}
                                onEndReached={() => this.historyCustomer(this.state.historyCurrentPage + 1, this.state.startTime, this.state.endTime)}
                                onEndReachedThreshold={0.1}
                            />
                    }

                </View>
            </ScrollableTabView>
        )
    }


    getStyle = (index) => {
        if (index === 0) {
            return {
                width: '100%',
                backgroundColor: '#fff',
            }
        } else {
            return {
                width: '100%',
                backgroundColor: '#fff',
                marginTop: 10
            }
        }

    };

    generateChooseTimeComponent = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                <View style={{width: '75%', height: '75%', backgroundColor: 'white', justifyContent: 'center'}}>
                    <TouchableOpacity
                        style={{position: 'absolute', top: 10, left: 10}}
                        onPress={() => {
                            this.setState({
                                isShowChooseTime: false,
                                fakeEndTime: this.state.endTime,
                                fakeStartTime: this.state.startTime
                            })
                        }}
                    >
                        <Image style={{width: 30, height: 30}}
                               source={require('../../assets/images/search_close.png')}/>
                    </TouchableOpacity>

                    {/*开始时间*/}
                    <TouchableWithoutFeedback
                        style={{marginBottom: 10}}
                        onPress={
                            () => this.setState({isDateStartTimeVisible: true})
                        }
                    >
                        <View style={Style.item_bg}>
                            <Text style={{
                                color: 'black',
                                fontSize: 14,
                                width: 70,
                                marginLeft: 30,
                                marginRight: 10
                            }}>开始时间:</Text>
                            <Text style={{
                                fontSize: 14,
                                color: ColorRes.fontPlaceholder,
                            }}>
                                {this.getRegisterDate(this.state.fakeStartTime)}
                            </Text>


                            <DateTimePicker
                                isVisible={this.state.isDateStartTimeVisible}
                                onConfirm={(date) => {
                                    this.extracted(date, true);
                                }}
                                mode={'date'}
                                cancelTextIOS={'取消'}
                                confirmTextIOS={'确认'}
                                onCancel={() => this.setState({isDateStartTimeVisible: false})}
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    {/*结束时间*/}
                    <TouchableWithoutFeedback
                        onPress={
                            () => this.setState({isDateEndTimeVisible: true})
                        }
                    >
                        <View style={Style.item_bg}>
                            <Text style={{
                                color: 'black',
                                fontSize: 14,
                                width: 70,
                                marginLeft: 30,
                                marginRight: 10
                            }}>结束时间:</Text>
                            <Text style={{
                                fontSize: 14,
                                color: ColorRes.fontPlaceholder,
                            }}>
                                {this.getRegisterDate(this.state.fakeEndTime)}
                            </Text>


                            <DateTimePicker
                                isVisible={this.state.isDateEndTimeVisible}
                                onConfirm={(date) => {
                                    this.extracted(date, false);
                                }}
                                mode={'date'}
                                cancelTextIOS={'取消'}
                                confirmTextIOS={'确认'}
                                onCancel={() => this.setState({isDateEndTimeVisible: false})}
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableOpacity
                        style={[Style.style_login_button, {
                            flex: 1, position: 'absolute', bottom: 10, height: 30,
                            borderRadius: 15
                        }]}
                        onPress={() => {
                            if (this.state.fakeStartTime > this.state.fakeEndTime) {
                                Alert.alert('结束时间是不能早于开始时间的哦');
                                return
                            }
                            this.setState({
                                startTime: this.state.fakeStartTime,
                                endTime: this.state.fakeEndTime,
                                isShowChooseTime: false,
                            });
                            this.historyCustomer(1, this.state.fakeStartTime, this.state.fakeEndTime)
                        }}>
                        <Text style={{fontSize: 16, color: '#fff'}}>
                            确认
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    getRegisterDate = (date) => {
        date = parseInt(date)
        if (Util.isEmpty(date) || date === 0) {
            return '请选择'
        } else {
            let registerDate = new Date(date * 1000);
            return `${registerDate.getFullYear()}-${registerDate.getMonth() + 1}-${registerDate.getDate()}`;
        }
    };

    extracted = (date, isStart) => {
        let registerDate = date.toString().split(' ');
        let month = dateMap.get(registerDate[1])
        let day = registerDate[2];
        let year = registerDate[3];

        let dateStr = `${year}-${month}-${day}`;
        let time = parseInt(new Date(dateStr).getTime() / 1000);
        if (isStart) {
            this.setState({
                isDateStartTimeVisible: false,
                fakeStartTime: time
            })
        } else {
            this.setState({
                isDateEndTimeVisible: false,
                fakeEndTime: time
            })
        }
    }

    /**
     * 设置历史客户的头部组件
     * @returns {*}
     */
    getHeader = () => {
        return <View style={{
            marginTop: 10,
            marginLeft: 10,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <Text>{Util.formatDate(this.state.startTime, 'yyyy/MM/dd') + " 至 " + Util.formatDate(this.state.endTime, 'yyyy/MM/dd') + "共有" + this.state.historyCustomerCount + "位"}</Text>
            <TouchableOpacity
                style={[styles.list_content_watchReportTouch]}
                onPress={() => {
                    this.setState({
                        isShowChooseTime: true
                    })
                }
                }>
                <Text
                    style={styles.list_content_watchReport_text}>重新选择时间</Text>
            </TouchableOpacity>
        </View>
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
        fontSize: 12,
        color: ColorRes.themeRed

    },
    list_content_assessNumber: {
        marginLeft: 15,
        fontSize: 12
    },
    list_content_watchReportTouch: {
        marginRight: 15,
        width: 88,
        borderRadius: 2,
        backgroundColor: ColorRes.themeRed,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list_content_watchReport_text: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        color: '#fff'
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
        fontSize: 12
    },
    list_content_rowTitle: {
        marginLeft: 15,
        fontSize: 14,
        color: '#777'
    },
    list_content_rowText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#111'
    },
    list: {
        backgroundColor: '#ebebeb',
        width: '100%'
    },
    empty_container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        width: '100%'
    },
    empty_image: {
        alignSelf: 'center',
        width: 240,
        height: 160
    },
    empty_text: {
        fontSize: 16,
        color: '#AAAAAA',
        marginTop: 10,
        alignSelf: "center"
    }
});