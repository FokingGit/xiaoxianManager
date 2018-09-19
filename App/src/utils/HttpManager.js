import netClient from 'axios'
import Util from "./Utils"
import md5 from "react-native-md5"
import StorageHelper from './StorageHelper'

// const BASE_URL = 'http://43.226.69.182';
const BASE_URL = 'http://45.62.105.17';

const USER = 'user';
const CUSTOMER = 'customer';
const ORDER = 'order';
const LIUCHENG = 'liucheng';


const GET_CODE = `${buildUrl(USER)}/getCode.php`; //获取注册码
const REGISTER = `${buildUrl(USER)}/register.php`; //注册
const LOGIN = `${buildUrl(USER)}/login.php`;//登陆
const CUSTOMER_OPERATE = `${buildUrl(CUSTOMER)}/operate.php`;//添加/修改客户信息
const CUSTOMER_GETLIST = `${buildUrl(CUSTOMER)}/getList.php`;//客户列表/搜索
const ORDER_GETLIST = `${buildUrl(ORDER)}/getList.php`;//客户购买商品列表
const ORDER_OPERATE = `${buildUrl(ORDER)}/operate.php`;// 添加/修改客户购买商品信息
const CONFIRM_VISIT = `${buildUrl(CUSTOMER)}/sureVisit.php`;// 确认回访
const FINDENCRYPTED = `${buildUrl(USER)}/findEncrypted.php`;// 获取密保问题
const FINDBACKPASS = `${buildUrl(USER)}/findBackPass.php`;// 找回密码
const DELETE_CUSTOMER = `${buildUrl(CUSTOMER)}/delete.php`;// 删除客户
const DELETE_ORDER = `${buildUrl(ORDER)}/delete.php`;// 删除商品
const GET_REGISTER = `${buildUrl(LIUCHENG)}/getList.php`;// 获取注册流程


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
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout: 10000,
        data: buildParams(params),
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
    };
    return netClient(body);
}

