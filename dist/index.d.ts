/**
 * @description websocketIO
 */
export declare let websock: any;
export declare let isConnect: boolean;
/**
 * @description websocket连接配置
 * websocketUrl 连接地址
 * timeout 保持心跳时间
 * heartObj 发送的心跳包数据
 */
export declare const WebsocketConfig: {
    websocketUrl: string;
    timeout: number;
    heartObj: {};
};
export declare const createWebsocket: (callback?: (isConnect: boolean) => any) => void;
/**
 * @description websocket 重连方法
 * @param callback (e) => boolean 连接是否成功
 */
export declare const reConnect: (callback?: (e: any) => any) => void;
/**
 * @description websocket关闭连接
 */
export declare const closeWebsocket: () => void;
/**
 * @description 初始化websocket
 */
export declare const initWebsocket: () => void;
export declare const abnormalClose: (callback: (e: any) => any) => void;
/**
 * @description websocket send 发送消息
 * @param data any
 */
export declare const sendMsg: (data: any) => void;
/**
 * @description 监听websocket message消息
 * @param callback (e:any) => any
 */
export declare const onMessage: (callback: (e: any) => any) => void;
