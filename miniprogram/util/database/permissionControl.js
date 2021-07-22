import { db } from "./database"
const _db = wx.cloud.database()

var timeStrategy = {}
var ignoreLimit = false

export class PermissionControl {
  thisPermission = -1

  constructor() {
    _db.collection('user').where({
      _openid: '{openid}'
    }).get().then(res => {
      if (res.data.length == 0) this.thisPermission = 16
      else this.thisPermission = res.data[0].info.permission
    })
  }

  /**
   * 开发者在调试时忽略所有限制
   */
  ignoreLimitWhenDev() {
    if (__wxConfig.envVersion === 'develop') {
      ignoreLimit = true
      console.warn('已关闭所有数据库操作限制')
    }
  }

  /**
   * 拒绝的Promise
   */
  refusePromise() {
    return new Promise((res, rej) => { res({ refuse: true }) })
  }

  /**
   * 返回UNIX时间
   */
  getTime() {
    return new Date().getTime()
  }

  /**
   * 限制时间的策略
   * @param {string} key 策略键
   * @param {Number} time 限制的最小时间，单位毫秒
   * @param {string} title 被限制时提示框的标题
   * @returns {boolean} 是否允许操作，false时将显示提示框
   */
  limitTimeStrategy(key, time, title = "点得太快了\n休息一下吧") {
    // console.log('last:', timeStrategy[key], '\tthis:', this.getTime(), 'minus', this.getTime() - timeStrategy[key])
    if (ignoreLimit) return true
    if (timeStrategy[key] == undefined) {
      timeStrategy[key] = this.getTime()
      return true
    } else {
      let lastTime = timeStrategy[key]
      let res = this.getTime() - lastTime >= time
      timeStrategy[key] = this.getTime()
      if (!res) wx.showToast({
        title: title,
        mask: true,
        icon: 'none'
      })
      return res
    }
  }
}