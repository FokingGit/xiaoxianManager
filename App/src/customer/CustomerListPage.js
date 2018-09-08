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
    ActivityIndicator, DeviceEventEmitter
} from 'react-native'
import HttpManager from '../utils/HttpManager'
import Util from '../utils/Utils'
import ColorRes from "../config/ColorRes";
import Constants from "../config/Constants";
import DashLine from "./DashLine.js";
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';

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

            allCustomerData: [], //全部客户数据
            allCustomerCount: 0, //全部客户数量
            allCustomerCurrentPage: 0,

            needVisiteCustomerData: [], //待回访客户数据
            needVisiteCustomerCount: 0, //待回访客户数量
            needVisiteCurrentPage: 0,

            visitedCustomerData: [], //已回访客户数据
            visitedCustomerCount: 0, //已回访客户数量
            visitedCurrentPage: 0,

        })
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
                backgroundColor: '#DD433B'
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
            this.fetchAllFirstPageData()
        })
    }

    componentDidMount() {
        this.fetchAllFirstPageData();
    }

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
                Alert.alert(e)
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
            });

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


    renderItem = (item, index) => {
        console.log(item);
        return (
            <View style={styles.list_content}>
                <View style={styles.list_content_titleView}>
                    <Text
                        style={styles.list_content_carName}> {item.name}</Text>

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
                <View style={[styles.list_content_access_infoView, {marginBottom: 10}]}>
                    <Text style={styles.list_content_rowTitle}>上次操作时间:</Text>
                    <Text
                        style={styles.list_content_rowText}>{Util.formatDate(item.last_time)}</Text>
                </View>
            </View>
        )
    };

    render() {
        return (
            <ScrollableTabView
                ref='scrollableTabView'
                tabBarBackgroundColor={'white'}
                tabBarPosition='top'
                tabBarActiveTextColor={'#DD433B'}
                tabBarInactiveTextColor={'#999999'}
                tabBarTextStyle={{fontSize: 14, marginTop: 10}}
                scrollWithoutAnimation={false}
                tabBarUnderlineStyle={{backgroundColor: ColorRes.themeRed, height: 2}}
                onChangeTab={(index) => {

                }}
            >
                {this.state.isAllCustomerLoading ?
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
                        keyExtractor={() => Util.generateRandomStr()}
                        renderItem={({item, index}) => this.renderItem(item, index)}
                        tabLabel={`全部(${this.state.allCustomerCount})`}
                        onEndReached={() => this.fetchAllPerPageData(this.state.allCustomerCurrentPage + 1)}
                        onEndReachedThreshold={0.1}
                        ListEmptyComponent={this.emptyComponent}
                        key={1}
                    />}

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
                        renderItem={({item, index}) => this.renderItem()}
                        tabLabel={`待回访(${this.state.needVisiteCustomerCount})`}
                        key={3}
                        ListEmptyComponent={this.emptyComponent}
                    />
                }
                {this.state.isVisitedLoading ?
                    <View
                        tabLabel={`已回访(0)`}
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
                        data={this.state.visitedCustomerData}
                        renderItem={({item, index}) => this.renderItem()}
                        tabLabel={`已回访(${this.state.visitedCustomerCount})`}
                        ListEmptyComponent={this.emptyComponent}
                        key={2}
                    />}
                <View key={4} tabLabel={'老顾客'}>
                    <Text>老顾客</Text>
                </View>
            </ScrollableTabView>
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
        borderColor: '#DD433B',
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