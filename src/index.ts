/**
 * @description websocketIO
 */
export let websock: any = null
let rec: any;
export let isConnect = false

/**
 * @description websocket连接配置
 * websocketUrl 连接地址
 * timeout 保持心跳时间
 * heartObj 发送的心跳包数据
 */
export const WebsocketConfig = {
  websocketUrl: "",
  timeout: 9000,
  heartObj: {}
}

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
interface HeartCheckType{
  timeout: number
  timeoutObj: any,
  heartObj: {[key:string]: string | number | any}
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
  timeout: WebsocketConfig.timeout, // 每一段时间发送一次心跳包，默认9秒
  timeoutObj: null, // 延时对象
  heartObj: WebsocketConfig.heartObj, // 心跳发送对象

  start: function() {
    let that = this
    this.timeoutObj = setInterval(function () {
      if(websock.readyState !== 1) {
        that.stop()
        isConnect = false
        reConnect()
        return
      }
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
  // 连接发生错误的回调方法
  websock.onerror = (e) => {
    isConnect = false
    reConnect()
  }
}
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
