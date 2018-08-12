import Realm from 'realm'
import {Alert} from 'react-native'
import Util from '../utils/Utils'

//客户表结构
const customerSchema = {
    name: 'customer',
    properties: {
        customerId: 'string',       //客户id
        name: 'string',             //客户名字
        age: 'int?',                //客户年龄
        job: 'string?',             //工作
        phone: 'string?',           //电话
        address: 'string?',         //住址
        skinDesc: 'string?',        //肤质描述
        consumeTotal: 'int?',       //消费总金额
        lastCousumeTime: {type: 'int?', defaultValue: new Date().getTime()}     //上次消费时间
    }
};

//商品表结构
const cargoDetailSchema = {
    name: 'cargoDetail',
    properties: {
        orderId: 'string',     //订单号
        cargoName: 'string',   //商品名称
        cargoPrice: 'string',   //商品价格
        dealTime: 'int',        //成交时间
        customerId: 'string'    //购买客户id
    }
};

/**
 * 创建订单号
 * @returns {string}
 */
function createOrderNumber() {
    //年+月+日+时+分+秒+随机数
    let data = new Date();
    //获取随机数
    let randomStr = String(Math.random())
    let result = randomStr.substring(randomStr.length - 3, randomStr.length)
    let month = String(data.getMonth() + 1).length === 1 ? '0' + String(data.getMonth() + 1) : String(data.getMonth() + 1);
    let orderNumber = `${data.getFullYear()}${month}${data.getDate()}${data.getHours()}${data.getMinutes()}${data.getSeconds()}${result}`;
    return orderNumber;
};

const realmInstance = new Realm({schema: [customerSchema, cargoDetailSchema], schemaVersion: 1})

let DatabaseManager = {

    /**
     * 创建用户
     * @param data
     */
    createCustomer(data) {
        try {
            realmInstance.write(() => {
                realmInstance.create('customer', {
                    customerId: Util.generateUUID(),
                    name: data.name,
                    age: data.age,
                    job: data.job,
                    phone: data.phone,
                    address: data.address,
                    skinDesc: data.skinDesc,
                    consumeTotal: data.consumeTotal,
                    lastCousumeTime: new Date().getTime()
                })
            })
        } catch (e) {
            Alert.alert(e.toString())
        }
    },
    /**
     * 编辑用户id
     * @param customerid
     * @param data
     */
    editCustomerData(customerid, data) {
        try {
            realmInstance.write(() => {
                let customer = realmInstance.objects('customer');
                let result = customer.filtered(`customerId = "${customerid}"`)
                result[0].name = data.name;
                result[0].age = data.age;
                result[0].job = data.job;
                result[0].skinDesc = data.skinDesc;
                result[0].phone = data.phone;
                result[0].address = data.address;
                result[0].lastCousumeTime = new Date().getTime()
            })
        } catch (e) {
            Alert.alert(e.toString())
        }
    },
    /**
     * 客户增加商品
     * @param customerid
     * @param data
     */
    createCargoForCustomer(customerid, data) {
        try {
            realmInstance.write(() => {
                realmInstance.create('cargoDetail', {
                    orderId: createOrderNumber(),
                    cargoName: data.cargoName,
                    cargoPrice: data.cargoPrice,
                    dealTime: new Date().getTime(),
                    customerId: customerid,
                })
            })
        } catch (e) {
            Alert.alert(e.toString())
        }
    },

    /**
     * 客户编辑商品
     * @param orderid
     * @param data
     */
    editCargoForCustomer(orderid, data) {
        try {
            realmInstance.write(() => {
                let cargoDetail = realmInstance.objects('cargoDetail');
                let result = cargoDetail.filtered(`orderId = "${orderid}"`);
                result[0].cargoName = data.cargoName;
                result[0].cargoPrice = data.cargoPrice;
                result[0].dealTime = data.dealTime;
            })
        } catch (e) {
            Alert.alert(e.toString())
        }
    },

    /**
     * 查询所有用户
     */
    queryAllCustomer() {
        let customer = realmInstance.objects('customer');
        return customer;
    },

    /**
     * 查询指定用户商品数据
     */
    queryCargoForCustomer(customerId) {
        let cargoDetail = realmInstance.objects('cargoDetail');
        let result = customer.filtered(`customerId = "${customerId}"`);
        return result;
    },

    addDataChangeListener(behavior) {
        realmInstance.addListener('change', behavior);
    }
    ,
    removeDataChangeListener(behavior) {
        realmInstance.removeListener('change', behavior);
    }
};
export default DatabaseManager;