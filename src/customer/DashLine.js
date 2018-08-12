import React, {Component} from "react";
import {
    View,
    StyleSheet
} from "react-native";

/*水平方向的虚线
 *len 虚线个数
 * width 总长度
 * backfroundColor 背景颜色
 */
export default class DashLine extends Component{
    render() {

        var len = this.props.len;
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }

        return (
            <View style={[styles.container, {width: this.props.width}]}>
                {
                    arr.map((item, index) => {
                        return <View style={[styles.dashItem, {backgroundColor: this.props.backgroundColor}]} key={'dash' + index} />
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 12
    },
    dashItem: {
        height: 1,
        width: 4,
        marginRight: 2,
        flex: 1
    }
})