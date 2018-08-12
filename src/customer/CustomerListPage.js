import React, {Component} from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StyleSheet
} from 'react-native'
import DatabaseManager from '../utils/DatabaseManager'
import Util from '../utils/Utils'
import ColorRes from "../config/ColorRes";
import DashLine from "./DashLine.js";

/**
 * 客户列表页
 */
let screenW = Dimensions.get('window').width;
export default class CustomerListPage extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            displayData: [],
            isLoading: true
        })
    }


    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{color: '#ffffff', fontSize: 20}}>
                        客户列表
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
        DatabaseManager.addDataChangeListener(this.fetchData)
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        DatabaseManager.removeDataChangeListener(this.fetchData)
    }

    fetchData = () => {
        let displayData = [];
        let customerList = DatabaseManager.queryAllCustomer().sorted('lastCousumeTime', true);
        for (let i = 0; i < customerList.length; i++) {
            let item = {
                name: customerList[i].name,
                age: customerList[i].age,
                job: customerList[i].job,
                address: customerList[i].address,
                phone: customerList[i].phone,
                skinDesc: customerList[i].skinDesc,
                lastCousumeTime: customerList[i].lastCousumeTime,
                customerId: customerList[i].customerId
            };
            displayData.push(item)
        }

        this.setState({
            displayData: Util.clone(displayData),
            isLoading: false
        })
    }

    searchCustomer = () => {

    };
    createCustomer = () => {
        this.props.navigation.navigate({routeName: 'CREATE_CUSTOMER', key: 'list-create'})
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
                        style={styles.list_content_assessNumber}>{item.phone}</Text>
                    <View style={styles.list_content_assessPartingLine}/>
                    <Text
                        style={styles.list_content_assessStatus}>年龄：{item.age}</Text>
                </View>
                <DashLine backgroundColor={'#b0b0b0'} len={50} width={screenW - 30}/>
                <View style={[styles.list_content_access_infoView, {marginBottom: 10}]}>
                    <Text style={styles.list_content_rowTitle}>上次操作时间:</Text>
                    <Text
                        style={styles.list_content_rowText}>{Util.formatDate(item.lastCousumeTime)}</Text>
                </View>
            </View>
        )
    };

    render() {
        return (
            <FlatList
                renderItem={({item, index}) => this.renderItem(item, index)}
                data={this.state.displayData}
            />
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
        borderColor: '#DD433B',
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
    list_content_rowText: {
        marginLeft: 8,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#111'
    }
});