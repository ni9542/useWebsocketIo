"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = exports.sendMsg = exports.abnormalClose = exports.initWebsocket = exports.getSettinsConfig = exports.settinsConfig = exports.closeWebsocket = exports.reConnect = exports.createWebsocket = exports.isConnect = exports.websock = void 0;
/**
 * @description websocketIO
 */
exports.websock = null;
var rec;
exports.isConnect = false;
var createWebsocket = function (callback) {
    try {
        (0, exports.initWebsocket)();
    }
    catch (e) {
        console.log('创建连接失败');
        (0, exports.reConnect)(); // 创建失败，重新连接
    }
    if (callback && typeof callback === 'function') {
        setTimeout(function () {
            callback(exports.isConnect);
        }, 500);
    }
};
exports.createWebsocket = createWebsocket;
/**
 * @description websocket 重连方法
 * @param callback (e) => boolean 连接是否成功
 */
var reConnect = function (callback) {
    if (exports.isConnect)
        return; // 已连接就不重连
    rec && clearTimeout(rec);
    rec = setTimeout(function () {
        if (callback && typeof callback === 'function') {
            (0, exports.createWebsocket)(function (e) {
                callback(e);
            });
        }
        else {
            (0, exports.createWebsocket)();
        }
    }, 3000);
};
exports.reConnect = reConnect;
/**
 * @description websocket关闭连接
 */
var closeWebsocket = function () {
    exports.isConnect = false;
    heartCheck.stop();
    exports.websock.close(1000);
};
exports.closeWebsocket = closeWebsocket;
/**
 * @description websocket心跳设置
 * @param timeout 心跳包时间，默认9000
 * @param heartObj 心跳包发送数据
 */
var heartCheck = {
    timeout: 9000,
    timeoutObj: null,
    heartObj: {},
    start: function () {
        var that = this;
        this.timeoutObj = setInterval(function () {
            if (exports.websock.readyState !== 1) {
                that.stop();
                exports.isConnect = false;
                (0, exports.reConnect)();
                return;
            }
            if (exports.isConnect)
                (0, exports.sendMsg)(that.heartObj);
        }, this.timeout);
    },
    reset: function () {
        clearInterval(this.timeoutObj);
        this.start();
    },
    stop: function () {
        clearInterval(this.timeoutObj);
    }
};
var WebsocketConfig = {
    websocketUrl: "",
};
var settinsConfig = function (options) {
    if (options) {
        WebsocketConfig.websocketUrl = options.websocketUrl;
        heartCheck.timeout = options.timeout ? options.timeout : 9000;
        heartCheck.heartObj = options.heartObj;
    }
};
exports.settinsConfig = settinsConfig;
var getSettinsConfig = function () {
    return {
        websocketUrl: WebsocketConfig.websocketUrl,
        timeout: heartCheck.timeout,
        heartObj: heartCheck.heartObj
    };
};
exports.getSettinsConfig = getSettinsConfig;
/**
 * @description 初始化websocket
 */
var initWebsocket = function () {
    if (WebsocketConfig.websocketUrl === '')
        return console.log('websocket 连接地址未设置');
    var URL = WebsocketConfig.websocketUrl;
    exports.websock = new WebSocket(URL);
    exports.websock.onopen = function (e) {
        exports.isConnect = true;
        heartCheck.start();
    };
    // 连接发生错误的回调方法
    exports.websock.onerror = function (e) {
        exports.isConnect = false;
        (0, exports.reConnect)();
    };
};
exports.initWebsocket = initWebsocket;
/**
 * @description 返回错误日志
 * @param callback （e:any） => any
 */
var abnormalClose = function (callback) {
    exports.websock.onclose = function (e) {
        if (typeof callback === 'function') {
            callback(e);
        }
    };
};
exports.abnormalClose = abnormalClose;
/**
 * @description websocket send 发送消息
 * @param data any
 */
var sendMsg = function (data) {
    if (exports.websock.readyState !== 1 || !exports.isConnect) {
        return;
    }
    var _d = JSON.stringify(data);
    exports.websock.send(_d);
};
exports.sendMsg = sendMsg;
/**
 * @description 监听websocket message消息
 * @param callback (e:any) => any
 */
var onMessage = function (callback) {
    if (typeof callback === 'function') {
        exports.websock.onmessage = function (e) {
            callback(e);
        };
    }
};
exports.onMessage = onMessage;
//# sourceMappingURL=index.js.map