import React, {Component} from "react"
import {
    View,
    FlatList,
    Text,
    Image, Platform, ActivityIndicator
} from "react-native";
import Util from '../utils/Utils'
import HttpManager from '../utils/HttpManager'
import ColorRes from "../config/ColorRes";
import Constants from "../config/Constants";

export default class GetRegisterCodePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            displayData: []
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '获取注册码',
            headerTintColor: '#fff'
        }
    };

    componentDidMount() {
        this.fetchRrgisterData()
    }

    fetchRrgisterData = () => {
        HttpManager
            .getRegisterStep()
            .then((response) => {
                if (response.data.code === Constants.SUCCESS_CODE) {
                    this.setState({
                        displayData: Util.clone(response.data.data),
                        isLoading: false
                    })
                }
            })
            .catch(e => {
                console.log(e.toString())
            });
    };

    renderItem = (item, index) => {
        return (
            <View>
                <Text style={{
                    fontSize: 15,
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 10,
                    color: 'black'
                }}>{index + 1 + '.' + item.name}</Text>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Image style={{alignItems: 'center', width: 270, height: 430}}
                           source={{uri: item.pic}}/></View>
            </View>
        )
    };

    render() {
        return (
            this.state.isLoading ?
                <View
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
                    data={this.state.displayData}
                    keyExtractor={(item) => item.name}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                />
        )

    }
}