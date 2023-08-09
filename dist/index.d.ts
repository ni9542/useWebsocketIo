/**
 * @description websocketIO
 */
export declare let websock: any;
export declare let isConnect: boolean;
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
 * @description 心跳设置类型
 */
interface HeartType {
    timeout?: number;
    heartObj: {
        [key: string]: string | number | any;
    };
}
/**
 * @description websocket连接配置
 * @param options 参数设置
 * @param options.websocketUrl 必传参数，websocket地址
 * @param options.heartObj 必传参数，websocket心跳发送对象
 * @param options.timeout 可选，websocket心跳检查发送时间
 */
interface SettinsConfigType {
    websocketUrl: string;
}
export declare const settinsConfig: (options: SettinsConfigType & HeartType) => void;
export declare const getSettinsConfig: () => SettinsConfigType & HeartType;
/**
 * @description 初始化websocket
 */
export declare const initWebsocket: () => void;
/**
 * 连接发生错误的回调方法
 * @param callback (e:T) => T
 * @constructor
 */
export declare const OnError: <T>(callback: (e: T) => T) => T | {
    error: string;
};
/**
 * @description 返回错误日志
 * @param callback （e:any） => any
 */
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
export {};
