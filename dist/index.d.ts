/**
 * websocket 封装
 */
interface ConfigMustType {
    heartbeatData: unknown;
    websocketURL: string;
}
interface ConfigSelectableType extends ConfigMustType {
    timeout?: number;
    maxReconnectionNum?: number;
    reconnectionTime?: number;
}
/**
 * @description 返回websocket连接状态
 */
export declare function getIsConnect(): boolean;
/**
 * @description 初始化基本配置
 * @param option
 * @constructor
 */
export declare function SettingsConfig(option: ConfigSelectableType): Error;
/**
 * @description 初始化websocket
 * @param callback
 * @constructor
 */
export declare function CreateWebsocket(callback?: (isconnect: boolean) => void, reconnectionSocket?: Function): Error;
/**
 * @description 创建websocket连接
 * @param callback
 * @constructor
 */
export declare function InitWebsocket(callback?: (isconnect: boolean) => void, reconnectionSocket?: Function): void;
export declare function getWebSocket(): any;
/**
 * @description 重连
 * @constructor
 */
export declare function Reconnection(): void;
/**
 * @description 正常关闭连接
 * @constructor
 */
export declare function CloseWebsocket(): void;
/**
 * @description 发送消息
 * @param data
 * @constructor
 */
export declare function SendMsg<T>(data: T): Error;
/**
 * @description 监听message消息返回
 * @param callback
 * @constructor
 */
export declare function OnSocMessage(callback: (msg: any) => any): Error;
/**
 * @description 监听连接错误消息
 * @param callback
 * @constructor
 */
export declare function OnCloseMsg(callback: (msg: unknown) => unknown): Error;
/**
 * @description 开启心跳
 * @constructor
 */
export declare function HeartStart(): void;
/**
 * @description 重置心跳
 * @constructor
 */
export declare function HeartReset(): void;
/**
 * @description 关闭心跳
 * @constructor
 */
export declare function HeartStop(): void;
export {};
