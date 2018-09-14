import {StyleSheet} from 'react-native'
import ColorRes from './ColorRes'
import dimenRes from "./DimenRes";

const Style = StyleSheet.create({
    button_bg_red: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorRes.themeRed,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 24,
        height: 44,
        borderRadius: 4
    },
    button_bg_white_red_border: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 24,
        height: 44,
        borderWidth: 1,
        borderColor: ColorRes.themeRed,
        borderRadius: 4
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
    },
    item_bg: {
        backgroundColor: 'white',
        paddingLeft: dimenRes.pageBorder,
        paddingRight: dimenRes.pageBorder,
        height: dimenRes.itemHeight,
        alignItems: 'center',
        flexDirection: 'row'
    },
    style_login_button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorRes.themeRed,
        position: 'absolute',
        bottom: 30,
        right: 30,
        left: 30
    },
    item_key: {
        color: ColorRes.fontBlack,
        fontSize: 14,
        width: 70
    },
    item_input: {
        fontSize: 14,
        flex: 1,
        color: ColorRes.fontPlaceholder,
        padding: 0
    },
    item_line: {
        height: 1,
        width: dimenRes.pageBorder,
        backgroundColor: 'white'
    }
});

module.exports = {...Style};