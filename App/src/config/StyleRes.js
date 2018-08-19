import {StyleSheet} from 'react-native'
import colorRes from './ColorRes'

const Style = StyleSheet.create({
    button_bg_red: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dd433b',
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
        borderColor: colorRes.themeRed,
        borderRadius: 4
    }
});

module.exports = {...Style};