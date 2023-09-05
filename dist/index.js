"use strict";
/**
 * websocket 封装
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartStop = exports.HeartReset = exports.HeartStart = exports.OnCloseMsg = exports.OnSocMessage = exports.SendMsg = exports.CloseWebsocket = exports.Reconnection = exports.getWebSocket = exports.InitWebsocket = exports.CreateWebsocket = exports.SettingsConfig = exports.getIsConnect = void 0;
var websock;
var rec;
var isConnect = false;
var config = {
    timeout: 3000,
    heartbeatData: {},
    timeObject: null,
    reconnectionNum: 0,
    reconnectionTime: 5000,
    maxReconnectionNum: 5,
    websocketURL: ''
};
/**
 * @description 返回websocket连接状态
 */
function getIsConnect() {
    return isConnect;
}
exports.getIsConnect = getIsConnect;
/**
 * @description 初始化基本配置
 * @param option
 * @constructor
 */
function SettingsConfig(option) {
    if (!option)
        return new Error('该方法必须有配置参数');
    config.websocketURL = option.websocketURL;
    config.heartbeatData = option.heartbeatData;
    config.timeout = option.timeout ? option.timeout : 3000;
    config.maxReconnectionNum = option.maxReconnectionNum ? option.maxReconnectionNum : 5;
    config.reconnectionTime = option.reconnectionTime ? option.reconnectionTime : 5000;
}
exports.SettingsConfig = SettingsConfig;
/**
 * @description 初始化websocket
 * @param callback
 * @constructor
 */
function CreateWebsocket(callback, reconnectionSocket) {
    if (callback && typeof callback !== 'function')
        return new Error('cuowu');
    try {
        InitWebsocket(function (type) {
            if (callback) {
                callback(type);
            }
        }, reconnectionSocket && reconnectionSocket);
    }
    catch (e) {
        console.log('尝试连接失败，重连');
        Reconnection();
    }
}
exports.CreateWebsocket = CreateWebsocket;
/**
 * @description 创建websocket连接
 * @param callback
 * @constructor
 */
function InitWebsocket(callback, reconnectionSocket) {
    if (config.websocketURL === '')
        return console.log('未设置连接地址');
    websock = new WebSocket(config.websocketURL);
    websock.onopen = function () {
        isConnect = true;
        HeartStart();
        if (callback && typeof callback === 'function') {
            callback(isConnect);
        }
    };
    websock.onerror = function () {
        // 不是正常关闭, 就重连
        isConnect = false;
        if (reconnectionSocket) {
            reconnectionSocket();
        }
        else {
            Reconnection();
        }
    };
}
exports.InitWebsocket = InitWebsocket;
function getWebSocket() {
    if (isConnect) {
        return websock;
    }
    else {
        return new Error('websocket未连接');
    }
}
exports.getWebSocket = getWebSocket;
/**
 * @description 重连
 * @constructor
 */
function Reconnection() {
    if (isConnect)
        return; //已经连上，就不再重连
    rec && clearTimeout(rec);
    rec = setTimeout(function () {
        if (config.reconnectionNum >= config.maxReconnectionNum) { // 最大重连次数
            clearTimeout(rec);
            isConnect = false;
            HeartStop();
            return;
        }
        config.reconnectionNum++;
        CreateWebsocket();
    }, config.reconnectionTime);
}
exports.Reconnection = Reconnection;
/**
 * @description 正常关闭连接
 * @constructor
 */
function CloseWebsocket() {
    isConnect = false;
    websock.close(1000);
}
exports.CloseWebsocket = CloseWebsocket;
/**
 * @description 发送消息
 * @param data
 * @constructor
 */
function SendMsg(data) {
    if (!data || data === undefined || data === '')
        return new Error('发送消息数据必须为真值');
    var _d = JSON.stringify(data);
    if (websock.readyState == websock.OPEN) {
        websock.send(_d);
    }
    else if (websock.readyState === websock.CONNECTING) {
        // 连接正在开启状态时，则等待1s后发送
        // setTimeout(() => {
        //   SendMsg(_d)
        // }, 1500)
    }
    else {
        // 未开启，等待2s后重新调用
        // setTimeout(() => {
        //   SendMsg(_d)
        // }, 2000)
    }
}
exports.SendMsg = SendMsg;
/**
 * @description 监听message消息返回
 * @param callback
 * @constructor
 */
function OnSocMessage(callback) {
    if (typeof callback !== 'function')
        return new Error('返回值必须是一个方法');
    websock.onmessage = function (msg) {
        var _d = JSON.parse(msg.data);
        HeartReset();
        callback(_d);
    };
}
exports.OnSocMessage = OnSocMessage;
/**
 * @description 监听连接错误消息
 * @param callback
 * @constructor
 */
function OnCloseMsg(callback) {
    if (typeof callback !== 'function')
        return new Error('返回值必须是一个方法');
    websock.onclose = function (e) {
        callback(e);
    };
}
exports.OnCloseMsg = OnCloseMsg;
/**
 * @description 开启心跳
 * @constructor
 */
function HeartStart() {
    config.timeObject = setInterval(function () {
        if (isConnect)
            websock.send(JSON.stringify(config.heartbeatData));
    }, config.timeout);
}
exports.HeartStart = HeartStart;
/**
 * @description 重置心跳
 * @constructor
 */
function HeartReset() {
    clearInterval(config.timeObject);
    HeartStart();
}
exports.HeartReset = HeartReset;
/**
 * @description 关闭心跳
 * @constructor
 */
function HeartStop() {
    clearInterval(config.timeObject);
}
exports.HeartStop = HeartStop;
//# sourceMappingURL=index.js.map