function buildParams(params) {
    let timestamp = parseInt(new Date().getTime() / 1000);
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
     * @param encrypted 密保问题
     * @param answer 密保答案
     * @returns {Promise<*>}
     */
    register(account, password, registerCode, encrypted, answer) {
        return execute(REGISTER, {
            code: registerCode,
            phone: account,
            password: password,
            encrypted: encrypted,
            answer: answer
        })
    },
    login(account, password) {
        return execute(LOGIN, {password: password, phone: account})
    },
    /**
     * 添加用户信息
     * @param customerData
     * @returns {Promise<*>}
     */
    async addCustomer(customerData) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.optType = 'add';
        params.uid = uid;
        if (!Util.isEmpty(customerData.name)) params.name = customerData.name;
        if (!Util.isEmpty(customerData.age)) params.age = customerData.age;
        if (!Util.isEmpty(customerData.job)) params.job = customerData.job;
        if (!Util.isEmpty(customerData.phone)) params.phone = customerData.phone;
        if (!Util.isEmpty(customerData.address)) params.address = customerData.address;
        if (!Util.isEmpty(customerData.skindesc)) params.skindesc = customerData.skindesc;
        return execute(CUSTOMER_OPERATE, params)
    },
    /**
     * 编辑用户信息
     * @param customerData
     * @returns {Promise<*>}
     */
    async editCustomer(customerId, customerData) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.optType = 'edit';
        params.customer_id = customerId;
        if (!Util.isEmpty(customerData.name)) params.name = customerData.name;
        if (!Util.isEmpty(customerData.age)) params.age = customerData.age;
        if (!Util.isEmpty(customerData.job)) params.job = customerData.job;
        if (!Util.isEmpty(customerData.phone)) params.phone = customerData.phone;
        if (!Util.isEmpty(customerData.address)) params.address = customerData.address;
        if (!Util.isEmpty(customerData.skindesc)) params.skindesc = customerData.skindesc;
        return execute(CUSTOMER_OPERATE, params)
    },

    /**
     * 获取客户列表
     */
    async customerGetList(page) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.page = page;
        return execute(CUSTOMER_GETLIST, params)
    },
    /**
     * 获取回访信息
     * @param page 页码
     * @param type 1-未回访;2-已回访）
     * @returns {Promise<*>}
     */
    async customerVisitedGetList(page, type) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.page = page;
        params.is_visit = type;
        return execute(CUSTOMER_GETLIST, params)
    },
    /**
     * 搜索用户
     * @param page
     * @param searchContent 搜索内容
     * @returns {Promise<*>}
     */
    async customerSearchGetList(page, searchContent) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.page = page;
        params.search = searchContent;
        return execute(CUSTOMER_GETLIST, params)
    },

    /**
     * 历史客户
     * @param page
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @returns {Promise<*>}
     */
    async historyCustomerGetList(page, startTime, endTime) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.page = page;
        params.starttime = startTime;
        params.endtime = endTime;
        return execute(CUSTOMER_GETLIST, params)
    },


    /**
     * 搜索客户
     * @param content 搜索关键字
     * @param page 第几页
     * @param num  每页数量
     */
    async searchCustomerList(content, page) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.search = content;
        params.page = page;
        return execute(CUSTOMER_GETLIST, params)
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
    /**
     * 客户添加商品
     * @param customer_id
     * @param cargoData
     */
    customerAddCargo(customer_id, cargoData) {
        let params = {
            optType: 'add',
            customer_id: customer_id
        };
        if (!Util.isEmpty(cargoData.cargo_name)) params.cargo_name = cargoData.cargo_name;
        if (!Util.isEmpty(cargoData.cargo_price)) params.cargo_price = cargoData.cargo_price;
        if (!Util.isEmpty(cargoData.deal_time)) params.deal_time = cargoData.deal_time;
        if (!Util.isEmpty(cargoData.customer_reason)) params.customer_reason = cargoData.customer_reason;
        return execute(ORDER_OPERATE, params)

    },
    /** 客户编辑商品
     * @param order_id  订单id
     * @param cargoData 商品信息
     */
    customerEditCargo(order_id, cargoData) {
        let params = {
            optType: 'edit',
            order_id: order_id
        };
        if (!Util.isEmpty(cargoData.cargo_name)) params.cargo_name = cargoData.cargo_name;
        if (!Util.isEmpty(cargoData.cargo_price)) params.cargo_price = cargoData.cargo_price;
        if (!Util.isEmpty(cargoData.deal_time)) params.deal_time = cargoData.deal_time;
        if (!Util.isEmpty(cargoData.customer_reason)) params.customer_reason = cargoData.customer_reason;
        return execute(ORDER_OPERATE, params)
    },
    /**
     * 确认回访
     * @param customer_id 客户id
     * @returns {Promise<*>}
     */
    async confirmVisited(customer_id) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.customer_id = customer_id;
        return execute(CONFIRM_VISIT, params)
    },
    /**
     * 根据手机号获取密保问题
     * @param phone
     * @returns {Promise<*>}
     */
    findEncrypted(phone) {
        let params = {phone: phone};
        return execute(FINDENCRYPTED, params)
    },

    /**
     * 找回密码
     * @param phone   手机号
     * @param answer  密保答案
     * @param newPass 新密码
     * @returns {Promise<*>}
     */
    findBackpass(phone, answer, newPass) {
        let params = {
            phone: phone,
            answer: answer,
            newPass: newPass,
        };
        return execute(FINDBACKPASS, params)
    },
    /**
     * 删除某一个用户
     * @param customer_id 用户id
     * @returns {Promise<void>}
     */
    async deleteCustomer(customer_id) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.customer_id = customer_id;
        return execute(DELETE_CUSTOMER, params)
    },
    /**
     * 删除商品
     * @param order_id
     * @returns {Promise<*>}
     */
    deleteOrder(order_id) {
        return execute(DELETE_ORDER, {order_id: order_id})
    },
    async getCustomerDetail(customer_id) {
        let params = {};
        let uid = await StorageHelper.getUID();
        params.uid = uid;
        params.customer_id = customer_id;
        return execute(CUSTOMER_GETLIST, params)
    },
    getRegisterStep(){
        let params = {};
        return execute(GET_REGISTER,params)
    }
};

