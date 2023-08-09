/**
 * @description websocketIO
 */
export let websock: any = null
let rec: any;
export let isConnect = false

export const createWebsocket = (callback?: (isConnect: boolean) => any) => {
  try {
    initWebsocket()
  }catch (e) {
    console.log('创建连接失败')
    reConnect() // 创建失败，重新连接
  }
  if(callback && typeof callback === 'function') {
    setTimeout(() => {
      callback(isConnect)
    }, 500)
  }
}
/**
 * @description websocket 重连方法
 * @param callback (e) => boolean 连接是否成功
 */
export const reConnect = (callback?:(e:any) => any) => {
  if(isConnect) return; // 已连接就不重连
  rec && clearTimeout(rec);
  rec = setTimeout(() => {
    if(callback && typeof callback === 'function') {
      createWebsocket((e) => {
        callback(e)
      })
    }else{
      createWebsocket()
    }
  }, 3000)
}

/**
 * @description websocket关闭连接
 */
export const closeWebsocket = () => {
  isConnect = false
  heartCheck.stop()
  websock.close(1000)
}

/**
 * @description 心跳设置类型
 */
interface HeartType {
  timeout?: number
  heartObj: {[key:string]: string | number | any}
}
interface HeartCheckType extends HeartType{
  timeoutObj: any,
  start: () => void
  reset: () => void
  stop: () => void
}

/**
 * @description websocket心跳设置
 * @param timeout 心跳包时间，默认9000
 * @param heartObj 心跳包发送数据
 */
const heartCheck: HeartCheckType = {
  timeout: 3000, // 每一段时间发送一次心跳包，默认3秒
  timeoutObj: null, // 延时对象
  heartObj: {}, // 心跳发送对象

  start: function() {
    let that = this
    this.timeoutObj = setInterval(function () {
      if(isConnect) sendMsg(that.heartObj)
    }, this.timeout)
  },

  reset: function () {
    clearInterval(this.timeoutObj)
    this.start()
  },

  stop: function () {
    clearInterval(this.timeoutObj)
  }
}

/**
 * @description websocket连接配置
 * @param options 参数设置
 * @param options.websocketUrl 必传参数，websocket地址
 * @param options.heartObj 必传参数，websocket心跳发送对象
 * @param options.timeout 可选，websocket心跳检查发送时间
 */
interface SettinsConfigType {
  websocketUrl: string
}
const WebsocketConfig: SettinsConfigType = {
  websocketUrl: "",
}
export const settinsConfig = (options: SettinsConfigType & HeartType) => {
  if(options) {
    WebsocketConfig.websocketUrl = options.websocketUrl
    heartCheck.timeout = options.timeout ? options.timeout : 9000
    heartCheck.heartObj = options.heartObj
  }
}
export const getSettinsConfig = (): SettinsConfigType & HeartType => {
  return {
    websocketUrl: WebsocketConfig.websocketUrl,
    timeout: heartCheck.timeout,
    heartObj: heartCheck.heartObj
  }
}
/**
 * @description 初始化websocket
 */
export const initWebsocket = () => {
  if(WebsocketConfig.websocketUrl === '') return console.log('websocket 连接地址未设置')
  const URL: string = WebsocketConfig.websocketUrl
  websock = new WebSocket(URL)
  websock.onopen = (e) => {
    isConnect = true
    heartCheck.start()
  }
}
/**
 * 连接发生错误的回调方法
 * @param callback (e:T) => T
 * @constructor
 */
export const OnError = <T,>(callback:(e: T) => T): T | {error: string} => {
  if(typeof callback !== 'function') return {error: 'callback not function'};
  websock.onerror = (e) => {
    isConnect = false
    return callback(e)
  }
}
/**
 * @description 返回错误日志
 * @param callback （e:any） => any
 */
export const abnormalClose = (callback: (e: any) => any) => {
  websock.onclose = (e) => {
    if(typeof callback === 'function') {
      callback(e)
    }
  }
}
/**
 * @description websocket send 发送消息
 * @param data any
 */
export const sendMsg = (data:any) => {
  if(websock.readyState !== 1 || !isConnect) {
    return;
  }
  let _d = JSON.stringify(data)
  websock.send(_d)
}

/**
 * @description 监听websocket message消息
 * @param callback (e:any) => any
 */
export const onMessage = (callback: (e: any) => any) => {
  if(typeof callback === 'function') {
    websock.onmessage = (e: any) => {
      callback(e)
    }
  }
}
