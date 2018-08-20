import netClient from 'axios'
import Util from "./Utils"
import md5 from "react-native-md5"
import StorageHelper from './StorageHelper'

const BASE_URL = 'http://43.226.69.182';

const USER = 'user';
const CUSTOMER = 'customer';
const ORDER = 'order';


const GET_CODE = `${buildUrl(USER)}/getCode.php`; //获取注册码
const REGISTER = `${buildUrl(USER)}/register.php`; //注册
const LOGIN = `${buildUrl(USER)}/login.php`;//登陆
const CUSTOMER_OPERATE = `${buildUrl(CUSTOMER)}/operate.php`;//添加/修改客户信息
const CUSTOMER_GETLIST = `${buildUrl(CUSTOMER)}/getList.php`;//客户列表/搜索
const ORDER_GETLIST = `${buildUrl(ORDER)}/getList.php`;//客户购买商品列表
const ORDER_OPERATE = `${buildUrl(ORDER)}/operate.php`;// 添加/修改客户购买商品信息


/**
 * 完善URL
 * @param moduleName
 * @returns {string}
 */
function buildUrl(moduleName) {
    return `/hzp_api/htdocs_api/${moduleName}`
}

async function execute(url, params) {
    let body = {
        url: BASE_URL + url,
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data '},
        timeout: 10000,
        data: buildParams(params)
    };
    return netClient(body);
};

function buildParams(params) {
    let timestamp = new Date().getTime();
    if (Util.isEmpty(params)) {
        let bodyPatams = {
            timestamp: timestamp,
            signature: md5.hex_md5(timestamp + "admin"),
        };
        return bodyPatams;
    } else {
        params.timestamp = timestamp;
        params.signature = md5.hex_md5(timestamp + "admin")
        return params;
    }
}

module.exports = {
    BASE_URL,
    /**
     * 获取注册码
     * @returns {Promise<*>}
     */
    fetchRegisterCode() {
        return execute(GET_CODE)
    },
    /**
     * 注册
     * @param account
     * @param password
     * @param registerCode
     * @returns {Promise<*>}
     */
    register(account, password, registerCode) {
        return execute(REGISTER, {code: registerCode, phone: account, password: password})
    },
    login(account, password) {
        return execute(LOGIN, {phone: account, password: password})
    },
    /**
     * 添加用户信息
     * @param customerData
     * @returns {Promise<*>}
     */
    addCustomer(customerData) {
        let params = {};
        StorageHelper.getUID().then((uid) => {
            params.optType = 'add';
            params.uid = uid;
            if (!Util.isEmpty(customerData.name)) params.name = customerData.name;
            if (!Util.isEmpty(customerData.age)) params.age = customerData.age;
            if (!Util.isEmpty(customerData.job)) params.job = customerData.job;
            if (!Util.isEmpty(customerData.phone)) params.phone = customerData.phone;
            if (!Util.isEmpty(customerData.address)) params.address = customerData.address;
            if (!Util.isEmpty(customerData.skindesc)) params.skindesc = customerData.skindesc;
            return execute(CUSTOMER_OPERATE, params)
        });
    },
    /**
     * 编辑用户信息
     * @param customerData
     * @returns {Promise<*>}
     */
    editCustomer(customerId, customerData) {
        let params = {};
        StorageHelper.getUID().then((uid) => {
            params.optType = 'edit';
            params.customer_id = customerId;
            if (!Util.isEmpty(customerData.name)) params.name = customerData.name;
            if (!Util.isEmpty(customerData.age)) params.age = customerData.age;
            if (!Util.isEmpty(customerData.job)) params.job = customerData.job;
            if (!Util.isEmpty(customerData.phone)) params.phone = customerData.phone;
            if (!Util.isEmpty(customerData.address)) params.address = customerData.address;
            if (!Util.isEmpty(customerData.skindesc)) params.skindesc = customerData.skindesc;
            return execute(CUSTOMER_OPERATE, params)
        });
    },

    /**
     * 获取客户列表
     */
    customerGetList(page) {
        let params = {};
        StorageHelper.getUID().then((uid) => {
            params.uid = uid;
            params.page = page;
            return execute(CUSTOMER_GETLIST, params)
        });
    },
    /**
     * 搜索客户
     * @param content 搜索关键字
     * @param page 第几页
     * @param num  每页数量
     */
    searchCustomerList(content, page) {
        let params = {};
        StorageHelper.getUID().then((uid) => {
            params.uid = uid;
            params.search = search;
            params.page = page;
            return execute(CUSTOMER_GETLIST, params)
        });
    },
    /**
     * 客户购买商品列表
     * @param customer_id
     * @param page
     * @param num
     */
    customerCargoList(customer_id, page) {
        return execute(ORDER_GETLIST, {customer_id: customer_id, page: page})
    },

};



