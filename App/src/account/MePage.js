import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native'
import ColorRes from "../config/ColorRes";
import Constants from "../config/Constants";
import StorageHelper from "../utils/StorageHelper"

var listData = [
    {"title": "设置", "img": require('../../assets/images/me_setting.png')},
    {"title": "版本号", "img": require('../../assets/images/me_drafts.png')}
]
export default class MePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phone: ''
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '个人中心',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#DD433B'
            },
        }
    };

    componentDidMount() {
        StorageHelper
            .getPhone()
            .then((phone) => {
                this.setState({
                    phone: phone
                })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    keyExtractor = (item, index) => item.title
    /**
     * 列表的每一行
     * @param item
     * @param index
     * @returns {*}
     */
    renderItem = (item, index) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    this.clickItem(item, index)
                }}
                style={styles.style_listView_content}>
                <Image style={styles.style_listView_icon} source={item.img}/>
                <Text style={styles.style_listView_text}>{item.title}</Text>
                <Text style={styles.style_listView_subText}>{index === 1 ? Constants.VERSION_NAME : ''}</Text>
                {
                    index === 0 ?
                        <Image style={styles.style_listView_arrow}
                               source={require('../../assets/images/me_list_arrow.png')}/> : null
                }
            </TouchableOpacity>
        )
    };

    /**
     * 点击cell
     * @param item
     * @param index
     */
    clickItem = (item, index) => {
        if (index === 0) {
            this.props.navigation.navigate({
                routeName: "SETTING",
            })
        }
    }

    render() {
        return (
            <View style={{backgroundColor: ColorRes.grayBackgroud, width: '100%', height: '100%'}}>
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    backgroundColor: ColorRes.themeRed
                }}>
                    <Image style={{width: 80, height: 80}}
                           source={require('../../assets/images/me_default_avatar.png')}/>
                    <Text style={{color: 'white', marginTop: 5}}>{this.state.phone}</Text>
                </View>
                <FlatList data={listData}
                          renderItem={({item, index}) => this.renderItem(item, index)}
                          keyExtractor={this.keyExtractor}
                          extraData={this.state}
                          style={styles.style_listView} alwaysBounceVertical={false}
                />
            </View>
        )

    }
}
const styles = StyleSheet.create({
    style_listView: {
        flex: 1,
        marginTop: 16
    },
    style_listView_content: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d1d1d1',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: 50,
        backgroundColor: '#fff'
    },
    style_listView_icon: {
        marginLeft: 15,
        width: 24,
        height: 24
    },
    style_listView_text: {
        marginLeft: 15,
        fontSize: 16,
        textAlign: 'left',
        flex: 1,
        color: '#191919',
        fontFamily: 'PingFangSC-Regular'
    },
    style_listView_subText: {
        fontSize: 16,
        color: '#999999',
        fontFamily: 'PingFangSC-Regular',
        marginRight: 12
    },
    style_listView_arrow: {
        marginRight: 15,
        width: 9,
        height: 14
    }
});