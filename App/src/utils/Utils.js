module.exports = {
    /**
     * 扩大diff深度
     */
    clone(source) {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.clone(source[item]) : source[item];
        }
        return sourceCopy;
    },
    /**
     * 判断某个字符是否为空
     * @param itemDesc
     * @returns {boolean}
     */
    isEmpty(itemDesc) {
        let isEmpty = itemDesc === undefined || itemDesc === null || itemDesc === '' || JSON.stringify(itemDesc) === '{}';
        if (isEmpty) {
            return true
        } else {
            return false;
        }
    },
    /**
     * 日期格式化
     * @param timestamp
     * @param formater
     * @returns {*}
     */
    formatDate(timestamp, formater) {
        if (this.isEmpty(timestamp)) {
            return '';
        }
        let date = new Date();
        date.setTime(parseInt(timestamp) * 1000);
        formater = (formater != null) ? formater : 'yyyy-MM-dd hh:mm';
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };

            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                    (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
            return fmt;
        }
        return date.Format(formater);
    }
    ,
    /**
     * 产生随机数
     * @param len 需要的长度
     * @returns {*}
     */
    generateRandomStr(len) {
        len = len || 32;
        let strRange = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = strRange.length;
        let randomString = '';
        for (let i = 0; i < len; i++) {
            randomString += strRange.charAt(Math.floor(Math.random() * maxPos));
        }
        return randomString;
    }
    ,
    /**
     * 生成UUID
     * @returns {string}
     */
    generateUUID() {
        let len = 32; //32长度
        let radix = 16; //16进制
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
};