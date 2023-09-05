/**
 * websocket 封装
 */

let websock: WebSocket | any
let rec: any
let isConnect: boolean = false

interface ConfigMustType {
  heartbeatData: unknown
  websocketURL: string
}

interface ConfigSelectableType extends ConfigMustType {
  timeout?: number
  maxReconnectionNum?: number
  reconnectionTime?: number
}

const config = <ConfigSelectableType & { timeObject: any, reconnectionNum: number }>{
  timeout: 3000,
  heartbeatData: {},
  timeObject: null,
  reconnectionNum: 0,
  reconnectionTime: 5000,
  maxReconnectionNum: 5,
  websocketURL: ''
}

/**
 * @description 返回websocket连接状态
 */
export function getIsConnect() {
  return isConnect
}

/**
 * @description 初始化基本配置
 * @param option
 * @constructor
 */
export function SettingsConfig(option: ConfigSelectableType) {
  if (!option) return new Error('该方法必须有配置参数')
  config.websocketURL = option.websocketURL
  config.heartbeatData = option.heartbeatData
  config.timeout = option.timeout ? option.timeout : 3000
  config.maxReconnectionNum = option.maxReconnectionNum ? option.maxReconnectionNum : 5
  config.reconnectionTime = option.reconnectionTime ? option.reconnectionTime : 5000
}

/**
 * @description 初始化websocket
 * @param callback
 * @constructor
 */
export function CreateWebsocket(callback?: (isconnect: boolean) => void, reconnectionSocket?: Function) {
  if (callback && typeof callback !== 'function') return new Error('cuowu')
  try {
    InitWebsocket((type) => {
      if (callback) {
        callback(type)
      }
    }, reconnectionSocket && reconnectionSocket)
  } catch (e) {
    console.log('尝试连接失败，重连')
    Reconnection()
  }
}

/**
 * @description 创建websocket连接
 * @param callback
 * @constructor
 */
export function InitWebsocket(callback?: (isconnect: boolean) => void, reconnectionSocket?: Function) {
  if (config.websocketURL === '') return console.log('未设置连接地址')
  websock = new WebSocket(config.websocketURL)
  websock.onopen = () => {
    isConnect = true
    HeartStart()
    if (callback && typeof callback === 'function') {
      callback(isConnect)
    }
  }
  websock.onerror = () => {
    // 不是正常关闭, 就重连
    isConnect = false
    if(reconnectionSocket) {
      reconnectionSocket()
    }else{
      Reconnection()
    }
  }
}

export function getWebSocket() {
  if (isConnect) {
    return websock
  }else{
    return new Error('websocket未连接')
  }
}

/**
 * @description 重连
 * @constructor
 */
export function Reconnection() {
  if (isConnect) return; //已经连上，就不再重连
  rec && clearTimeout(rec)
  rec = setTimeout(() => {
    if (config.reconnectionNum >= (config.maxReconnectionNum as number)) {// 最大重连次数
      clearTimeout(rec)
      isConnect = false
      HeartStop()
      return;
    }
    config.reconnectionNum++
    CreateWebsocket()
  }, config.reconnectionTime)
}

/**
 * @description 正常关闭连接
 * @constructor
 */
export function CloseWebsocket() {
  isConnect = false
  websock.close(1000)
}

/**
 * @description 发送消息
 * @param data
 * @constructor
 */
export function SendMsg<T, >(data: T) {
  if (!data || data === undefined || data === '') return new Error('发送消息数据必须为真值')
  let _d = JSON.stringify(data)
  if (websock.readyState == websock.OPEN) {
    websock.send(_d)
  } else if (websock.readyState === websock.CONNECTING) {
    // 连接正在开启状态时，则等待1s后发送
    // setTimeout(() => {
    //   SendMsg(_d)
    // }, 1500)
  } else {
    // 未开启，等待2s后重新调用
    // setTimeout(() => {
    //   SendMsg(_d)
    // }, 2000)
  }
}

/**
 * @description 监听message消息返回
 * @param callback
 * @constructor
 */
export function OnSocMessage(callback: (msg: any) => any) {
  if (typeof callback !== 'function') return new Error('返回值必须是一个方法')
  websock.onmessage = (msg: MessageEvent) => {
    let _d = JSON.parse(msg.data)
    HeartReset()
    callback(_d)
  }
}

/**
 * @description 监听连接错误消息
 * @param callback
 * @constructor
 */
export function OnCloseMsg(callback: (msg: unknown) => unknown) {
  if (typeof callback !== 'function') return new Error('返回值必须是一个方法')
  websock.onclose = (e: unknown) => {
    callback(e)
  }
}

/**
 * @description 开启心跳
 * @constructor
 */
export function HeartStart() {
  config.timeObject = setInterval(() => {
    if (isConnect) websock.send(JSON.stringify(config.heartbeatData))
  }, config.timeout)
}

/**
 * @description 重置心跳
 * @constructor
 */
export function HeartReset() {
  clearInterval(config.timeObject)
  HeartStart()
}

/**
 * @description 关闭心跳
 * @constructor
 */
export function HeartStop() {
  clearInterval(config.timeObject)
}