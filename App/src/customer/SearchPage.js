import React, {Component} from "react"
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Keyboard, Alert, ActivityIndicator, Dimensions
} from "react-native"
import ColorRes from '../config/ColorRes.js';
import StyleRes from '../config/StyleRes.js';
import HttpManager from "../utils/HttpManager.js";
import DashLine from "./DashLine";
import Util from "../utils/Utils";

let screenW = Dimensions.get('window').width;
export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            searchContent: '',
            isLoading: false,
            currentIndex: 0
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            backItemAction: this.backAction,
            searchItemAction: this.searchAction,
            setSearchContentAction: this.setSearchContentAction
        })
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View style={styles.navigation_container}>
                    <TouchableOpacity style={styles.navigation_backTouch}
                                      onPress={navigation.state.params ? navigation.state.params.backItemAction : () => {
                                      }}
                                      activeOpacity={0.5}>
                        <Image style={{width: 30, height: 30}}
                               source={require('../../assets/images/search_close.png')}/>
                    </TouchableOpacity>
                    <View style={styles.navigation_inputContainer}>
                        <Image style={{width: 25, height: 25}}
                               source={require('../../assets/images/search_input_icon.png')}/>
                        <TextInput
                            style={styles.navigation_input}
                            underlineColorAndroid='transparent'
                            placeholder='请输入客户名字/电话/地址搜索'
                            selectionColor={ColorRes.themeRed}
                            placeholderTextColor='#aaa'
                            onChangeText={(searchContent) =>
                                navigation.state.params.setSearchContentAction(searchContent)
                            }
                        />
                    </View>
                    <TouchableOpacity style={styles.navigation_searchTouch}
                                      onPress={navigation.state.params ? navigation.state.params.searchItemAction : () => {
                                      }}>
                        <Text style={styles.navigation_search_text}>搜索</Text>
                    </TouchableOpacity>
                </View>
            ),
            headerStyle: {
                backgroundColor: '#fff'
            },
            headerLeft: null
        }
    };

    render() {

        return (
            this.state.isLoading ? <View
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
                    style={styles.list}
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.searchValuationList(1, this.state.searchContent)}
                    data={this.state.dataList}
                    keyExtractor={(item) => item.last_time}
                    ListEmptyComponent={this.emptyComponent}
                    onEndReached={() => this.searchValuationList(this.state.currentIndex + 1, this.state.searchContent)}
                    onEndReachedThreshold={0.1}
                    renderItem={({item, index}) => this.renderItem(item, index)}/>
        )
    }

    emptyComponent = () => {
        return (<View style={styles.empty_container}>
            <Image style={styles.empty_image}
                   source={require('../../assets/images/search_empty.png')}/>
            <Text style={styles.empty_text}>没有匹配的结果哦</Text>
        </View>)
    };


    /**
     * 返回按钮事件
     */
    backAction = () => {
        this.props.navigation.pop()
    };

    /**
     * 根据输入内容搜索评估单
     * @param text 输入内容
     */
    searchAction = () => {
        this.searchValuationList(1, this.state.searchContent);
        var searchContent = this.state.searchContent;
        Keyboard.dismiss();
        console.log(searchContent);
    }

    setSearchContentAction = (searchContent) => {
        this.setState({
            searchContent: searchContent
        })
    };


    renderItem = (item, index) => {
        return (
            <View style={StyleRes.list_content}>
                <View style={StyleRes.list_content_titleView}>
                    <Text
                        style={StyleRes.list_content_carName}>{item.name}</Text>
                    <TouchableOpacity style={StyleRes.list_content_detailTouch}
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
                        <Text style={StyleRes.list_content_detail_text}>详情</Text>
                    </TouchableOpacity>

                </View>

                <View style={StyleRes.list_content_access_stateView}>
                    <Text
                        style={StyleRes.list_content_assessNumber}>{String(item.phone)}</Text>
                    <View style={StyleRes.list_content_assessPartingLine}/>
                    <Text
                        style={StyleRes.list_content_assessStatus}>年龄：{String(item.age)}</Text>
                </View>
                <DashLine backgroundColor={'#b0b0b0'} len={50} width={screenW - 30}/>
                {
                        <View style={[StyleRes.list_content_access_infoView, {marginBottom: 10}]}>
                            <Text style={StyleRes.list_content_rowTitle}>上次操作时间:</Text>
                            <Text
                                style={StyleRes.list_content_rowText}>{Util.formatDate(item.last_time)}</Text>
                        </View>
                }

            </View>
        )
    };

    searchValuationList = (page, content) => {
        if (page === 1) {
            //如果是第一页，那就出现loading页面
            this.setState({
                isLoading: true
            });
        }

        let displayData = [];
        HttpManager
            .searchCustomerList(content, page)
            .then((response) => {
                if (page === 1) {
                    //第一页数据
                    displayData = response.data.data.list;
                } else {
                    //更多
                    displayData = this.state.dataList.concat(response.data.data.list);
                }
                this.setState({
                    dataList: Util.clone(displayData),
                    isLoading: false,
                    currentIndex: page
                });
            }).catch((error) => {
            console.log(error);
        });
    }
}


const styles = StyleSheet.create({
    empty_container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    empty_image: {
        marginTop: 150,
        alignSelf: 'center',
        width: 240,
        height: 160
    },
    empty_text: {
        fontSize: 16,
        color: '#AAAAAA',
        marginTop: 10,
        alignSelf: "center"
    },
    navigation_container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '100%',
        height: 54,
        alignItems: 'center'
    },
    navigation_backTouch: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    navigation_inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ebebeb',
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        marginLeft: 8,
        height: 30,
        flex: 1
    },
    navigation_input: {
        fontSize: 12,
        flex: 1,
        alignSelf: 'stretch',
        padding: 0,
        backgroundColor: '#ebebeb',
        marginTop: 1,
        marginBottom: 1
    },
    navigation_searchTouch: {
        height: 30,
        width: 46,
        marginRight: 15,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: ColorRes.themeRed,
        alignItems: 'center',
        justifyContent: "center"
    },
    navigation_search_text: {
        color: '#fff',
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
    },
    list: {
        backgroundColor: '#ebebeb',
        width: '100%'
    }
});